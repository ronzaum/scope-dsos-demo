/**
 * PPTX Report Generator
 *
 * Takes parsed template JSON + sample data + theme config and produces
 * a PowerPoint file. Each inspection section maps to one or more slides.
 *
 * Architecture:
 *   generatePptx(data, theme, outputPath) → writes .pptx to disk
 *
 * Slide mapping:
 *   1. Cover (header fields, disclaimer banner)
 *   2. Scope & Limitations
 *   3. Methodology
 *   4. Thickness Survey (data table, multi-slide if needed)
 *   5. Visual Findings (one per slide with photo placeholder)
 *   6. Safety Devices
 *   7. Fitness-for-Service
 *   8. Conclusions & Declarations
 *   9. Appendices Checklist
 */

const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Auto-calculation helpers (mirror the template spec's formulas)
// ---------------------------------------------------------------------------

/**
 * Compute derived fields for a single TML row.
 * Returns the row enriched with corrosion rates, remaining life, and RAG status.
 */
function enrichTmlRow(row, yearOfManufacture, examDate) {
  const yearsInService = examDate.getFullYear() - yearOfManufacture;
  const enriched = { ...row };

  // Short-term corrosion rate (mm/yr)
  if (row.previousReading != null && row.previousReadingDate) {
    const prevDate = new Date(row.previousReadingDate);
    const yearsBetween = (examDate - prevDate) / (365.25 * 24 * 3600 * 1000);
    enriched.shortTermRate = yearsBetween > 0
      ? +((row.previousReading - row.currentReading) / yearsBetween).toFixed(3)
      : null;
  } else {
    enriched.shortTermRate = null;
  }

  // Long-term corrosion rate (mm/yr)
  enriched.longTermRate = yearsInService > 0
    ? +((row.nominalThickness - row.currentReading) / yearsInService).toFixed(3)
    : null;

  // Remaining life (years) — use higher of short/long term rate for conservatism
  const rate = Math.max(enriched.shortTermRate || 0, enriched.longTermRate || 0);
  enriched.remainingLife = rate > 0
    ? +((row.currentReading - row.minimumRequired) / rate).toFixed(1)
    : null;

  // RAG status classification
  if (enriched.remainingLife == null) {
    enriched.status = 'green';
  } else if (enriched.remainingLife < 2) {
    enriched.status = 'critical';
  } else if (enriched.remainingLife < 5) {
    enriched.status = 'red';
  } else if (enriched.remainingLife < 10) {
    enriched.status = 'amber';
  } else {
    enriched.status = 'green';
  }

  // Anomaly flags
  enriched.anomalies = [];
  if (enriched.shortTermRate != null && enriched.longTermRate != null
      && enriched.shortTermRate > 2 * enriched.longTermRate) {
    enriched.anomalies.push('Rate acceleration (ST > 2× LT)');
  }
  if (row.previousReading != null && row.currentReading > row.previousReading) {
    enriched.anomalies.push('Current > previous — check calibration');
  }

  return enriched;
}

// ---------------------------------------------------------------------------
// Slide builder helpers
// ---------------------------------------------------------------------------

/** Add standard header bar to the top of a slide. */
function addHeader(slide, title, theme, confidenceTag) {
  // Header background
  slide.addShape('rect', {
    x: 0, y: 0,
    w: theme.slide.width, h: theme.layout.headerHeight,
    fill: { color: theme.colors.headerBg }
  });

  // Title text
  slide.addText(title, {
    x: theme.layout.marginLeft,
    y: 0.15,
    w: theme.slide.width - theme.layout.marginLeft - 2.5,
    h: 0.55,
    fontSize: theme.fontSizes.slideTitle,
    fontFace: theme.fonts.heading,
    color: theme.colors.headerText,
    bold: true
  });

  // Confidence tag (if provided)
  if (confidenceTag) {
    const tagColors = {
      'Regulatory': theme.colors.confidenceRegulatory,
      'Industry Standard': theme.colors.confidenceIndustry,
      'Inferred': theme.colors.confidenceInferred
    };
    slide.addText(confidenceTag, {
      x: theme.layout.marginLeft,
      y: 0.65,
      w: 2.5,
      h: 0.25,
      fontSize: theme.fontSizes.small,
      fontFace: theme.fonts.body,
      color: tagColors[confidenceTag] || theme.colors.mutedText,
      italic: true
    });
  }

  // Logo placeholder
  if (theme.logo.enabled) {
    if (theme.logo.path && fs.existsSync(theme.logo.path)) {
      slide.addImage({
        path: theme.logo.path,
        x: theme.logo.position.x, y: theme.logo.position.y,
        w: theme.logo.width, h: theme.logo.height
      });
    } else if (theme.logo.placeholder) {
      slide.addShape('rect', {
        x: theme.logo.position.x, y: theme.logo.position.y,
        w: theme.logo.width, h: theme.logo.height,
        fill: { color: 'E2E8F0' },
        line: { color: '94A3B8', width: 0.5 }
      });
      slide.addText('[Logo]', {
        x: theme.logo.position.x, y: theme.logo.position.y,
        w: theme.logo.width, h: theme.logo.height,
        fontSize: 8, fontFace: theme.fonts.body,
        color: theme.colors.mutedText,
        align: 'center', valign: 'middle'
      });
    }
  }
}

/** Add footer with watermark to the bottom of a slide. */
function addFooter(slide, theme, reportNumber) {
  const y = theme.slide.height - theme.layout.footerHeight;
  slide.addShape('rect', {
    x: 0, y,
    w: theme.slide.width, h: theme.layout.footerHeight,
    fill: { color: 'F8FAFC' }
  });
  // Report number
  slide.addText(reportNumber || '', {
    x: theme.layout.marginLeft, y,
    w: 4, h: theme.layout.footerHeight,
    fontSize: theme.fontSizes.footer,
    fontFace: theme.fonts.body,
    color: theme.colors.mutedText,
    valign: 'middle'
  });
  // Watermark
  slide.addText(theme.watermark.text, {
    x: theme.slide.width - 3, y,
    w: 2.5, h: theme.layout.footerHeight,
    fontSize: theme.watermark.fontSize,
    fontFace: theme.fonts.body,
    color: theme.watermark.color,
    align: 'right', valign: 'middle'
  });
}

/** Content area Y start (below header). */
function contentY(theme) {
  return theme.layout.headerHeight + theme.layout.contentGap;
}

/** Content area available height. */
function contentH(theme) {
  return theme.slide.height - theme.layout.headerHeight - theme.layout.footerHeight
    - theme.layout.contentGap * 2;
}

/** Content area available width. */
function contentW(theme) {
  return theme.slide.width - theme.layout.marginLeft - theme.layout.marginRight;
}

/** Build a simple 2-column key-value table. */
function addKeyValueTable(slide, rows, theme, startY, options = {}) {
  const w = options.width || contentW(theme);
  const x = options.x || theme.layout.marginLeft;
  const colWidths = [w * 0.35, w * 0.65];

  const tableRows = rows.map(([label, value]) => [
    { text: label, options: {
      fontSize: theme.fontSizes.tableBody, fontFace: theme.fonts.body,
      color: theme.colors.mutedText, bold: true, valign: 'top'
    }},
    { text: String(value ?? '—'), options: {
      fontSize: theme.fontSizes.tableBody, fontFace: theme.fonts.body,
      color: theme.colors.bodyText, valign: 'top'
    }}
  ]);

  slide.addTable(tableRows, {
    x, y: startY, w,
    colW: colWidths,
    border: { type: 'solid', pt: 0.5, color: theme.colors.tableBorder },
    rowH: 0.3,
    autoPage: false
  });
}

// ---------------------------------------------------------------------------
// Slide builders — one function per section
// ---------------------------------------------------------------------------

/** Slide 1: Cover page with disclaimer banner. */
function buildCoverSlide(pptx, data, theme) {
  const slide = pptx.addSlide();
  const h = data.header;

  // Full-slide background
  slide.addShape('rect', {
    x: 0, y: 0,
    w: theme.slide.width, h: theme.slide.height,
    fill: { color: theme.colors.headerBg }
  });

  // Disclaimer banner at top
  slide.addShape('rect', {
    x: 0, y: 0,
    w: theme.slide.width, h: 0.5,
    fill: { color: theme.colors.disclaimerBg }
  });
  slide.addText('DEMONSTRATION — Simulated Inspection Data', {
    x: 0, y: 0,
    w: theme.slide.width, h: 0.5,
    fontSize: theme.fontSizes.disclaimer, fontFace: theme.fonts.body,
    color: theme.colors.disclaimerText,
    bold: true, align: 'center', valign: 'middle'
  });

  // Logo placeholder
  if (theme.logo.enabled && theme.logo.placeholder) {
    slide.addShape('rect', {
      x: (theme.slide.width - 2) / 2, y: 1.0,
      w: 2, h: 0.75,
      fill: { color: '2E5090' },
      line: { color: '3B82F6', width: 1 }
    });
    slide.addText('[Client / TIC Body Logo]', {
      x: (theme.slide.width - 2) / 2, y: 1.0,
      w: 2, h: 0.75,
      fontSize: 9, fontFace: theme.fonts.body,
      color: theme.colors.headerText,
      align: 'center', valign: 'middle'
    });
  }

  // Report title
  slide.addText('Inspection Report', {
    x: 1.5, y: 2.1,
    w: theme.slide.width - 3, h: 0.6,
    fontSize: 32, fontFace: theme.fonts.heading,
    color: theme.colors.headerText,
    bold: true, align: 'center'
  });

  // Equipment description
  slide.addText(h.equipmentDescription, {
    x: 1.5, y: 2.8,
    w: theme.slide.width - 3, h: 0.5,
    fontSize: 14, fontFace: theme.fonts.body,
    color: theme.colors.accent,
    align: 'center'
  });

  // Key details table on cover — adapt for pipeline vs vessel
  const isPipeline = !!h.pipelineCircuitId;
  const details = isPipeline ? [
    ['Report No.', h.reportNumber],
    ['Circuit ID', h.pipelineCircuitId],
    ['Line No.', h.lineNumber],
    ['Service', h.serviceDescription],
    ['Client', h.clientName],
    ['Site', h.siteName],
    ['Date of Examination', h.dateOfExamination],
    ['Standard', 'API 570'],
    ['Inspector', `${h.inspectorName} — ${h.inspectorQualification}`]
  ] : [
    ['Report No.', h.reportNumber],
    ['Vessel Tag', h.vesselTagNumber],
    ['Client', h.clientName],
    ['Site', h.siteName],
    ['Date of Examination', h.dateOfExamination],
    ['Standard', 'API 510'],
    ['Inspector', `${h.inspectorName} — ${h.inspectorQualification}`]
  ];

  const tableRows = details.map(([label, value]) => [
    { text: label, options: {
      fontSize: 10, fontFace: theme.fonts.body,
      color: 'CBD5E1', bold: true, align: 'right'
    }},
    { text: value, options: {
      fontSize: 10, fontFace: theme.fonts.body,
      color: theme.colors.headerText
    }}
  ]);

  slide.addTable(tableRows, {
    x: 2.5, y: 3.6, w: 8.3,
    colW: [2.5, 5.8],
    border: { type: 'none' },
    rowH: 0.3
  });

  // Watermark
  slide.addText(theme.watermark.text, {
    x: theme.slide.width - 3, y: theme.slide.height - 0.4,
    w: 2.5, h: 0.3,
    fontSize: theme.watermark.fontSize,
    fontFace: theme.fonts.body,
    color: '475569',
    align: 'right', valign: 'middle'
  });
}

/** Slide 2: Scope & Limitations. */
function buildScopeSlide(pptx, data, theme) {
  const slide = pptx.addSlide();
  const s = data.scopeAndLimitations;

  addHeader(slide, 'Scope and Limitations', theme, 'Regulatory');
  addFooter(slide, theme, data.header.reportNumber);

  const rows = [
    ['Areas Examined', s.areasExamined.join('\n')],
    ['Areas NOT Examined', (s.areasNotExamined || []).join('\n') || 'None'],
    ['Limitations', s.examinationLimitations || 'None'],
    ['Access Method', s.accessMethod],
    ['Confined Space Entry', s.confinedSpaceEntry ? `Yes — Permit: ${s.confinedSpacePermit}` : 'No'],
    ['Surface Preparation', s.surfacePreparation]
  ];

  addKeyValueTable(slide, rows, theme, contentY(theme));
}

/** Slide 3: Methodology. */
function buildMethodologySlide(pptx, data, theme) {
  const slide = pptx.addSlide();
  const m = data.methodology;

  addHeader(slide, 'Methodology', theme, 'Industry Standard');
  addFooter(slide, theme, data.header.reportNumber);

  const rows = [
    ['Visual Examination', m.visualExamination ? 'Yes' : 'No'],
    ['Ultrasonic Thickness', m.ultrasonicThickness ? 'Yes' : 'No'],
    ['UT Instrument', m.utInstrument || '—'],
    ['UT Probe', m.utProbe || '—'],
    ['Calibration Block', m.calibrationBlock || '—'],
    ['Additional NDT', (m.additionalNdtMethods || []).join(', ') || 'None'],
    ['Additional NDT Details', m.additionalNdtDetails || '—'],
    ['Reference Procedures', m.referenceProcedures]
  ];

  addKeyValueTable(slide, rows, theme, contentY(theme));
}

/** Slides 4+: Thickness Survey — data table, split across multiple slides if needed. */
function buildThicknessSurveySlides(pptx, data, theme) {
  const examDate = new Date(data.header.dateOfExamination);
  const yearOrigin = data.header.yearOfManufacture || data.header.yearOfInstallation;
  const enriched = data.thicknessSurvey.map(row =>
    enrichTmlRow(row, yearOrigin, examDate)
  );

  // Table header row
  const headerRow = [
    'TML ID', 'Nominal\n(mm)', 'Previous\n(mm)', 'Current\n(mm)', 'Min Req\n(mm)',
    'ST Rate\n(mm/yr)', 'LT Rate\n(mm/yr)', 'Rem. Life\n(yr)', 'Status'
  ].map(text => ({
    text,
    options: {
      fontSize: theme.fontSizes.tableHeader, fontFace: theme.fonts.body,
      color: theme.colors.tableHeaderText, fill: { color: theme.colors.tableHeaderBg },
      bold: true, align: 'center', valign: 'middle'
    }
  }));

  // Data rows
  const dataRows = enriched.map(row => {
    const ragStyle = theme.rag[row.status] || theme.rag.green;
    return [
      row.tmlId,
      row.nominalThickness.toFixed(1),
      row.previousReading != null ? row.previousReading.toFixed(1) : '—',
      row.currentReading.toFixed(1),
      row.minimumRequired.toFixed(1),
      row.shortTermRate != null ? row.shortTermRate.toFixed(3) : '—',
      row.longTermRate != null ? row.longTermRate.toFixed(3) : '—',
      row.remainingLife != null ? row.remainingLife.toFixed(1) : '—',
      { text: ragStyle.label, options: { fill: { color: ragStyle.fill }, color: ragStyle.text } }
    ].map((cell, i) => {
      if (typeof cell === 'object' && cell.text) {
        return { text: cell.text, options: {
          ...cell.options,
          fontSize: theme.fontSizes.tableBody, fontFace: theme.fonts.body,
          align: 'center', valign: 'middle'
        }};
      }
      return { text: String(cell), options: {
        fontSize: theme.fontSizes.tableBody, fontFace: theme.fonts.body,
        color: theme.colors.bodyText, align: 'center', valign: 'middle'
      }};
    });
  });

  // Split into chunks that fit on a slide (~12 rows per slide)
  const ROWS_PER_SLIDE = 12;
  const chunks = [];
  for (let i = 0; i < dataRows.length; i += ROWS_PER_SLIDE) {
    chunks.push(dataRows.slice(i, i + ROWS_PER_SLIDE));
  }

  chunks.forEach((chunk, idx) => {
    const slide = pptx.addSlide();
    const title = chunks.length > 1
      ? `Thickness Survey (${idx + 1}/${chunks.length})`
      : 'Thickness Survey';

    addHeader(slide, title, theme, 'Regulatory');
    addFooter(slide, theme, data.header.reportNumber);

    const colW = [1.1, 0.85, 0.85, 0.85, 0.85, 0.9, 0.9, 0.9, 1.5];

    slide.addTable([headerRow, ...chunk], {
      x: theme.layout.marginLeft,
      y: contentY(theme),
      w: contentW(theme),
      colW,
      border: { type: 'solid', pt: 0.5, color: theme.colors.tableBorder },
      rowH: 0.33,
      autoPage: false
    });

    // Anomaly callouts below table (if any flagged rows in this chunk)
    const startIdx = idx * ROWS_PER_SLIDE;
    const chunkEnriched = enriched.slice(startIdx, startIdx + chunk.length);
    const anomalies = chunkEnriched.filter(r => r.anomalies.length > 0);
    if (anomalies.length > 0) {
      const anomalyText = anomalies.map(r =>
        `⚠ ${r.tmlId}: ${r.anomalies.join('; ')}`
      ).join('\n');
      const tableBottom = contentY(theme) + 0.33 * (chunk.length + 1) + 0.15;
      slide.addText(anomalyText, {
        x: theme.layout.marginLeft,
        y: tableBottom,
        w: contentW(theme),
        h: 0.5,
        fontSize: theme.fontSizes.small,
        fontFace: theme.fonts.body,
        color: 'DC2626',
        italic: true
      });
    }
  });
}

/** Slides: Visual Findings — one slide per finding (default) or summary table. */
function buildFindingsSlides(pptx, data, theme) {
  if (theme.findingLayout === 'summary-table') {
    buildFindingsSummarySlide(pptx, data, theme);
  } else {
    // One finding per slide (default)
    data.visualFindings.forEach(finding => {
      buildSingleFindingSlide(pptx, finding, data.header.reportNumber, theme);
    });
  }
}

/** Single finding slide with photo placeholder. */
function buildSingleFindingSlide(pptx, finding, reportNumber, theme) {
  const slide = pptx.addSlide();

  addHeader(slide, `Finding ${finding.findingId}`, theme, 'Industry Standard');
  addFooter(slide, theme, reportNumber);

  const leftW = contentW(theme) * 0.5 - 0.1;
  const rightX = theme.layout.marginLeft + leftW + 0.2;
  const rightW = contentW(theme) * 0.5 - 0.1;
  const y = contentY(theme);

  // Left side: key-value details
  const rows = [
    ['Location', finding.location],
    ['Type', finding.findingType],
    ['Severity', finding.severity],
    ['Dimensions', finding.dimensions || '—'],
    ['Criteria', finding.acceptanceCriteria],
    ['Timeframe', finding.timeframe]
  ];

  const tableRows = rows.map(([label, value]) => [
    { text: label, options: {
      fontSize: theme.fontSizes.tableBody, fontFace: theme.fonts.body,
      color: theme.colors.mutedText, bold: true, valign: 'top'
    }},
    { text: String(value), options: {
      fontSize: theme.fontSizes.tableBody, fontFace: theme.fonts.body,
      color: theme.colors.bodyText, valign: 'top'
    }}
  ]);

  slide.addTable(tableRows, {
    x: theme.layout.marginLeft, y,
    w: leftW,
    colW: [leftW * 0.35, leftW * 0.65],
    border: { type: 'solid', pt: 0.5, color: theme.colors.tableBorder },
    rowH: 0.35,
    autoPage: false
  });

  // Right side: photo placeholder
  const ph = theme.photoPlaceholder;
  const photoW = Math.min(ph.width, rightW);
  const photoH = Math.min(ph.height, 2.8);
  slide.addShape('rect', {
    x: rightX, y,
    w: photoW, h: photoH,
    fill: { color: ph.fillColor },
    line: { color: ph.borderColor, width: 1, dashType: 'dash' }
  });
  slide.addText(`${ph.label}\n${finding.photographReference || ''}`, {
    x: rightX, y,
    w: photoW, h: photoH,
    fontSize: 9, fontFace: theme.fonts.body,
    color: theme.colors.mutedText,
    align: 'center', valign: 'middle'
  });

  // Description below
  const descY = y + Math.max(0.35 * rows.length, photoH) + 0.15;
  slide.addText([
    { text: 'Description: ', options: { bold: true, color: theme.colors.mutedText } },
    { text: finding.description, options: { color: theme.colors.bodyText } }
  ], {
    x: theme.layout.marginLeft, y: descY,
    w: contentW(theme), h: 0.6,
    fontSize: theme.fontSizes.body, fontFace: theme.fonts.body,
    valign: 'top', wrap: true
  });

  // Recommendation
  const recY = descY + 0.65;
  slide.addText([
    { text: 'Recommendation: ', options: { bold: true, color: theme.colors.mutedText } },
    { text: finding.recommendation, options: { color: theme.colors.bodyText } }
  ], {
    x: theme.layout.marginLeft, y: recY,
    w: contentW(theme), h: 0.6,
    fontSize: theme.fontSizes.body, fontFace: theme.fonts.body,
    valign: 'top', wrap: true
  });

  // NDT follow-up flag
  if (finding.ndtFollowUpRequired) {
    slide.addText(`NDT Follow-Up: ${finding.ndtMethodRecommended || 'Required'}`, {
      x: theme.layout.marginLeft, y: recY + 0.65,
      w: contentW(theme), h: 0.25,
      fontSize: theme.fontSizes.small, fontFace: theme.fonts.body,
      color: 'DC2626', bold: true
    });
  }
}

/** Summary table layout for findings (compact alternative). */
function buildFindingsSummarySlide(pptx, data, theme) {
  const slide = pptx.addSlide();
  addHeader(slide, 'Visual Findings Summary', theme, 'Industry Standard');
  addFooter(slide, theme, data.header.reportNumber);

  const headerRow = ['ID', 'Location', 'Type', 'Severity', 'Timeframe'].map(text => ({
    text,
    options: {
      fontSize: theme.fontSizes.tableHeader, fontFace: theme.fonts.body,
      color: theme.colors.tableHeaderText, fill: { color: theme.colors.tableHeaderBg },
      bold: true, align: 'center', valign: 'middle'
    }
  }));

  const rows = data.visualFindings.map(f => [
    f.findingId, f.location, f.findingType, f.severity, f.timeframe
  ].map(text => ({
    text: String(text),
    options: {
      fontSize: theme.fontSizes.tableBody, fontFace: theme.fonts.body,
      color: theme.colors.bodyText, valign: 'top'
    }
  })));

  slide.addTable([headerRow, ...rows], {
    x: theme.layout.marginLeft, y: contentY(theme),
    w: contentW(theme),
    colW: [0.8, 3.5, 2.0, 3.0, 2.5],
    border: { type: 'solid', pt: 0.5, color: theme.colors.tableBorder },
    rowH: 0.45,
    autoPage: false
  });
}

/** Slide: Safety Devices. */
function buildSafetyDevicesSlide(pptx, data, theme) {
  const slide = pptx.addSlide();
  addHeader(slide, 'Safety Devices', theme, 'Regulatory');
  addFooter(slide, theme, data.header.reportNumber);

  const headerRow = ['Device Type', 'ID / Tag', 'Set Pressure', 'Last Test', 'Result'].map(text => ({
    text,
    options: {
      fontSize: theme.fontSizes.tableHeader, fontFace: theme.fonts.body,
      color: theme.colors.tableHeaderText, fill: { color: theme.colors.tableHeaderBg },
      bold: true, align: 'center', valign: 'middle'
    }
  }));

  const rows = data.safetyDevices.map(d => [
    d.deviceType,
    d.deviceId,
    d.setPressure != null ? `${d.setPressure} bar` : 'N/A',
    d.lastTestDate,
    d.testResult
  ].map(text => ({
    text: String(text),
    options: {
      fontSize: theme.fontSizes.tableBody, fontFace: theme.fonts.body,
      color: theme.colors.bodyText, align: 'center', valign: 'middle'
    }
  })));

  slide.addTable([headerRow, ...rows], {
    x: theme.layout.marginLeft, y: contentY(theme),
    w: contentW(theme),
    colW: [3.0, 1.8, 1.5, 1.8, 1.8],
    border: { type: 'solid', pt: 0.5, color: theme.colors.tableBorder },
    rowH: 0.4,
    autoPage: false
  });

  // Notes below table
  const notesY = contentY(theme) + 0.4 * (data.safetyDevices.length + 1) + 0.2;
  data.safetyDevices.forEach((d, i) => {
    if (d.notes) {
      slide.addText(`${d.deviceId}: ${d.notes}`, {
        x: theme.layout.marginLeft, y: notesY + i * 0.25,
        w: contentW(theme), h: 0.25,
        fontSize: theme.fontSizes.small, fontFace: theme.fonts.body,
        color: theme.colors.mutedText, italic: true
      });
    }
  });
}

/** Slide: Fitness-for-Service. */
function buildFfsSlide(pptx, data, theme) {
  const slide = pptx.addSlide();
  const f = data.fitnessForService;

  addHeader(slide, 'Fitness-for-Service Assessment', theme, 'Regulatory');
  addFooter(slide, theme, data.header.reportNumber);

  if (!f.ffsRequired) {
    slide.addText('No FFS assessment required for this examination.', {
      x: theme.layout.marginLeft, y: contentY(theme) + 1,
      w: contentW(theme), h: 0.5,
      fontSize: theme.fontSizes.body, fontFace: theme.fonts.body,
      color: theme.colors.mutedText, align: 'center'
    });
    return;
  }

  const rows = [
    ['FFS Required', 'Yes'],
    ['Assessment Method', f.assessmentMethod],
    ['Defect Assessed', f.defectTypeAssessed],
    ['Result', f.result],
    ['Conditions', f.conditionsForContinuedService || '—'],
    ['Reference', f.assessmentReference]
  ];

  addKeyValueTable(slide, rows, theme, contentY(theme));
}

/** Slide: Conclusions & Declarations (combined). */
function buildConclusionsSlide(pptx, data, theme) {
  const slide = pptx.addSlide();
  const c = data.conclusions;

  addHeader(slide, 'Conclusions', theme, 'Industry Standard');
  addFooter(slide, theme, data.header.reportNumber);

  const rows = [
    ['Overall Condition', c.overallCondition],
    ['Safe to Continue', c.safeToContinue ? 'Yes' : 'No'],
    ['Conditions', c.conditionsForContinuedService || 'None'],
    ['Statutory Report', c.statutoryReportRaised ? `Yes — ${c.statutoryReportRef}` : 'No'],
    ['Next Examination', `${c.nextExaminationType} — ${c.nextExaminationDate}`],
    ['Interval Justification', c.recommendedIntervalJustification]
  ];

  addKeyValueTable(slide, rows, theme, contentY(theme));

  // Critical findings summary below
  const summaryY = contentY(theme) + 0.3 * rows.length + 0.3;
  slide.addText([
    { text: 'Critical Findings Summary\n', options: { bold: true, fontSize: theme.fontSizes.sectionTitle, color: theme.colors.primary } },
    { text: c.summaryOfCriticalFindings, options: { fontSize: theme.fontSizes.body, color: theme.colors.bodyText } }
  ], {
    x: theme.layout.marginLeft, y: summaryY,
    w: contentW(theme), h: 2.0,
    fontFace: theme.fonts.body, valign: 'top', wrap: true
  });
}

/** Slide: Declarations. */
function buildDeclarationsSlide(pptx, data, theme) {
  const slide = pptx.addSlide();
  const d = data.declarations;

  addHeader(slide, 'Declarations', theme, 'Regulatory');
  addFooter(slide, theme, data.header.reportNumber);

  const rows = [
    ['Competent Person Declaration', d.competentPersonDeclaration ? '✓ Confirmed' : '—'],
    ['Accreditation', d.accreditationStatement],
    ['Independence Declaration', d.independenceDeclaration ? '✓ Confirmed' : '—'],
    ['Inspector', d.inspectorName],
    ['Date Signed', d.dateSigned],
    ['Technical Reviewer', d.technicalReviewer || '—'],
    ['Reviewer Date', d.reviewerDateSigned || '—']
  ];

  addKeyValueTable(slide, rows, theme, contentY(theme));

  // Signature placeholders
  const sigY = contentY(theme) + 0.3 * rows.length + 0.4;
  const sigW = 3;

  // Inspector signature
  slide.addShape('rect', {
    x: theme.layout.marginLeft, y: sigY,
    w: sigW, h: 1.0,
    line: { color: theme.colors.tableBorder, width: 1, dashType: 'dash' }
  });
  slide.addText('[Inspector Signature]', {
    x: theme.layout.marginLeft, y: sigY,
    w: sigW, h: 1.0,
    fontSize: 9, fontFace: theme.fonts.body,
    color: theme.colors.mutedText,
    align: 'center', valign: 'middle'
  });

  // Reviewer signature
  if (d.technicalReviewer) {
    slide.addShape('rect', {
      x: theme.layout.marginLeft + sigW + 0.5, y: sigY,
      w: sigW, h: 1.0,
      line: { color: theme.colors.tableBorder, width: 1, dashType: 'dash' }
    });
    slide.addText('[Reviewer Signature]', {
      x: theme.layout.marginLeft + sigW + 0.5, y: sigY,
      w: sigW, h: 1.0,
      fontSize: 9, fontFace: theme.fonts.body,
      color: theme.colors.mutedText,
      align: 'center', valign: 'middle'
    });
  }
}

/** Slide: Appendices Checklist. */
function buildAppendicesSlide(pptx, data, theme) {
  const slide = pptx.addSlide();
  addHeader(slide, 'Appendices Checklist', theme, 'Industry Standard');
  addFooter(slide, theme, data.header.reportNumber);

  // Determine which appendices are included based on data
  const hasPaut = (data.methodology.additionalNdtMethods || []).includes('PAUT');
  const hasAdditionalNdt = (data.methodology.additionalNdtMethods || []).length > 0;
  const hasFfs = data.fitnessForService.ffsRequired;
  const isPipelineAppendix = !!data.header.pipelineCircuitId;

  const appendices = [
    ['Photographs', 'Yes', `${data.visualFindings.length} findings documented`],
    [isPipelineAppendix ? 'CML Location Diagram / Isometric' : 'TML Location Diagram', 'Yes', `${data.thicknessSurvey.length} ${isPipelineAppendix ? 'CMLs' : 'TMLs'} mapped`],
    ...(isPipelineAppendix ? [['P&ID Markup', 'Yes', 'Marked-up P&ID showing inspection extent']] : []),
    ['Corrosion Mapping', hasPaut ? 'Yes' : 'N/A', hasPaut ? 'PAUT grid scan data' : 'No PAUT performed'],
    ['NDT Reports/Certificates', hasAdditionalNdt ? 'Yes' : 'N/A', hasAdditionalNdt ? data.methodology.additionalNdtMethods.join(', ') : 'No additional NDT'],
    ['Calibration Certificates', 'Yes', 'UT instrument and probes'],
    ['Previous Report Data', 'Yes', `Reference: ${data.header.previousReportReference}`],
    ['FFS Calculation Summary', hasFfs ? 'Yes' : 'N/A', hasFfs ? data.fitnessForService.assessmentReference : 'No FFS required']
  ];

  const headerRow = ['Appendix', 'Included', 'Notes'].map(text => ({
    text,
    options: {
      fontSize: theme.fontSizes.tableHeader, fontFace: theme.fonts.body,
      color: theme.colors.tableHeaderText, fill: { color: theme.colors.tableHeaderBg },
      bold: true, align: 'center', valign: 'middle'
    }
  }));

  const rows = appendices.map(([appendix, included, notes]) => [
    { text: appendix, options: {
      fontSize: theme.fontSizes.tableBody, fontFace: theme.fonts.body,
      color: theme.colors.bodyText, bold: true, valign: 'middle'
    }},
    { text: included, options: {
      fontSize: theme.fontSizes.tableBody, fontFace: theme.fonts.body,
      color: included === 'Yes' ? '166534' : theme.colors.mutedText,
      align: 'center', valign: 'middle'
    }},
    { text: notes, options: {
      fontSize: theme.fontSizes.tableBody, fontFace: theme.fonts.body,
      color: theme.colors.mutedText, valign: 'middle'
    }}
  ]);

  slide.addTable([headerRow, ...rows], {
    x: theme.layout.marginLeft, y: contentY(theme),
    w: contentW(theme),
    colW: [3.0, 1.5, 7.8],
    border: { type: 'solid', pt: 0.5, color: theme.colors.tableBorder },
    rowH: 0.4,
    autoPage: false
  });
}

/** Slide: Corrosion Under Insulation (CUI) Assessment — pipeline-specific. */
function buildCuiSlide(pptx, data, theme) {
  const slide = pptx.addSlide();
  const cui = data.cuiAssessment;

  addHeader(slide, 'CUI Assessment', theme, 'Industry Standard');
  addFooter(slide, theme, data.header.reportNumber);

  if (!cui.cuiAssessmentPerformed) {
    slide.addText('No CUI assessment performed for this examination.', {
      x: theme.layout.marginLeft, y: contentY(theme) + 1,
      w: contentW(theme), h: 0.5,
      fontSize: theme.fontSizes.body, fontFace: theme.fonts.body,
      color: theme.colors.mutedText, align: 'center'
    });
    return;
  }

  // Summary
  const findings = cui.cuiFindings || [];
  const cuiFound = findings.filter(f => f.cuiFound);
  slide.addText(`${cui.locationsInspected} locations inspected — ${cuiFound.length} with CUI findings`, {
    x: theme.layout.marginLeft, y: contentY(theme),
    w: contentW(theme), h: 0.35,
    fontSize: theme.fontSizes.body, fontFace: theme.fonts.body,
    color: theme.colors.bodyText, bold: true
  });

  // Findings table
  if (cuiFound.length > 0) {
    const headerRow = ['Location', 'Severity', 'Wall Loss', 'Insulation', 'Jacketing'].map(text => ({
      text,
      options: {
        fontSize: theme.fontSizes.tableHeader, fontFace: theme.fonts.body,
        color: theme.colors.tableHeaderText, fill: { color: theme.colors.tableHeaderBg },
        bold: true, align: 'center', valign: 'middle'
      }
    }));

    const rows = cuiFound.map(f => [
      f.location, f.cuiSeverity, f.wallLoss > 0 ? `${f.wallLoss} mm` : 'None',
      f.insulationCondition, f.jacketingCondition
    ].map(text => ({
      text: String(text),
      options: {
        fontSize: theme.fontSizes.tableBody, fontFace: theme.fonts.body,
        color: theme.colors.bodyText, valign: 'middle'
      }
    })));

    slide.addTable([headerRow, ...rows], {
      x: theme.layout.marginLeft, y: contentY(theme) + 0.45,
      w: contentW(theme),
      colW: [3.0, 2.5, 1.2, 1.8, 1.8],
      border: { type: 'solid', pt: 0.5, color: theme.colors.tableBorder },
      rowH: 0.4,
      autoPage: false
    });
  }
}

/** Slide: Injection Point Assessment — pipeline-specific. */
function buildInjectionPointSlide(pptx, data, theme) {
  const slide = pptx.addSlide();
  const ip = data.injectionPointAssessment;

  addHeader(slide, 'Injection Point Assessment', theme, 'Regulatory');
  addFooter(slide, theme, data.header.reportNumber);

  if (!ip.injectionPointPresent) {
    slide.addText('No injection points present on this circuit.', {
      x: theme.layout.marginLeft, y: contentY(theme) + 1,
      w: contentW(theme), h: 0.5,
      fontSize: theme.fontSizes.body, fontFace: theme.fonts.body,
      color: theme.colors.mutedText, align: 'center'
    });
    return;
  }

  const rows = [
    ['Injection Type', ip.injectionType],
    ['Chemical', ip.injectionChemical],
    ['Downstream Extent', ip.downstreamInspectionExtent],
    ['Corrosion Pattern', ip.corrosionPattern],
    ['CML References', ip.cmlReadingsAtInjectionPoint],
    ['Recommendation', ip.recommendation]
  ];

  addKeyValueTable(slide, rows, theme, contentY(theme));
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Generate a PPTX report from inspection data and theme config.
 *
 * @param {object} data   - Parsed inspection data (matches sample-data schema)
 * @param {object} theme  - Theme configuration (from themes/default.json)
 * @param {string} outputPath - Full path to write the .pptx file
 * @returns {Promise<string>} - Resolves with the output file path
 */
async function generatePptx(data, theme, outputPath) {
  const pptx = new pptxgen();

  // Presentation metadata
  const isPipelineReport = !!data.header.pipelineCircuitId;
  pptx.author = 'DS-OS Report Generator';
  pptx.title = `Inspection Report — ${isPipelineReport ? data.header.pipelineCircuitId : data.header.vesselTagNumber}`;
  pptx.subject = `${data.header.equipmentDescription} — ${isPipelineReport ? 'API 570' : 'API 510'}`;
  pptx.company = data.header.clientName;

  // Slide dimensions from theme
  pptx.defineLayout({
    name: 'CUSTOM',
    width: theme.slide.width,
    height: theme.slide.height
  });
  pptx.layout = 'CUSTOM';

  // Build all slides in section order
  buildCoverSlide(pptx, data, theme);
  buildScopeSlide(pptx, data, theme);
  buildMethodologySlide(pptx, data, theme);
  buildThicknessSurveySlides(pptx, data, theme);
  buildFindingsSlides(pptx, data, theme);
  // Pipeline-specific sections
  if (data.cuiAssessment) buildCuiSlide(pptx, data, theme);
  if (data.injectionPointAssessment) buildInjectionPointSlide(pptx, data, theme);
  buildSafetyDevicesSlide(pptx, data, theme);
  buildFfsSlide(pptx, data, theme);
  buildConclusionsSlide(pptx, data, theme);
  buildDeclarationsSlide(pptx, data, theme);
  buildAppendicesSlide(pptx, data, theme);

  // Ensure output directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write to disk
  await pptx.writeFile({ fileName: outputPath });
  return outputPath;
}

module.exports = { generatePptx, enrichTmlRow };
