/**
 * PDF Report Generator
 *
 * Takes parsed inspection data + theme config and produces a PDF report.
 * Uses PDFKit for direct generation (no LibreOffice dependency).
 *
 * The PDF mirrors the PPTX content and structure — same sections, same data,
 * same RAG coloring — but formatted for continuous-page reading rather than
 * slide-by-slide presentation.
 *
 * Architecture:
 *   generatePdf(data, theme, outputPath) → writes .pdf to disk
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { enrichTmlRow } = require('./pptx');

// ---------------------------------------------------------------------------
// Color helpers — PDFKit expects '#RRGGBB' format
// ---------------------------------------------------------------------------
function hex(color) {
  return color.startsWith('#') ? color : `#${color}`;
}

// ---------------------------------------------------------------------------
// Layout constants derived from theme
// ---------------------------------------------------------------------------
function getLayout(theme) {
  const margin = 50;
  const pageWidth = 595.28;  // A4
  const pageHeight = 841.89;
  const contentWidth = pageWidth - margin * 2;
  return { margin, pageWidth, pageHeight, contentWidth };
}

// ---------------------------------------------------------------------------
// Reusable drawing helpers
// ---------------------------------------------------------------------------

/**
 * Draw a section header bar with title text.
 * Returns the Y position after the header.
 */
function drawSectionHeader(doc, title, theme, layout, confidenceTag) {
  const y = doc.y;
  const headerH = 28;

  // Background bar
  doc.save();
  doc.rect(layout.margin, y, layout.contentWidth, headerH)
    .fill(hex(theme.colors.headerBg));

  // Title text
  doc.font('Helvetica-Bold').fontSize(13)
    .fillColor(hex(theme.colors.headerText))
    .text(title, layout.margin + 10, y + 7, {
      width: layout.contentWidth - 100,
      height: headerH
    });

  // Confidence tag
  if (confidenceTag) {
    const tagColors = {
      'Regulatory': theme.colors.confidenceRegulatory,
      'Industry Standard': theme.colors.confidenceIndustry,
      'Inferred': theme.colors.confidenceInferred
    };
    doc.font('Helvetica-Oblique').fontSize(8)
      .fillColor(hex(tagColors[confidenceTag] || theme.colors.mutedText))
      .text(confidenceTag, layout.margin + layout.contentWidth - 120, y + 10, {
        width: 110, align: 'right'
      });
  }

  doc.restore();
  doc.y = y + headerH + 10;
  doc.fillColor(hex(theme.colors.bodyText));
  return doc.y;
}

/**
 * Draw a key-value pair row.
 * Returns the new Y position.
 */
function drawKvRow(doc, label, value, theme, layout) {
  const labelW = 160;
  const valueW = layout.contentWidth - labelW - 10;
  const x = layout.margin;
  const y = doc.y;

  // Measure value height for multi-line
  const valueH = doc.font('Helvetica').fontSize(9)
    .heightOfString(String(value ?? '—'), { width: valueW });
  const rowH = Math.max(valueH + 6, 16);

  // Alternating stripe
  if (doc._kvRowIdx == null) doc._kvRowIdx = 0;
  if (doc._kvRowIdx % 2 === 1) {
    doc.save();
    doc.rect(x, y, layout.contentWidth, rowH).fill(hex(theme.colors.tableStripeBg));
    doc.restore();
  }
  doc._kvRowIdx++;

  // Label
  doc.font('Helvetica-Bold').fontSize(9)
    .fillColor(hex(theme.colors.mutedText))
    .text(label, x + 5, y + 3, { width: labelW, height: rowH });

  // Value
  doc.font('Helvetica').fontSize(9)
    .fillColor(hex(theme.colors.bodyText))
    .text(String(value ?? '—'), x + labelW + 10, y + 3, { width: valueW, height: rowH + 20 });

  doc.y = y + rowH;
  return doc.y;
}

/** Reset alternating row counter. */
function resetKvRows(doc) {
  doc._kvRowIdx = 0;
}

/**
 * Draw a simple data table with header row and data rows.
 * Handles page breaks automatically.
 */
function drawTable(doc, headers, rows, colWidths, theme, layout) {
  const x = layout.margin;
  const rowH = 18;
  const fontSize = 7.5;

  // Header row
  let y = doc.y;
  doc.save();
  doc.rect(x, y, layout.contentWidth, rowH).fill(hex(theme.colors.tableHeaderBg));
  doc.restore();

  let cx = x;
  headers.forEach((header, i) => {
    doc.font('Helvetica-Bold').fontSize(fontSize)
      .fillColor(hex(theme.colors.tableHeaderText))
      .text(header, cx + 3, y + 4, { width: colWidths[i] - 6, align: 'center' });
    cx += colWidths[i];
  });
  y += rowH;

  // Data rows
  rows.forEach((row, rowIdx) => {
    // Page break check
    if (y + rowH > layout.pageHeight - 60) {
      doc.addPage();
      y = layout.margin;
      // Re-draw header on new page
      doc.save();
      doc.rect(x, y, layout.contentWidth, rowH).fill(hex(theme.colors.tableHeaderBg));
      doc.restore();
      cx = x;
      headers.forEach((header, i) => {
        doc.font('Helvetica-Bold').fontSize(fontSize)
          .fillColor(hex(theme.colors.tableHeaderText))
          .text(header, cx + 3, y + 4, { width: colWidths[i] - 6, align: 'center' });
        cx += colWidths[i];
      });
      y += rowH;
    }

    // Alternating stripe
    if (rowIdx % 2 === 1) {
      doc.save();
      doc.rect(x, y, layout.contentWidth, rowH).fill(hex(theme.colors.tableStripeBg));
      doc.restore();
    }

    cx = x;
    row.forEach((cell, i) => {
      const cellText = typeof cell === 'object' ? cell.text : String(cell);
      const cellColor = (typeof cell === 'object' && cell.color) ? cell.color : theme.colors.bodyText;
      const cellBg = (typeof cell === 'object' && cell.fill) ? cell.fill : null;

      if (cellBg) {
        doc.save();
        doc.rect(cx, y, colWidths[i], rowH).fill(hex(cellBg));
        doc.restore();
      }

      doc.font('Helvetica').fontSize(fontSize)
        .fillColor(hex(cellColor))
        .text(cellText, cx + 3, y + 4, { width: colWidths[i] - 6, align: 'center' });
      cx += colWidths[i];
    });

    // Cell borders
    cx = x;
    colWidths.forEach(w => {
      doc.rect(cx, y, w, rowH).stroke(hex(theme.colors.tableBorder));
      cx += w;
    });

    y += rowH;
  });

  doc.y = y + 5;
}

/** Ensure enough space; add page if not. */
function ensureSpace(doc, needed, layout) {
  if (doc.y + needed > layout.pageHeight - 60) {
    doc.addPage();
    doc.y = layout.margin;
  }
}

// ---------------------------------------------------------------------------
// Section builders
// ---------------------------------------------------------------------------

function buildCoverPage(doc, data, theme, layout) {
  const h = data.header;

  // Disclaimer banner
  doc.save();
  doc.rect(0, 0, layout.pageWidth, 30).fill(hex(theme.colors.disclaimerBg));
  doc.restore();
  doc.font('Helvetica-Bold').fontSize(10)
    .fillColor(hex(theme.colors.disclaimerText))
    .text('DEMONSTRATION — Simulated Inspection Data', 0, 8, {
      width: layout.pageWidth, align: 'center'
    });

  // Title block
  doc.save();
  doc.rect(layout.margin, 80, layout.contentWidth, 120)
    .fill(hex(theme.colors.headerBg));
  doc.restore();

  // Logo placeholder
  doc.save();
  doc.rect(layout.margin + layout.contentWidth / 2 - 50, 90, 100, 30)
    .lineWidth(0.5).stroke(hex('3B82F6'));
  doc.restore();
  doc.font('Helvetica').fontSize(8)
    .fillColor(hex(theme.colors.headerText))
    .text('[Client / TIC Body Logo]', layout.margin, 95, {
      width: layout.contentWidth, align: 'center'
    });

  doc.font('Helvetica-Bold').fontSize(24)
    .fillColor(hex(theme.colors.headerText))
    .text('Inspection Report', layout.margin, 130, {
      width: layout.contentWidth, align: 'center'
    });

  doc.font('Helvetica').fontSize(11)
    .fillColor(hex(theme.colors.accent))
    .text(h.equipmentDescription, layout.margin, 165, {
      width: layout.contentWidth, align: 'center'
    });

  // Details table
  doc.y = 220;
  resetKvRows(doc);

  const isPipeline = !!h.pipelineCircuitId;
  const fields = isPipeline ? [
    ['Report Number', h.reportNumber],
    ['Date of Examination', h.dateOfExamination],
    ['Date of Report', h.dateOfReport],
    ['Client', h.clientName],
    ['Site', `${h.siteName}, ${h.siteAddress}`],
    ['Circuit ID', h.pipelineCircuitId],
    ['Line Number', h.lineNumber],
    ['Service', h.serviceDescription],
    ['Pipe Spec', h.pipeSpecification],
    ['Year of Installation', h.yearOfInstallation],
    ['Design Code', h.designCode],
    ['Design Pressure', `${h.designPressure} bar`],
    ['Design Temperature', `${h.designTemperature}°C`],
    ['Operating Pressure', `${h.operatingPressure} bar`],
    ['Operating Temperature', `${h.operatingTemperature}°C`],
    ['Material', h.materialOfConstruction],
    ['Insulation', h.insulationType],
    ['Inspector', `${h.inspectorName} — ${h.inspectorQualification}`],
    ['Examination Type', h.examinationType],
    ['WSE Reference', h.wseReference || '—'],
    ['Previous Report', h.previousReportReference]
  ] : [
    ['Report Number', h.reportNumber],
    ['Date of Examination', h.dateOfExamination],
    ['Date of Report', h.dateOfReport],
    ['Client', h.clientName],
    ['Site', `${h.siteName}, ${h.siteAddress}`],
    ['Vessel Tag', h.vesselTagNumber],
    ['Vessel Serial', h.vesselSerialNumber],
    ['Year of Manufacture', h.yearOfManufacture],
    ['Design Code', h.designCode],
    ['MAWP', `${h.mawp} bar`],
    ['Design Temperature', `${h.designTemperature}°C`],
    ['Material', h.materialOfConstruction],
    ['Inspector', `${h.inspectorName} — ${h.inspectorQualification}`],
    ['Examination Type', h.examinationType],
    ['WSE Reference', h.wseReference || '—'],
    ['Previous Report', h.previousReportReference]
  ];

  fields.forEach(([label, value]) => drawKvRow(doc, label, value, theme, layout));

  // Watermark footer
  doc.font('Helvetica').fontSize(7)
    .fillColor(hex(theme.watermark.color))
    .text(theme.watermark.text, layout.margin, layout.pageHeight - 40, {
      width: layout.contentWidth, align: 'right'
    });
}

function buildScopeSection(doc, data, theme, layout) {
  doc.addPage();
  drawSectionHeader(doc, 'Scope and Limitations', theme, layout, 'Regulatory');
  resetKvRows(doc);

  const s = data.scopeAndLimitations;
  const rows = [
    ['Areas Examined', s.areasExamined.join('; ')],
    ['Areas NOT Examined', (s.areasNotExamined || []).join('; ') || 'None'],
    ['Limitations', s.examinationLimitations || 'None'],
    ['Access Method', s.accessMethod],
    ['Confined Space Entry', s.confinedSpaceEntry ? `Yes — Permit: ${s.confinedSpacePermit}` : 'No'],
    ['Surface Preparation', s.surfacePreparation]
  ];
  rows.forEach(([l, v]) => drawKvRow(doc, l, v, theme, layout));
}

function buildMethodologySection(doc, data, theme, layout) {
  ensureSpace(doc, 200, layout);
  doc.y += 15;
  drawSectionHeader(doc, 'Methodology', theme, layout, 'Industry Standard');
  resetKvRows(doc);

  const m = data.methodology;
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
  rows.forEach(([l, v]) => drawKvRow(doc, l, v, theme, layout));
}

function buildThicknessSurveySection(doc, data, theme, layout) {
  doc.addPage();
  drawSectionHeader(doc, 'Thickness Survey', theme, layout, 'Regulatory');

  const examDate = new Date(data.header.dateOfExamination);
  const yearOrigin = data.header.yearOfManufacture || data.header.yearOfInstallation;
  const enriched = data.thicknessSurvey.map(row =>
    enrichTmlRow(row, yearOrigin, examDate)
  );

  const headers = ['TML ID', 'Nom.', 'Prev.', 'Curr.', 'Min.', 'ST Rate', 'LT Rate', 'Life', 'Status'];
  const totalW = layout.contentWidth;
  const colWidths = [
    totalW * 0.12, totalW * 0.08, totalW * 0.08, totalW * 0.08, totalW * 0.08,
    totalW * 0.10, totalW * 0.10, totalW * 0.10, totalW * 0.16
  ];
  // Adjust last col to absorb rounding
  colWidths[colWidths.length - 1] = totalW - colWidths.slice(0, -1).reduce((a, b) => a + b, 0);

  const rows = enriched.map(row => {
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
      { text: ragStyle.label, color: ragStyle.text, fill: ragStyle.fill }
    ];
  });

  drawTable(doc, headers, rows, colWidths, theme, layout);

  // Anomaly flags
  const anomalies = enriched.filter(r => r.anomalies.length > 0);
  if (anomalies.length > 0) {
    ensureSpace(doc, 40, layout);
    doc.font('Helvetica-Oblique').fontSize(8)
      .fillColor('#DC2626');
    anomalies.forEach(r => {
      doc.text(`⚠ ${r.tmlId}: ${r.anomalies.join('; ')}`, layout.margin, doc.y, {
        width: layout.contentWidth
      });
    });
    doc.fillColor(hex(theme.colors.bodyText));
  }
}

function buildFindingsSection(doc, data, theme, layout) {
  doc.addPage();
  drawSectionHeader(doc, 'Visual Findings', theme, layout, 'Industry Standard');

  data.visualFindings.forEach((finding, idx) => {
    if (idx > 0) {
      ensureSpace(doc, 180, layout);
      doc.y += 10;
    }

    // Finding sub-header
    doc.font('Helvetica-Bold').fontSize(11)
      .fillColor(hex(theme.colors.primary))
      .text(`Finding ${finding.findingId}: ${finding.findingType}`, layout.margin, doc.y);
    doc.y += 5;

    resetKvRows(doc);
    const rows = [
      ['Location', finding.location],
      ['Severity', finding.severity],
      ['Dimensions', finding.dimensions || '—'],
      ['Description', finding.description],
      ['Acceptance Criteria', finding.acceptanceCriteria],
      ['Recommendation', finding.recommendation],
      ['Timeframe', finding.timeframe],
      ['Photograph Ref.', finding.photographReference],
      ['NDT Follow-Up', finding.ndtFollowUpRequired ? `Yes — ${finding.ndtMethodRecommended || 'Required'}` : 'No']
    ];
    rows.forEach(([l, v]) => drawKvRow(doc, l, v, theme, layout));

    // Photo placeholder
    ensureSpace(doc, 80, layout);
    const phW = 180;
    const phH = 60;
    const phX = layout.margin + (layout.contentWidth - phW) / 2;
    doc.save();
    doc.rect(phX, doc.y, phW, phH)
      .dash(3, { space: 3 })
      .stroke(hex(theme.photoPlaceholder.borderColor));
    doc.restore();
    doc.font('Helvetica').fontSize(8)
      .fillColor(hex(theme.colors.mutedText))
      .text(`[Photograph — ${finding.photographReference}]`, phX, doc.y + phH / 2 - 5, {
        width: phW, align: 'center'
      });
    doc.y += phH + 10;
    doc.fillColor(hex(theme.colors.bodyText));
  });
}

function buildCuiSection(doc, data, theme, layout) {
  ensureSpace(doc, 200, layout);
  doc.y += 15;
  drawSectionHeader(doc, 'CUI Assessment', theme, layout, 'Industry Standard');

  const cui = data.cuiAssessment;
  if (!cui || !cui.cuiAssessmentPerformed) {
    doc.font('Helvetica').fontSize(9)
      .fillColor(hex(theme.colors.mutedText))
      .text('No CUI assessment performed.', layout.margin, doc.y, {
        width: layout.contentWidth, align: 'center'
      });
    return;
  }

  const findings = cui.cuiFindings || [];
  const cuiFound = findings.filter(f => f.cuiFound);

  doc.font('Helvetica-Bold').fontSize(9)
    .fillColor(hex(theme.colors.bodyText))
    .text(`${cui.locationsInspected} locations inspected — ${cuiFound.length} with CUI findings`, layout.margin, doc.y);
  doc.y += 15;

  if (cuiFound.length > 0) {
    const headers = ['Location', 'Severity', 'Wall Loss', 'Insulation', 'Jacketing'];
    const colWidths = [140, 120, 60, 80, 80];
    const scale = layout.contentWidth / colWidths.reduce((a, b) => a + b, 0);
    const scaled = colWidths.map(w => w * scale);

    const rows = cuiFound.map(f => [
      f.location,
      f.cuiSeverity,
      f.wallLoss > 0 ? `${f.wallLoss} mm` : 'None',
      f.insulationCondition,
      f.jacketingCondition
    ]);

    drawTable(doc, headers, rows, scaled, theme, layout);
  }

  // CUI finding details
  cuiFound.forEach((f, idx) => {
    ensureSpace(doc, 80, layout);
    doc.y += 5;
    resetKvRows(doc);
    doc.font('Helvetica-Bold').fontSize(9)
      .fillColor(hex(theme.colors.primary))
      .text(`CUI — ${f.location}`, layout.margin, doc.y);
    doc.y += 5;
    drawKvRow(doc, 'Description', f.affectedAreaDescription, theme, layout);
    drawKvRow(doc, 'Recommendation', f.recommendation, theme, layout);
  });
}

function buildInjectionPointSection(doc, data, theme, layout) {
  ensureSpace(doc, 180, layout);
  doc.y += 15;
  drawSectionHeader(doc, 'Injection Point Assessment', theme, layout, 'Regulatory');
  resetKvRows(doc);

  const ip = data.injectionPointAssessment;
  if (!ip || !ip.injectionPointPresent) {
    doc.font('Helvetica').fontSize(9)
      .fillColor(hex(theme.colors.mutedText))
      .text('No injection points present on this circuit.', layout.margin, doc.y, {
        width: layout.contentWidth, align: 'center'
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
  rows.forEach(([l, v]) => drawKvRow(doc, l, v, theme, layout));
}

function buildSafetyDevicesSection(doc, data, theme, layout) {
  doc.addPage();
  drawSectionHeader(doc, 'Safety Devices', theme, layout, 'Regulatory');

  const headers = ['Device Type', 'ID / Tag', 'Set Press.', 'Last Test', 'Result'];
  const colWidths = [150, 90, 70, 80, 80];
  // Adjust to fit
  const total = colWidths.reduce((a, b) => a + b, 0);
  const scale = layout.contentWidth / total;
  const scaled = colWidths.map(w => w * scale);

  const rows = data.safetyDevices.map(d => [
    d.deviceType,
    d.deviceId,
    d.setPressure != null ? `${d.setPressure} bar` : 'N/A',
    d.lastTestDate,
    d.testResult
  ]);

  drawTable(doc, headers, rows, scaled, theme, layout);

  // Notes
  doc.y += 5;
  data.safetyDevices.forEach(d => {
    if (d.notes) {
      doc.font('Helvetica-Oblique').fontSize(7.5)
        .fillColor(hex(theme.colors.mutedText))
        .text(`${d.deviceId}: ${d.notes}`, layout.margin, doc.y, {
          width: layout.contentWidth
        });
      doc.y += 3;
    }
  });
  doc.fillColor(hex(theme.colors.bodyText));
}

function buildFfsSection(doc, data, theme, layout) {
  ensureSpace(doc, 180, layout);
  doc.y += 15;
  drawSectionHeader(doc, 'Fitness-for-Service Assessment', theme, layout, 'Regulatory');
  resetKvRows(doc);

  const f = data.fitnessForService;
  if (!f.ffsRequired) {
    doc.font('Helvetica').fontSize(9)
      .fillColor(hex(theme.colors.mutedText))
      .text('No FFS assessment required for this examination.', layout.margin, doc.y, {
        width: layout.contentWidth, align: 'center'
      });
    return;
  }

  const rows = [
    ['FFS Required', 'Yes'],
    ['Assessment Method', f.assessmentMethod],
    ['Defect Assessed', f.defectTypeAssessed],
    ['Result', f.result],
    ['Conditions', f.conditionsForContinuedService || '—'],
    ['Assessment Ref.', f.assessmentReference]
  ];
  rows.forEach(([l, v]) => drawKvRow(doc, l, v, theme, layout));
}

function buildConclusionsSection(doc, data, theme, layout) {
  doc.addPage();
  drawSectionHeader(doc, 'Conclusions', theme, layout, 'Industry Standard');
  resetKvRows(doc);

  const c = data.conclusions;
  const rows = [
    ['Overall Condition', c.overallCondition],
    ['Safe to Continue', c.safeToContinue ? 'Yes' : 'No'],
    ['Conditions', c.conditionsForContinuedService || 'None'],
    ['Statutory Report', c.statutoryReportRaised ? `Yes — ${c.statutoryReportRef}` : 'No'],
    ['Next Examination', `${c.nextExaminationType} — ${c.nextExaminationDate}`],
    ['Interval Justification', c.recommendedIntervalJustification]
  ];
  rows.forEach(([l, v]) => drawKvRow(doc, l, v, theme, layout));

  // Critical findings summary
  ensureSpace(doc, 100, layout);
  doc.y += 10;
  doc.font('Helvetica-Bold').fontSize(11)
    .fillColor(hex(theme.colors.primary))
    .text('Critical Findings Summary', layout.margin, doc.y);
  doc.y += 5;
  doc.font('Helvetica').fontSize(9)
    .fillColor(hex(theme.colors.bodyText))
    .text(c.summaryOfCriticalFindings, layout.margin, doc.y, {
      width: layout.contentWidth
    });
}

function buildDeclarationsSection(doc, data, theme, layout) {
  ensureSpace(doc, 200, layout);
  doc.y += 15;
  drawSectionHeader(doc, 'Declarations', theme, layout, 'Regulatory');
  resetKvRows(doc);

  const d = data.declarations;
  const rows = [
    ['Competent Person', d.competentPersonDeclaration ? '✓ Confirmed' : '—'],
    ['Accreditation', d.accreditationStatement],
    ['Independence', d.independenceDeclaration ? '✓ Confirmed' : '—'],
    ['Inspector', d.inspectorName],
    ['Date Signed', d.dateSigned],
    ['Technical Reviewer', d.technicalReviewer || '—'],
    ['Reviewer Date', d.reviewerDateSigned || '—']
  ];
  rows.forEach(([l, v]) => drawKvRow(doc, l, v, theme, layout));

  // Signature placeholders
  ensureSpace(doc, 80, layout);
  doc.y += 15;
  const sigW = 150;
  const sigH = 50;

  doc.save();
  doc.rect(layout.margin, doc.y, sigW, sigH)
    .dash(3, { space: 3 }).stroke(hex(theme.colors.tableBorder));
  doc.restore();
  doc.font('Helvetica').fontSize(8)
    .fillColor(hex(theme.colors.mutedText))
    .text('[Inspector Signature]', layout.margin, doc.y + sigH / 2 - 5, {
      width: sigW, align: 'center'
    });

  if (d.technicalReviewer) {
    doc.save();
    doc.rect(layout.margin + sigW + 30, doc.y, sigW, sigH)
      .dash(3, { space: 3 }).stroke(hex(theme.colors.tableBorder));
    doc.restore();
    doc.font('Helvetica').fontSize(8)
      .fillColor(hex(theme.colors.mutedText))
      .text('[Reviewer Signature]', layout.margin + sigW + 30, doc.y + sigH / 2 - 5, {
        width: sigW, align: 'center'
      });
  }

  doc.y += sigH + 10;
}

function buildAppendicesSection(doc, data, theme, layout) {
  ensureSpace(doc, 200, layout);
  doc.y += 15;
  drawSectionHeader(doc, 'Appendices Checklist', theme, layout, 'Industry Standard');

  const hasPaut = (data.methodology.additionalNdtMethods || []).includes('PAUT');
  const hasNdt = (data.methodology.additionalNdtMethods || []).length > 0;
  const hasFfs = data.fitnessForService.ffsRequired;
  const isPipelineApp = !!data.header.pipelineCircuitId;

  const headers = ['Appendix', 'Included', 'Notes'];
  const colWidths = [160, 70, layout.contentWidth - 230];

  const rows = [
    ['Photographs', 'Yes', `${data.visualFindings.length} findings documented`],
    [isPipelineApp ? 'CML Location Diagram / Isometric' : 'TML Location Diagram', 'Yes', `${data.thicknessSurvey.length} ${isPipelineApp ? 'CMLs' : 'TMLs'} mapped`],
    ...(isPipelineApp ? [['P&ID Markup', 'Yes', 'Marked-up P&ID showing inspection extent']] : []),
    ['Corrosion Mapping', hasPaut ? 'Yes' : 'N/A', hasPaut ? 'PAUT grid scan data' : 'No PAUT performed'],
    ['NDT Reports/Certs', hasNdt ? 'Yes' : 'N/A', hasNdt ? data.methodology.additionalNdtMethods.join(', ') : 'No additional NDT'],
    ['Calibration Certs', 'Yes', 'UT instrument and probes'],
    ['Previous Report Data', 'Yes', `Ref: ${data.header.previousReportReference}`],
    ['FFS Calculation', hasFfs ? 'Yes' : 'N/A', hasFfs ? data.fitnessForService.assessmentReference : 'No FFS required']
  ];

  drawTable(doc, headers, rows, colWidths, theme, layout);
}

// ---------------------------------------------------------------------------
// Footer on every page (added via event)
// ---------------------------------------------------------------------------

function addPageFooters(doc, theme, layout, reportNumber) {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    // Report number
    doc.font('Helvetica').fontSize(7)
      .fillColor(hex(theme.colors.mutedText))
      .text(reportNumber, layout.margin, layout.pageHeight - 30, {
        width: layout.contentWidth / 2
      });
    // Page number
    doc.text(`Page ${i + 1} of ${range.count}`, layout.margin + layout.contentWidth / 2, layout.pageHeight - 30, {
      width: layout.contentWidth / 2, align: 'center'
    });
    // Watermark
    doc.font('Helvetica').fontSize(7)
      .fillColor(hex(theme.watermark.color))
      .text(theme.watermark.text, layout.margin, layout.pageHeight - 30, {
        width: layout.contentWidth, align: 'right'
      });
  }
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Generate a PDF report from inspection data and theme config.
 *
 * @param {object} data   - Parsed inspection data (matches sample-data schema)
 * @param {object} theme  - Theme configuration (from themes/default.json)
 * @param {string} outputPath - Full path to write the .pdf file
 * @returns {Promise<string>} - Resolves with the output file path
 */
async function generatePdf(data, theme, outputPath) {
  const layout = getLayout(theme);

  // Ensure output directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: layout.margin, bottom: 50, left: layout.margin, right: layout.margin },
      bufferPages: true,  // Required for page footers
      info: {
        Title: `Inspection Report — ${data.header.pipelineCircuitId || data.header.vesselTagNumber}`,
        Author: 'DS-OS Report Generator',
        Subject: `${data.header.equipmentDescription} — ${data.header.pipelineCircuitId ? 'API 570' : 'API 510'}`,
        Creator: 'DS-OS'
      }
    });

    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Build all sections
    buildCoverPage(doc, data, theme, layout);
    buildScopeSection(doc, data, theme, layout);
    buildMethodologySection(doc, data, theme, layout);
    buildThicknessSurveySection(doc, data, theme, layout);
    buildFindingsSection(doc, data, theme, layout);
    // Pipeline-specific sections
    if (data.cuiAssessment) buildCuiSection(doc, data, theme, layout);
    if (data.injectionPointAssessment) buildInjectionPointSection(doc, data, theme, layout);
    buildSafetyDevicesSection(doc, data, theme, layout);
    buildFfsSection(doc, data, theme, layout);
    buildConclusionsSection(doc, data, theme, layout);
    buildDeclarationsSection(doc, data, theme, layout);
    buildAppendicesSection(doc, data, theme, layout);

    // Add footers to all pages
    addPageFooters(doc, theme, layout, data.header.reportNumber);

    doc.end();

    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
}

module.exports = { generatePdf };
