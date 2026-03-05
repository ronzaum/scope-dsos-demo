/**
 * Parser for DS-OS knowledge base files:
 * - inspection_types.md → 6 inspection types with process flows, fields, instruments, defects
 * - regulatory_standards.md → 8 standards with classification systems, report requirements
 * - report_anatomy.md → 7 report skeleton sections, classification systems, good/bad examples
 * - scope_product.md → 8 capabilities, metrics, competitive landscape, company facts
 *
 * Also embeds two data-only sections (not parsed from files):
 * - Stakeholder personas (8 personas for DS talking points)
 * - Success questions (5 question groups for deployment conversations)
 */

const { splitSections, parseKeyValueBullets, parseTable } = require('./utils');

// ---------------------------------------------------------------------------
// Inspection Types
// ---------------------------------------------------------------------------

/**
 * Parse inspection_types.md into structured JSON.
 * Returns array of 6 types, each with: name, slug, description, processFlow,
 * keyFields, instruments, keyStandards, commonDefects, deploymentNotes.
 */
function parseInspectionTypes(content) {
  if (!content) return [];

  const sections = splitSections(content, 2);
  const types = [];

  for (const [heading, body] of sections) {
    // Match numbered type headings: "1. Pressure Vessel Inspection"
    const typeMatch = heading.match(/^\d+\.\s+(.+)/);
    if (!typeMatch) continue;

    const name = typeMatch[1].trim();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
    const subsections = splitSections(body, 3);

    types.push({
      name,
      slug,
      description: extractProse(subsections.get('What It Is')),
      processFlow: parseProcessFlow(subsections.get('Process Flow') || subsections.get('Process Flow (EICR)') || subsections.get('Process Flow (FRA)')),
      keyFields: parseBulletList(subsections.get('Key Data Fields')),
      instruments: parseBulletList(subsections.get('Instruments')),
      keyStandards: parseBoldBullets(subsections.get('Key Standards')),
      commonDefects: parseTable(subsections.get('Common Defects') || subsections.get('Common Defects Detected') || ''),
      deploymentNotes: parseBulletList(subsections.get('Deployment Notes')),
      // NDT has extra sub-sections
      methodsSummary: subsections.has('Methods Summary') ? parseTable(subsections.get('Methods Summary')) : undefined,
      personnelLevels: subsections.has('Personnel Certification Levels') ? parseTable(subsections.get('Personnel Certification Levels')) : undefined,
      keySubTechniques: subsections.has('Key Sub-Techniques') ? parseBulletList(subsections.get('Key Sub-Techniques')) : undefined,
      // Factory audit extras
      findingClassifications: subsections.has('Finding Classifications') ? parseTable(subsections.get('Finding Classifications')) : undefined,
      aqlSampling: subsections.has('AQL Sampling (Manufacturing Inspection)') ? extractProse(subsections.get('AQL Sampling (Manufacturing Inspection)')) : undefined,
      // Electrical extras
      observationCodes: subsections.has('Observation Codes') ? parseTable(subsections.get('Observation Codes')) : undefined,
      // Fire safety extras
      fireDoorChecks: subsections.has('Fire Door Key Checks') ? parseBulletList(subsections.get('Fire Door Key Checks')) : undefined,
      fireAlarmCategories: subsections.has('Fire Alarm Categories (BS 5839-1)') ? parseTable(subsections.get('Fire Alarm Categories (BS 5839-1)')) : undefined,
      riskRatingMatrix: subsections.has('Risk Rating Matrix') ? parseTable(subsections.get('Risk Rating Matrix')) : undefined,
    });
  }

  return types;
}

/**
 * Parse a numbered process flow into steps array.
 * Input: "1. **Pre-inspection** — Review previous records..."
 * Output: [{ id: 1, label: "Pre-inspection", detail: "Review previous records..." }]
 */
function parseProcessFlow(content) {
  if (!content) return [];

  const steps = [];
  const regex = /^\d+\.\s+\*\*([^*]+)\*\*\s*[—–-]\s*(.+)$/gm;
  let match;

  while ((match = regex.exec(content)) !== null) {
    steps.push({
      id: steps.length + 1,
      label: match[1].trim(),
      detail: match[2].trim(),
    });
  }

  // Fallback: numbered steps without bold formatting
  if (steps.length === 0) {
    const plainRegex = /^\d+\.\s+(.+)$/gm;
    while ((match = plainRegex.exec(content)) !== null) {
      steps.push({
        id: steps.length + 1,
        label: match[1].trim(),
        detail: '',
      });
    }
  }

  // Handle indented sub-steps (e.g. factory audit Stage 2)
  // These are captured as detail enrichment — not separate steps

  // Enrich steps with generic example scenarios (hardcoded — not in knowledge base files)
  for (const step of steps) {
    step.examples = PROCESS_STEP_EXAMPLES[step.label] || [];
  }

  return steps;
}

/**
 * Generic example scenarios for each process step label across all 6 inspection types.
 * 1-3 examples per step, varying by complexity. Examples are domain-specific but
 * not client-named. Keyed by step label for lookup during parseProcessFlow().
 */
const PROCESS_STEP_EXAMPLES = {
  // -- Pressure Vessel (8 steps) --
  'Pre-inspection': [
    'Reviewing 10-year service history of a heat exchanger reveals accelerating corrosion rate — flags need for closer UT intervals',
    'Written Scheme of Examination requires internal exam within 6 months of last shutdown — scheduling drives priority',
  ],
  'Isolation & prep': [
    'Gas-freeing a reactor vessel in a petrochemical plant requires 3 successive readings below LEL before confined space entry',
  ],
  'External visual': [
    'Inspector identifies bulging around a nozzle weld on a storage tank — triggers immediate NDT follow-up',
    'Insulation damage on a high-temperature column reveals corrosion under insulation (CUI) at 3 o\'clock position',
  ],
  'Internal visual': [
    'Pitting along the bottom shell of a crude oil storage tank indicates microbiologically influenced corrosion (MIC)',
    'Lining degradation in a chemical reactor exposes base metal to aggressive media — repair required before return to service',
  ],
  'NDT': [
    'UT thickness readings at 24 TMLs on a boiler drum show 0.3mm/yr corrosion rate — within acceptable range for 5-year interval',
    'TOFD scan of a circumferential weld detects a 15mm subsurface crack — requires engineering assessment per API 579',
    'MPI on nozzle welds after thermal cycling reveals no recordable indications',
  ],
  'Fitness-for-service': [
    'API 579 Level 2 assessment of localised thinning determines vessel can operate safely for 3 more years at reduced MAWP',
  ],
  'Pressure test': [
    'Hydrostatic test at 1.5x MAWP (22.5 bar) held for 30 minutes with no pressure drop — vessel passes',
  ],
  'Report': [
    'Final report includes 24 UT readings, 6 photos of external corrosion, API 579 assessment summary, and recommended 3-year re-inspection date',
  ],

  // -- Lifting Equipment (5 parsed steps: Pre-inspection shared, Load testing line skipped by parser) --
  'Visual examination': [
    'Overhead crane wire rope shows 6 broken wires in one lay length — exceeds rejection criteria per ISO 4309',
    'Forklift truck mast shows hydraulic fluid seepage at a cylinder seal — requires repair before next use',
  ],
  'Functional testing': [
    'Mobile crane slew brake tested under rated load — holds at maximum radius with no drift',
    'Passenger hoist emergency stop activated at each landing — all function correctly within 1 second',
  ],
  'Measurement': [
    'Wire rope diameter measured at 18.2mm against 20mm nominal — 9% reduction approaches the 10% discard threshold per ISO 4309',
    'Hook throat opening measured at 52.8mm against 50mm nominal — 5.6% increase exceeds discard criteria',
  ],

  // -- Electrical / EICR (6 steps) --
  'Planning': [
    'Previous EICR from 2021 noted 3 C3 observations — inspector checks whether improvements were made',
    'Installation records show DB3 was extended in 2023 without updating the schedule of circuits',
  ],
  'Visual inspection (dead)': [
    'Missing blanking plates on a distribution board expose live busbars — immediate C1 coding',
    'Cable tray in a factory shows signs of mechanical damage with exposed copper conductors',
  ],
  'Dead testing': [
    'Ring final circuit continuity test shows R1+R2 of 1.8Ω — consistent with 2.5mm² conductors over 45m cable run',
    'Insulation resistance between L-E reads 0.8 MΩ on a kitchen circuit — below 1 MΩ minimum, investigation required',
  ],
  'Live testing': [
    'RCD protecting a bathroom circuit trips at 28ms at rated residual current — within 300ms limit',
    'Ze measurement at origin reads 0.21Ω — consistent with TN-C-S supply',
    'Earth fault loop impedance Zs on a 32A Type B MCB reads 0.95Ω — within max 1.37Ω at 70°C',
  ],
  'Classification': [
    'Exposed live parts at a consumer unit classified as C1 (danger present) — requires immediate remedial action',
    'Lack of supplementary bonding in a bathroom with plastic pipework classified as C3 (improvement recommended) — not dangerous but advisory',
  ],

  // -- Factory / Manufacturing Audit (8 parsed steps: Stage 2 line skipped by parser) --
  'Stage 1': [
    'Quality manual references an outdated version of ISO 9001:2008 — factory must update documentation before Stage 2 proceeds',
    'Calibration records show 3 instruments overdue for recalibration — noted as a potential minor non-conformity',
  ],
  'Audit planning': [
    'Audit scope covers 6 processes across 2 buildings — team of 3 auditors allocated 4 audit days based on ISO 19011 guidance',
  ],
  'Opening meeting': [
    'Factory manager confirms 2 process areas have recently changed — auditor adjusts sampling plan to include both modified lines',
  ],
  'Finding classification': [
    'Failure to perform incoming inspection classified as a Major NC — affects product conformity and requires corrective action within 30 days',
    'Missing signature on a single training record classified as Minor NC — system exists but had a lapse',
  ],
  'Closing meeting': [
    'Auditor presents 1 Major NC and 3 Minor NCs — factory agrees to submit corrective action evidence within 30 and 90 days respectively',
  ],
  'Corrective action review': [
    'Factory submits corrective action evidence (updated procedure + 4 weeks of compliance records) — auditor closes Major NC remotely',
  ],
  'Certification decision': [
    'All NCs verified closed within agreed timeframe — certification body issues 3-year certificate with annual surveillance visits scheduled',
  ],

  // -- Fire Safety / FRA (6 parsed steps: Evaluate precautions line skipped by parser) --
  'Preparation': [
    'Existing fire risk assessment is 4 years old and pre-dates a building extension — full reassessment triggered',
    'Building plans obtained show original compartmentation layout — assessor uses these to verify fire-stopping on site',
  ],
  'Fire hazards': [
    'Commercial kitchen extraction duct shows heavy grease build-up — significant ignition source requiring immediate cleaning schedule',
    'Electrical distribution board in a storage room surrounded by combustible stock — 1m clear zone required',
  ],
  'People at risk': [
    'Residential care home has 12 residents with limited mobility — personal emergency evacuation plans (PEEPs) required for each resident',
    'Night shift factory workers: only 4 staff in a 5,000m² building — reduced means of escape capacity acceptable but emergency lighting critical',
  ],
  'Risk rating': [
    'Office building floor assessed as "Normal" hazard with adequate means of escape — overall risk rating: Tolerable with minor actions',
    'Warehouse with blocked escape route and missing fire detection rated as "Substantial" risk — immediate action required',
  ],
  'Action plan': [
    'Priority 1: reinstate fire door self-closers on protected stairway (2 weeks). Priority 2: install L2 detection in server room (3 months)',
    'Final exit door requiring a key to open from inside — contravenes Article 14 of the RRFSO, remediation within 48 hours',
  ],
};

// ---------------------------------------------------------------------------
// Regulatory Standards
// ---------------------------------------------------------------------------

/**
 * Parse regulatory_standards.md into structured JSON.
 * Returns array of 8 standards, each with: name, slug, fullName, issuedBy,
 * governs, sections (tables/subsections), reportRequirements, externalLink.
 */
function parseRegulatoryStandards(content) {
  if (!content) return [];

  const sections = splitSections(content, 2);
  const standards = [];

  // Public reference URLs for each standard
  const externalLinks = {
    'API 510': 'https://www.api.org/products-and-services/individual-certification-programs/certifications/api510',
    'LOLER': 'https://www.hse.gov.uk/work-equipment-machinery/loler.htm',
    'BS 7671': 'https://electrical.theiet.org/wiring-matters/years/2022/86-mar-2022/bs-7671-18th-edition-amendments/',
    'ISO 17020': 'https://www.iso.org/standard/52994.html',
    'PED': 'https://single-market-economy.ec.europa.eu/sectors/pressure-equipment-and-gas-appliances/pressure-equipment-sector/pressure-equipment-directive-201468eu_en',
    'PUWER': 'https://www.hse.gov.uk/work-equipment-machinery/puwer.htm',
    'ISO 9001': 'https://www.iso.org/standard/62085.html',
    'ISO 17025': 'https://www.iso.org/standard/66912.html',
  };

  for (const [heading, body] of sections) {
    // Match numbered standard headings: "1. API 510 — Pressure Vessel Inspection Code"
    const stdMatch = heading.match(/^\d+\.\s+(.+)/);
    if (!stdMatch) continue;

    const rawName = stdMatch[1].trim();
    // Extract short name (before the dash) for slug/linking
    const dashSplit = rawName.split(/\s*[—–]\s*/);
    const shortName = dashSplit[0].trim();
    const subtitle = dashSplit[1] || '';
    const slug = shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');

    const subsections = splitSections(body, 3);

    // Extract key-value lines from top of body (Full name, Issued by, Governs)
    const fullNameMatch = body.match(/\*\*Full name:\*\*\s*(.+)/);
    const issuedByMatch = body.match(/\*\*Issued by:\*\*\s*(.+)/);
    const governsMatch = body.match(/\*\*Governs:\*\*\s*([\s\S]*?)(?=\n###|\n\*\*|\n\n---|\n>|$)/);

    // Collect all subsection data as structured content
    const details = [];
    for (const [subHeading, subBody] of subsections) {
      const table = parseTable(subBody);
      if (table.length > 0) {
        details.push({ heading: subHeading, type: 'table', data: table });
      } else {
        const bullets = parseBulletList(subBody);
        if (bullets.length > 0) {
          details.push({ heading: subHeading, type: 'bullets', data: bullets });
        } else {
          details.push({ heading: subHeading, type: 'prose', data: extractProse(subBody) });
        }
      }
    }

    // Extract report requirements subsection specifically
    const reportReqKey = [...subsections.keys()].find(k =>
      k.toLowerCase().includes('report') && (k.toLowerCase().includes('requirement') || k.toLowerCase().includes('content'))
    );
    const reportRequirements = reportReqKey ? extractProse(subsections.get(reportReqKey)) : '';

    // Find external link by matching short name against our map
    const linkKey = Object.keys(externalLinks).find(k =>
      shortName.toUpperCase().includes(k.toUpperCase().replace(/\s+/g, ' '))
    );

    // Hardcoded worked examples and real-world scenarios per standard
    const stdExamples = STANDARD_EXAMPLES[shortName] || { workedExamples: [], scenarios: [], reportExcerpts: [] };

    standards.push({
      name: shortName,
      subtitle,
      slug,
      fullName: fullNameMatch ? fullNameMatch[1].trim() : rawName,
      issuedBy: issuedByMatch ? issuedByMatch[1].trim() : '',
      governs: governsMatch ? governsMatch[1].trim().split('\n')[0].trim() : '',
      details,
      reportRequirements,
      externalLink: linkKey ? externalLinks[linkKey] : null,
      workedExamples: stdExamples.workedExamples,
      scenarios: stdExamples.scenarios,
      reportExcerpts: stdExamples.reportExcerpts || [],
    });
  }

  return standards;
}

// ---------------------------------------------------------------------------
// Report Anatomy
// ---------------------------------------------------------------------------

/**
 * Parse report_anatomy.md into structured JSON.
 * Returns: { skeleton, classificationSystems, variations, goodVsBad, digitalTransition, aiValue }
 */
function parseReportAnatomy(content) {
  if (!content) return { skeleton: [], classificationSystems: [], variations: [], goodVsBad: null, digitalTransition: null, aiValue: null };

  const sections = splitSections(content, 2);

  return {
    skeleton: parseReportSkeleton(sections.get('Universal Report Skeleton')),
    classificationSystems: parseClassificationSystems(sections.get('Classification Systems by Domain')),
    variations: parseVariations(sections.get('Variations by Inspection Type')),
    goodVsBad: parseGoodVsBad(sections.get('Good vs Bad Reports')),
    digitalTransition: extractProse(sections.get('Digital Transition State')),
    aiValue: parseAiValue(sections.get('Where AI Adds Value in Report Generation')),
  };
}

/**
 * Parse the Universal Report Skeleton into 7 sections.
 * Each "### Section N: Name" becomes a step in the flow.
 */
function parseReportSkeleton(content) {
  if (!content) return [];

  const subsections = splitSections(content, 3);
  const skeleton = [];

  for (const [heading, body] of subsections) {
    // "Section 1: Header / Identification Block"
    const sectionMatch = heading.match(/Section\s+(\d+):\s*(.+)/);
    if (!sectionMatch) continue;

    const table = parseTable(body);
    const bullets = parseBulletList(body);

    // Extract any blockquote as a note
    const noteMatch = body.match(/>\s*\*\*(.+?)\*\*\s*([\s\S]*?)(?=\n[^>]|\n\n|$)/);
    const note = noteMatch ? `${noteMatch[1]} ${noteMatch[2].replace(/>\s*/g, '').trim()}` : '';

    // Get the description (first paragraph before any table/list)
    const descLines = body.split('\n');
    let description = '';
    for (const line of descLines) {
      if (line.startsWith('|') || line.startsWith('-') || line.startsWith('>') || line.startsWith('#')) break;
      if (line.trim()) description += (description ? ' ' : '') + line.trim();
    }

    const sectionId = parseInt(sectionMatch[1], 10);
    const sectionExamples = REPORT_SECTION_EXAMPLES[sectionId] || {};

    skeleton.push({
      id: sectionId,
      label: sectionMatch[2].trim(),
      detail: description,
      fields: table.length > 0 ? table : undefined,
      bullets: bullets.length > 0 ? bullets : undefined,
      note: note || undefined,
      goodExample: sectionExamples.good || '',
      badExample: sectionExamples.bad || '',
    });
  }

  return skeleton;
}

/**
 * Good and bad examples for each of the 7 report skeleton sections.
 * Sections 3 (Findings) and 5 (Recommendations) map to the goodVsBad data
 * parsed from report_anatomy.md. The remaining sections have new examples.
 */
const REPORT_SECTION_EXAMPLES = {
  1: {
    good: 'Report No: PV-2026-0847 | Client: Acme Refining Ltd | Site: Grangemouth Process Unit 4 | Asset: V-4012 Overhead Accumulator | Inspector: J. McPherson (API 510 Cert #48291) | Date: 2026-02-18 | Standard: API 510, 12th Ed.',
    bad: 'Report for pressure vessel inspection. Inspector: John. Date: February 2026.',
  },
  2: {
    good: 'Scope: Internal and external visual examination of V-4012 per Written Scheme of Examination WSE-4012-R3. UT thickness survey at 24 TMLs per API 510 §6.4. Limitations: nozzle N4 inaccessible due to piping configuration — recommend ultrasonic inspection from external surface at next turnaround.',
    bad: 'We inspected the vessel as requested. Some areas could not be accessed.',
  },
  3: {
    good: 'Finding F-003: Localised external pitting at 6 o\'clock position, 200mm above bottom tangent line. Max pit depth 2.1mm over 50mm² cluster. Photo ref: IMG-0847-14. Severity: Requires monitoring — current wall 11.8mm vs min required 9.5mm.',
    bad: 'Some corrosion found on the bottom of the vessel.',
  },
  4: {
    good: 'Overall condition Grade B (Acceptable — minor deterioration noted). Individual finding classifications per API 510 Table 6.1: F-001 Grade A, F-002 Grade B, F-003 Grade B, F-004 Grade C (requires engineering assessment).',
    bad: 'Vessel condition: OK. Some issues noted.',
  },
  5: {
    good: 'R-001 (Priority: High, Due: Before restart): Repair weld overlay on area F-004 per approved WPS-2026-012. Responsible: Site Maintenance Supervisor. R-002 (Priority: Medium, Due: Next turnaround): Re-insulate area around N3 nozzle to prevent further CUI progression.',
    bad: 'Recommend repairs to the corroded areas. Further inspection needed.',
  },
  6: {
    good: 'V-4012 is fit for continued service at current MAWP of 15 bar subject to completion of Recommendation R-001 prior to re-pressurisation. Corrosion rate at worst location: 0.18mm/yr. Next internal examination due: 2029-02 (3-year interval per API 510 §6.4.2, based on remaining life calculation).',
    bad: 'Vessel can continue to be used. Next inspection in a few years.',
  },
  7: {
    good: 'Appendix A: UT thickness data (24 TMLs, tabulated with nominal/previous/current/rate). Appendix B: Photographic record (18 photos, geo-tagged). Appendix C: Calibration certificate for UT gauge (serial #DMS-4821, cal date 2026-01-15). Appendix D: API 579 Level 1 assessment worksheet for F-004.',
    bad: 'Photos attached.',
  },
};

/**
 * Parse classification systems into structured array.
 */
function parseClassificationSystems(content) {
  if (!content) return [];

  const subsections = splitSections(content, 3);
  const systems = [];

  for (const [heading, body] of subsections) {
    const table = parseTable(body);
    if (table.length > 0) {
      systems.push({ name: heading, codes: table });
    } else {
      // Parse bold-prefixed domain scales
      const lines = body.split('\n').filter(l => l.trim().startsWith('**') || l.trim().startsWith('-'));
      const items = [];
      for (const line of lines) {
        const boldMatch = line.match(/\*\*(.+?)\*\*[:\s]*(.+)/);
        if (boldMatch) {
          items.push({ domain: boldMatch[1].trim(), scale: boldMatch[2].trim() });
        }
      }
      if (items.length > 0) {
        systems.push({ name: heading, codes: items });
      }
    }
  }

  return systems;
}

/**
 * Parse variations by inspection type.
 */
function parseVariations(content) {
  if (!content) return [];

  const subsections = splitSections(content, 3);
  const variations = [];

  for (const [heading, body] of subsections) {
    const reportType = heading.replace(/\s*Reports?\s*(\(.*\))?/i, '').trim();
    const bullets = parseBulletList(body);

    // Extract the blockquote insight
    const noteMatch = body.match(/>\s*\*\*(.+?)\*\*\s*([\s\S]*?)(?=\n[^>]|\n\n|$)/);
    const insight = noteMatch ? `${noteMatch[1]} ${noteMatch[2].replace(/>\s*/g, '').trim()}` : '';

    variations.push({
      name: reportType,
      uniqueSections: bullets,
      insight,
    });
  }

  return variations;
}

/**
 * Parse good vs bad report examples.
 */
function parseGoodVsBad(content) {
  if (!content) return null;

  const subsections = splitSections(content, 3);

  const qualities = [];
  const qualityContent = subsections.get('What Makes a Report High Quality');
  if (qualityContent) {
    // Extract bold-headed paragraphs with good/bad examples
    const blocks = qualityContent.split(/\n\*\*/).filter(Boolean);
    for (const block of blocks) {
      const titleMatch = block.match(/^([^*]+)\*\*/);
      const title = titleMatch ? titleMatch[1].trim() : block.split('\n')[0].replace(/\*\*/g, '').trim();
      const bad = block.match(/BAD:\s*"([^"]+)"/);
      const good = block.match(/GOOD:\s*"([^"]+)"/);
      const bullets = parseBulletList(block);

      qualities.push({
        title,
        bad: bad ? bad[1] : undefined,
        good: good ? good[1] : undefined,
        points: bullets.length > 0 ? bullets : undefined,
      });
    }
  }

  const failures = parseTable(subsections.get('Common Report Failures') || '');

  return { qualities, failures };
}

/**
 * Parse AI value tiers.
 */
function parseAiValue(content) {
  if (!content) return [];

  const subsections = splitSections(content, 3);
  const tiers = [];

  for (const [heading, body] of subsections) {
    const items = [];
    const regex = /^\d+\.\s+\*\*(.+?)\*\*\s*[—–-]\s*(.+)$/gm;
    let match;
    while ((match = regex.exec(body)) !== null) {
      items.push({ name: match[1].trim(), description: match[2].trim() });
    }
    tiers.push({ tier: heading, items });
  }

  return tiers;
}

/**
 * Worked examples (quantitative: calculations, thresholds) and scenarios
 * (qualitative: real-world application stories) for each regulatory standard.
 * Hardcoded alongside other embedded data (stakeholder personas, success questions).
 */
const STANDARD_EXAMPLES = {
  'API 510': {
    workedExamples: [
      'Corrosion rate calculation: current thickness 12.1mm, previous 12.8mm measured 4 years ago → rate = 0.175 mm/yr. At min required 9.5mm, remaining life = (12.1 - 9.5) / 0.175 = 14.9 years.',
      'Maximum interval: API 510 allows max 10 years or half remaining life, whichever is less. With 14.9 years remaining, next internal inspection due in 7.4 years.',
    ],
    scenarios: [
      'A refinery discovers CUI on a heat exchanger shell during routine insulation removal. API 510 Section 6 requires the inspector to assess the extent of damage and determine whether a fitness-for-service evaluation per API 579 is needed before the vessel returns to service.',
    ],
    reportExcerpts: [
      'Vessel ID: V-1042 | Service: Crude Oil (H2S trace)\nTHICKNESS READINGS (UT):\n  TML-03 (Lower shell): 12.1 mm (nominal 19.1 mm) — Rate: 0.875 mm/yr\n  TML-04 (Bottom nozzle): 9.8 mm (nominal 19.1 mm) — Rate: 1.16 mm/yr [CRITICAL]\nREMAINING LIFE:\n  TML-03: (12.1 - 9.5) / 0.875 = 2.97 years — RED (<5yr)\n  TML-04: (9.8 - 9.5) / 1.16 = 0.26 years — CRITICAL (<2yr)\nRECOMMENDATION: FFS evaluation per API 579-1 Level 2 required for TML-04.',
    ],
  },
  'LOLER': {
    workedExamples: [
      'Thorough examination frequency: LOLER Regulation 9 requires 6-monthly examination for equipment used to lift persons, 12-monthly for all other lifting equipment. A building hoist carrying workers needs examination every 6 months.',
    ],
    scenarios: [
      'A construction site tower crane fails its thorough examination due to a cracked slew ring bolt. LOLER requires the crane to be taken out of service immediately. The competent person must issue a report within 28 days — but the verbal notification of a dangerous defect must go to the site manager and enforcing authority the same day.',
      'A factory receives a second-hand overhead crane. LOLER Regulation 9(3) requires a thorough examination before first use at the new location, regardless of any existing certificates.',
    ],
    reportExcerpts: [
      'Equipment: Overhead Bridge Crane, SWL 20 tonnes | Serial: SC-2019-4451\nSAFE TO CONTINUE IN USE: NO\nDEFECTS:\n1. Wire rope — primary hoist: 6 broken wires in one lay length (discard criteria exceeded per ISO 4309). Classification: COULD BECOME A DANGER. Action: Replace within 14 days.\n2. Upper travel limit switch: failed functional test. Classification: EXISTING OR IMMINENT DANGER. Crane immediately taken out of service. HSE notified same day.',
    ],
  },
  'BS 7671': {
    workedExamples: [
      'Maximum Zs verification: for a Type B 32A MCB, BS 7671 Table 41.3 gives max Zs of 1.37Ω at 70°C. Measured Zs at ambient is 0.95Ω. Applying the 0.8 correction factor: 0.95 / 0.8 = 1.19Ω — passes (below 1.37Ω).',
      'Cable sizing: a 230V circuit supplying a 7.2kW shower needs minimum 31.3A capacity. Derating for grouping (0.65) and thermal insulation (0.5) gives required It = 31.3 / (0.65 × 0.5) = 96.3A — 16mm² T&E cable rated at 100A is adequate.',
    ],
    scenarios: [
      'An EICR on a 1970s property reveals TN-S earthing with a measured Ze of 0.8Ω, but the main earth terminal shows signs of corrosion. The inspector notes this as a C2 (potentially dangerous) because a high-impedance earth path could fail under fault conditions.',
    ],
    reportExcerpts: [
      'EICR — BS 7671:2018+A2:2022 | Supply: TN-S | Ze: 0.35 ohm\nOVERALL ASSESSMENT: UNSATISFACTORY\nOBSERVATIONS:\n  Cct 7 (32A radial) — C2: Zs = 1.82 ohm, exceeds max 1.37 ohm for Type B 32A MCB. Disconnection time not met (Table 41.3).\n  Cct 12 (ring final) — C2: IR (L-E) = 0.8 M ohm, below 1.0 M ohm minimum (Table 61).\n  Main switch — C3: No Type 2 SPD fitted. Recommended per Section 534.',
    ],
  },
  'ISO 17020': {
    workedExamples: [
      'Competence matrix: an inspection body must demonstrate that each inspector has qualifications, training, and experience for the specific inspection types they perform. A gap analysis reveals 2 of 8 inspectors lack formal NDT Level II certification — corrective action required before next UKAS assessment.',
    ],
    scenarios: [
      'During a UKAS surveillance visit, the assessor finds that an inspection body\'s procedure for subcontracting NDT work does not include verification of the subcontractor\'s ISO 17025 accreditation. This is raised as a non-conformity under clause 6.3.',
    ],
    reportExcerpts: [
      'UKAS ASSESSMENT — ISO/IEC 17020:2012 | Inspection Body Type A\nNON-CONFORMITY 1 — Clause 6.1.6 (Competence):\n  Inspectors #INS-07 and #INS-11 authorised for MEWP thorough examinations. Personnel files show general lifting training only. No MEWP-specific competence evidence.\nNON-CONFORMITY 2 — Clause 6.3 (Subcontracting):\n  NDT subcontractor ISO 17025 accreditation expired 2025-10-15. No verification prior to engagement. 3 jobs affected.',
    ],
  },
  'PED': {
    workedExamples: [
      'Category classification: a steam boiler with volume 800L and max pressure 15 bar falls into PED Category IV (PS × V > 3000 bar·L for Group 1 fluids). This requires a Notified Body to perform design examination and production surveillance.',
    ],
    scenarios: [
      'A pressure vessel manufacturer exports to the EU. The PED requires CE marking and a Declaration of Conformity before placing on the market. During an audit, the Notified Body discovers the manufacturer\'s weld procedures were qualified to an older standard — production halts until procedures are requalified.',
    ],
    reportExcerpts: [
      'EU-TYPE EXAMINATION — PED 2014/68/EU, Module B | NB 0045\nEquipment: Shell-and-tube heat exchanger, Type HX-450\nPS: 45 bar | V: 200 L | Fluid group: 1 | Category: III\nFINDINGS:\n  Design calculations: Verified per EN 13445-3. Adequate.\n  Materials: SA-516 Gr.70, certs per EN 10204 3.2. Compliant.\n  Welding: WPS references EN ISO 15614-1:2004 — NON-COMPLIANT. Current standard is 2017 revision.\n  Pressure test: Hydrostatic at 65.25 bar (1.45 x PS). Passed.\nSTATUS: CERTIFICATE WITHHELD pending WPS requalification.',
    ],
  },
  'PUWER': {
    workedExamples: [
      'Risk assessment threshold: a guillotine in a sheet metal workshop. PUWER Regulation 11 requires that access to dangerous parts be prevented. The risk assessment shows 3 operators use it daily — interlocked guard with trapped key is the minimum acceptable safeguard.',
    ],
    scenarios: [
      'An inspector examining a packaging line finds that a conveyor guard was removed to clear a jam and not replaced. Under PUWER Regulation 11, the employer must ensure guards are maintained in position. The inspector notes this as a PUWER breach requiring immediate reinstatement.',
    ],
    reportExcerpts: [
      'Equipment: Semi-automatic case erector, Endoline 221 | Line 3\nFINDINGS:\n  Reg 6 (Inspection): No inspection record following relocation from Line 1 to Line 3 (Sep 2025). NON-COMPLIANT.\n  Reg 11 (Dangerous parts): Interlocked guard defeated with cable tie. Non-captive tongue interlock — easily bypassed. NON-COMPLIANT.\n  Reg 9 (Training): No retraining after relocation. NON-COMPLIANT.\nACTIONS: Prohibition Notice — machine out of service. Improvement Notice — risk assessment + interlock replacement + retraining due 2026-03-29.',
    ],
  },
  'ISO 9001': {
    workedExamples: [
      'Process performance metric: a factory targets <2% defect rate. Current 6-month rolling average is 3.4%. ISO 9001 Clause 9.1 requires analysis of this data and evidence of corrective action — the audit checks both the trend data and the CAPA records.',
    ],
    scenarios: [
      'A manufacturing company\'s internal audit programme has not covered the purchasing process for 18 months. The external auditor raises this as a minor non-conformity under Clause 9.2: the audit programme must cover all QMS processes within the audit cycle.',
    ],
    reportExcerpts: [
      'ISO 9001:2015 SURVEILLANCE AUDIT\nMAJOR NC — NCR-2026-001 | Clause 8.4.2 / 8.7:\n  Incoming inspection: 3/10 ABS pellet batches below MFI spec (16.1, 15.8, 17.2 vs. required 18-22 g/10min). All accepted into production with no concession or NCR raised.\n  Corrective action due: 2026-05-10 (90 days).\nMINOR NC — NCR-2026-002 | Clause 7.1.5:\n  MFI tester calibration expired 2025-12-28. No recalibration or interim verification.\n  Corrective action due: Before next surveillance.',
    ],
  },
  'ISO 17025': {
    workedExamples: [
      'Measurement uncertainty budget: a calibration lab calculates expanded uncertainty for a 10mm gauge block calibration as U = 0.12μm (k=2). The customer requires uncertainty below 0.2μm — the lab\'s capability is confirmed adequate.',
    ],
    scenarios: [
      'A testing laboratory discovers that a batch of reference materials has expired. ISO 17025 Clause 6.6 requires that results produced using expired references be reviewed. Potentially affected reports must be identified and clients notified if results may have been compromised.',
    ],
    reportExcerpts: [
      'Charpy V-notch impact test, EN ISO 148-1:2016\nMaterial: S355J2+N steel plate, Heat No: 84291-T | Test temp: -20C\nRESULTS:\n  Specimen 1: 47 J (LE: 0.62 mm)\n  Specimen 2: 52 J (LE: 0.71 mm)\n  Specimen 3: 44 J (LE: 0.58 mm)\n  Mean: 47.7 J (Requirement: min 27 J at -20C per EN 10025-2)\nUNCERTAINTY: +/- 2.1 J (k=2, 95% confidence)\nCONFORMITY: PASS (simple acceptance per ILAC-G8 — 47.7 - 2.1 = 45.6 J > 27 J).',
    ],
  },
};

// ---------------------------------------------------------------------------
// Scope Product
// ---------------------------------------------------------------------------

/**
 * Parse scope_product.md into structured JSON.
 * Returns: { description, capabilities, metrics, revenue, companyFacts, moat, competitors, coreTension }
 */
function parseScopeProduct(content) {
  if (!content) return {};

  const sections = splitSections(content, 2);

  return {
    description: extractProse(sections.get('What Scope AI Does')),
    capabilities: parseCapabilities(sections.get('Core Capabilities')),
    metrics: parseTable(sections.get('Performance Claims') || ''),
    revenue: extractProse(sections.get('Revenue Model')),
    companyFacts: parseTable(sections.get('Company Facts') || ''),
    moat: extractProse(sections.get('Moat')),
    competitors: parseTable(sections.get('Competitive Landscape') || ''),
    coreTension: extractProse(sections.get('The Core Tension: Bespoke vs Scale')),
  };
}

/**
 * Parse capabilities from the Core Capabilities section.
 * Each ### heading is a capability with bullet point details.
 */
function parseCapabilities(content) {
  if (!content) return [];

  const subsections = splitSections(content, 3);
  const capabilities = [];

  for (const [heading, body] of subsections) {
    const slug = heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
    capabilities.push({
      name: heading,
      slug,
      features: parseBulletList(body),
      maturity: CAPABILITY_MATURITY[slug] || 'Planned',
    });
  }

  return capabilities;
}

/**
 * Maturity labels per capability. Reflects current product state:
 * "Live" = fully deployed, "Beta" = available but limited rollout, "Planned" = roadmap.
 */
const CAPABILITY_MATURITY = {
  'report-generation': 'Live',
  'data-normalisation': 'Live',
  'anomaly-detection': 'Live',
  'compliance-dashboards': 'Beta',
  'mobile-data-capture': 'Live',
  'template-engine': 'Live',
  'integration-layer': 'Beta',
  'knowledge-retention': 'Planned',
};

/**
 * Aggregate metrics from client file cache for hero display on Scope Product section.
 * Returns: { totalActiveUsers, avgAdoptionRate, productMaturity }
 * @param {Map} clientsMap - cache.clients map (slug → parsed client object)
 */
function aggregateClientMetrics(clientsMap) {
  const clients = Array.from(clientsMap.values());
  let totalUsers = 0;
  let adoptionSum = 0;
  let adoptionCount = 0;

  for (const client of clients) {
    const ds = client.deploymentState || {};

    // Parse user count from "45 inspectors (...)" style strings
    const usersStr = ds.users || '';
    const usersMatch = usersStr.match(/(\d+)\s*inspectors/i);
    if (usersMatch) totalUsers += parseInt(usersMatch[1], 10);

    // Also count supervisors/leads if mentioned
    const supervisorsMatch = usersStr.match(/(\d+)\s*supervisors/i);
    if (supervisorsMatch) totalUsers += parseInt(supervisorsMatch[1], 10);

    // Adoption percentage
    if (ds.adoptionPercent && typeof ds.adoptionPercent === 'number') {
      adoptionSum += ds.adoptionPercent;
      adoptionCount++;
    }
  }

  const avgAdoption = adoptionCount > 0 ? Math.round(adoptionSum / adoptionCount) : 0;

  // Product maturity stage based on capability maturity distribution
  const maturityValues = Object.values(CAPABILITY_MATURITY);
  const liveCount = maturityValues.filter(m => m === 'Live').length;
  const totalCaps = maturityValues.length;
  const maturityStage = liveCount >= totalCaps * 0.75 ? 'Production'
    : liveCount >= totalCaps * 0.5 ? 'Growth'
    : 'Early';

  return {
    totalActiveUsers: totalUsers,
    avgAdoptionRate: avgAdoption,
    productMaturity: maturityStage,
  };
}

// ---------------------------------------------------------------------------
// Stakeholder Personas (embedded data, not parsed from file)
// ---------------------------------------------------------------------------

function getStakeholderPersonas() {
  return [
    {
      id: 'inspector',
      name: 'Field Inspector',
      icon: 'HardHat',
      oneLiner: 'End user — captures data and reviews generated reports',
      role: 'Performs physical inspections. Uses mobile app for data capture. Reviews and approves AI-generated reports before issuance.',
      successCriteria: 'Faster report turnaround, fewer corrections, less time at desk writing',
      talkingPoints: ['Report writing time savings', 'Offline mobile capture reliability', 'AI accuracy on their specific inspection types'],
      frictionPoints: ['Distrust of AI accuracy', 'Workflow change resistance', '"My way works fine"', 'Poor mobile connectivity on site'],
    },
    {
      id: 'supervisor',
      name: 'Operations Supervisor',
      icon: 'ClipboardCheck',
      oneLiner: 'Manages inspector teams — cares about throughput and consistency',
      role: 'Oversees inspection teams. Reviews reports for quality and consistency. Manages scheduling and workload allocation.',
      successCriteria: 'Consistent report quality across team, faster turnaround, fewer client complaints',
      talkingPoints: ['Team-wide consistency metrics', 'Quality dashboard visibility', 'Reduced rework rates'],
      frictionPoints: ['Loss of control over quality', 'Training burden for team', 'Accountability if AI-generated report has errors'],
    },
    {
      id: 'quality-manager',
      name: 'Quality Manager',
      icon: 'ShieldCheck',
      oneLiner: 'Owns accreditation and compliance — gatekeeper for new tools',
      role: 'Maintains ISO 17020/17025 accreditation. Validates that any new tool meets regulatory requirements. Signs off on process changes.',
      successCriteria: 'Maintained accreditation, audit trail, demonstrable compliance',
      talkingPoints: ['Audit trail and traceability', 'Compliance checking automation', 'Regulatory format adherence'],
      frictionPoints: ['Accreditation risk from changing processes', 'Needs to validate AI output against standards', 'Slow approval cycles'],
    },
    {
      id: 'it-manager',
      name: 'IT / Systems Manager',
      icon: 'Server',
      oneLiner: 'Evaluates technical fit — security, integration, infrastructure',
      role: 'Manages enterprise systems (CMMS, EAM, ERP). Evaluates security, data residency, integration requirements. Controls technical procurement.',
      successCriteria: 'Clean integration, no security incidents, minimal support burden',
      talkingPoints: ['API integration capabilities', 'Data residency and security', 'SSO and access control'],
      frictionPoints: ['Integration complexity', 'Data sovereignty concerns', 'Another system to support', 'Legacy infrastructure constraints'],
    },
    {
      id: 'commercial-director',
      name: 'Commercial Director',
      icon: 'TrendingUp',
      oneLiner: 'P&L owner — needs ROI justification and competitive advantage',
      role: 'Owns divisional P&L. Evaluates investment against revenue impact. Needs clear ROI case and competitive positioning.',
      successCriteria: 'Measurable efficiency gains, client retention improvement, margin expansion',
      talkingPoints: ['45% cycle time reduction claim', 'Client satisfaction scores', 'Competitive differentiation vs peers'],
      frictionPoints: ['ROI must be proven before scale', 'Budget cycles are annual', 'Needs board-level justification'],
    },
    {
      id: 'technical-director',
      name: 'Technical Director',
      icon: 'Microscope',
      oneLiner: 'Domain expert — sets technical standards and methodology',
      role: 'Defines inspection methodologies and technical standards. Expert in specific inspection domains. Approves technical changes.',
      successCriteria: 'Technical accuracy maintained, methodology improvements, knowledge retention',
      talkingPoints: ['Domain-specific AI accuracy', 'Anomaly detection capabilities', 'Historical data trending'],
      frictionPoints: ['AI cannot replace domain judgment', 'Methodology must remain inspector-led', 'Sceptical of AI in safety-critical applications'],
    },
    {
      id: 'asset-owner',
      name: 'Asset Owner / End Client',
      icon: 'Building2',
      oneLiner: 'Receives reports — wants faster, clearer, more actionable output',
      role: 'Commissions inspections from TIC companies. Receives and acts on reports. Manages assets based on inspection findings.',
      successCriteria: 'Faster report delivery, clearer findings, better trending data, compliance assurance',
      talkingPoints: ['Report delivery speed', 'Data quality and consistency', 'Portfolio-level dashboards'],
      frictionPoints: ['No direct purchasing relationship (buys from TIC company)', 'May resist format changes', 'Wants backward compatibility with existing systems'],
    },
    {
      id: 'regulator',
      name: 'Regulator / Notified Body',
      icon: 'Scale',
      oneLiner: 'Sets the rules — any tool must demonstrably meet requirements',
      role: 'Defines regulatory requirements. Audits TIC companies for compliance. Reviews examination reports for adequacy.',
      successCriteria: 'Full compliance, clear audit trail, no reduction in safety standards',
      talkingPoints: ['Regulatory format compliance', 'Audit trail completeness', 'Human-in-the-loop guarantee'],
      frictionPoints: ['Conservative approach to AI in safety', 'May require validation/certification', 'Different requirements per jurisdiction'],
    },
  ];
}

// ---------------------------------------------------------------------------
// Success Questions (embedded data, not parsed from file)
// ---------------------------------------------------------------------------

function getSuccessQuestions() {
  return [
    {
      id: 'discovery',
      name: 'Discovery & Scoping',
      icon: 'Search',
      questions: [
        'How many inspectors do you have across all locations?',
        'What inspection types make up the majority of your workload?',
        'What does your current report writing workflow look like?',
        'How long does a typical report take from inspection to issuance?',
        'What systems do you currently use for inspection management?',
        'What percentage of your reports go through rework or corrections?',
      ],
    },
    {
      id: 'pain-points',
      name: 'Pain Points & Priorities',
      icon: 'AlertTriangle',
      questions: [
        'What is your biggest bottleneck in the inspection cycle?',
        'Where do you see the most inconsistency in report quality?',
        'How often do late reports create compliance or contractual issues?',
        'What would be the impact of cutting report turnaround time in half?',
        'Which inspection types have the highest error rates?',
        'What keeps your quality manager up at night?',
      ],
    },
    {
      id: 'technical-fit',
      name: 'Technical Fit & Integration',
      icon: 'Puzzle',
      questions: [
        'What CMMS/EAM systems are you running?',
        'Do you have API access to your current inspection platform?',
        'What are your data residency requirements?',
        'Do inspectors have reliable connectivity on site?',
        'What mobile devices do your inspectors carry?',
        'How do you currently handle offline data capture?',
      ],
    },
    {
      id: 'commercial',
      name: 'Commercial & Decision-Making',
      icon: 'DollarSign',
      questions: [
        'What does your procurement process look like for new tools?',
        'Who needs to sign off on a pilot? On a full deployment?',
        'What budget cycle are you in right now?',
        'Have you evaluated other inspection automation tools?',
        'What would a successful 90-day pilot look like to you?',
        'What metrics would you use to measure ROI?',
      ],
    },
    {
      id: 'deployment',
      name: 'Deployment & Change Management',
      icon: 'Rocket',
      questions: [
        'How do you typically roll out new tools to your inspection teams?',
        'What has worked well in past technology deployments?',
        'What has failed in past technology deployments?',
        'Who are your internal champions for this kind of change?',
        'What training support do your inspectors need?',
        'How do you handle the transition period when running old and new systems in parallel?',
      ],
    },
  ];
}

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

/**
 * Build the full knowledge response from all 4 files + embedded data.
 * Returns 7 sections matching the frontend TIC Playbook page structure.
 * @param {Map} [clientsMap] - Optional client cache for aggregated metrics on Scope Product
 * @param {object} [playbookData] - Optional playbook cache for client type data
 */
function buildKnowledgeResponse(inspectionTypesContent, regulatoryStandardsContent, reportAnatomyContent, scopeProductContent, clientsMap, playbookData) {
  const inspectionTypes = parseInspectionTypes(inspectionTypesContent);
  const regulatoryStandards = parseRegulatoryStandards(regulatoryStandardsContent);
  const reportAnatomy = parseReportAnatomy(reportAnatomyContent);
  const scopeProduct = parseScopeProduct(scopeProductContent);
  const stakeholders = getStakeholderPersonas();
  const successQuestions = getSuccessQuestions();

  const sections = [
    {
      id: 'inspection-cycle',
      title: 'Inspection Cycle',
      icon: 'RotateCcw',
      description: 'Process flows, fields, instruments, and defects for all 6 TIC inspection types',
      data: inspectionTypes.map(t => ({
        name: t.name,
        slug: t.slug,
        processFlow: t.processFlow,
        description: t.description,
        keyFields: t.keyFields,
        instruments: t.instruments,
        commonDefects: t.commonDefects,
        deploymentNotes: t.deploymentNotes,
      })),
    },
    {
      id: 'stakeholders',
      title: 'Stakeholder Map',
      icon: 'Users',
      description: '8 key personas in TIC deployment conversations',
      data: stakeholders,
    },
    {
      id: 'regulatory-standards',
      title: 'Regulatory Standards',
      icon: 'BookOpen',
      description: '8 standards governing TIC inspection work',
      data: regulatoryStandards,
    },
    {
      id: 'report-structure',
      title: 'Report Structure',
      icon: 'FileText',
      description: 'Universal report skeleton with 7 sections',
      data: reportAnatomy,
    },
    {
      id: 'success-questions',
      title: 'Success Questions',
      icon: 'HelpCircle',
      description: '5 question groups for deployment conversations',
      data: successQuestions,
    },
    {
      id: 'scope-product',
      title: 'Scope Product',
      icon: 'Zap',
      description: 'Capabilities, metrics, competitive landscape',
      data: {
        ...scopeProduct,
        heroMetrics: clientsMap ? aggregateClientMetrics(clientsMap) : null,
      },
    },
  ];

  // Append client segmentation section from playbook data if available
  if (playbookData) {
    const insights = playbookData.clientTypeInsights || [];
    const definitions = playbookData.clientTypeDefinitions || {};

    // Combine insights (introductory points) and definitions (structured breakdown)
    // into categories for display
    const categories = Object.entries(definitions).map(([key, types]) => ({
      name: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      types: types || [],
    }));

    sections.push({
      id: 'client-types',
      title: 'Client Segmentation',
      icon: 'Users',
      description: 'Client types by scale, inspection workflow, and geography',
      data: {
        insights,
        categories,
      },
    });
  }

  return { sections };
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/** Extract clean prose from a section (strip blockquotes, tables, headings). */
function extractProse(content) {
  if (!content) return '';
  return content
    .split('\n')
    .filter(line => !line.startsWith('|') && !line.startsWith('>') && !line.startsWith('#') && !line.startsWith('---'))
    .join('\n')
    .trim();
}

/** Parse a simple bullet list into string array. */
function parseBulletList(content) {
  if (!content) return [];
  return content
    .split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(line => line.trim().replace(/^-\s+/, ''));
}

/** Parse bold-prefixed bullet items into { name, detail } array. */
function parseBoldBullets(content) {
  if (!content) return [];
  const items = [];
  const regex = /^-\s+\*\*(.+?)\*\*\s*[—–-]\s*(.+)$/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    items.push({ name: match[1].trim(), detail: match[2].trim() });
  }
  // Fallback to plain bullets if no bold items found
  if (items.length === 0) return parseBulletList(content);
  return items;
}

module.exports = {
  parseInspectionTypes,
  parseRegulatoryStandards,
  parseReportAnatomy,
  parseScopeProduct,
  getStakeholderPersonas,
  getSuccessQuestions,
  buildKnowledgeResponse,
};
