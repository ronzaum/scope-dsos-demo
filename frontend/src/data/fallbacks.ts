/**
 * Fallback data extracted from aidapt-stream's hardcoded values.
 * Used when the API is unreachable so the app still renders.
 */

export const FALLBACK_OVERVIEW = {
  stats: {
    activeDeployments: 3,
    avgOnboarding: "14 days",
    revenueAtRisk: { total: 150000, clientCount: 1 },
    pendingAdoption: { totalUsers: 28, clientCount: 2 },
    templatesPerClient: 0,
  },
  deployments: [
    {
      client: "Bureau Veritas",
      slug: "bureau_veritas",
      sector: "Construction",
      stage: "Phase 2",
      health: "green",
      contract: "£250k",
      users: "49/56",
      adoption: 84,
      openIssues: 1,
      hasBlocking: false,
      nextAction: "Phase 2 compliance dashboard rollout",
    },
    {
      client: "TÜV SÜD",
      slug: "tuv_sud",
      sector: "Industrial",
      stage: "Phase 1",
      health: "red",
      contract: "£150k",
      users: "10/26",
      adoption: 40,
      openIssues: 1,
      hasBlocking: true,
      nextAction: "Adoption recovery: on-site sprint",
    },
    {
      client: "Intertek",
      slug: "intertek",
      sector: "Consumer Products",
      stage: "Intake",
      health: "green",
      contract: "Scoping",
      users: "—",
      adoption: null,
      openIssues: 0,
      hasBlocking: false,
      nextAction: "First meeting March 5",
    },
  ],
  signalFeed: [
    { time: "2h ago", icon: "activity", text: "Bureau Veritas adoption at 84% (up from 82%)", client: "Bureau Veritas" },
    { time: "6h ago", icon: "alert", text: "TÜV SÜD: Andreas Keller escalating internally - needs visible progress in 6 weeks", client: "TÜV SÜD" },
    { time: "1d ago", icon: "email", text: "Intertek: James Wright confirmed March 5 meeting", client: "Intertek" },
    { time: "2d ago", icon: "check", text: "Bureau Veritas ISSUE-002 resolved: quick capture mode shipped", client: "Bureau Veritas" },
    { time: "3d ago", icon: "activity", text: "Playbook updated: \"Phased rollout outperforms full launch\" pattern added", client: "" },
    { time: "5d ago", icon: "alert", text: "Pivot applied: Remote setup restricted for protocol-driven clients", client: "" },
    { time: "1w ago", icon: "activity", text: "Intertek client file created - inbound via BD campaign", client: "Intertek" },
  ],
  priorityQueue: [
    { slug: "tuv_sud", name: "TUV SUD", urgency: "high" as const, score: 75, blocking: "ISSUE-001: Template configuration mismatch", proposedAction: "Resolve ISSUE-001: Template configuration mismatch", effort: "2-3 days DS time", factors: ["Adoption 50% below target", "1 blocking issue(s)"] },
    { slug: "bureau_veritas", name: "Bureau Veritas", urgency: "medium" as const, score: 25, blocking: "None", proposedAction: "Prepare expansion brief for Marc Dubois (£1.2M)", effort: "Half day", factors: ["Renewal in 87d"] },
    { slug: "intertek", name: "Intertek", urgency: "low" as const, score: 0, blocking: "None", proposedAction: "Monitor - on track", effort: "None right now", factors: [] },
  ],
  weekAtAGlance: {
    priorities: [
      "🔴 TÜV SÜD adoption recovery - on-site sprint scheduled, 6-week deadline",
      "📋 Intertek first meeting March 5 - prep constraint map",
    ],
    notifications: [
      { time: "2h ago", text: "📈 Bureau Veritas adoption ticked up to 84%" },
      { time: "6h ago", text: "⚠️ TÜV SÜD escalation flagged by Andreas Keller" },
      { time: "1d ago", text: "📧 Intertek meeting confirmed for March 5" },
    ],
    recentChanges: [
      { time: "2d ago", text: "✅ ISSUE-002 resolved - quick capture mode shipped" },
      { time: "3d ago", text: "📘 Playbook updated with phased rollout pattern" },
      { time: "5d ago", text: "🔄 Pivot: remote setup restricted for protocol clients" },
    ],
  },
};

export const FALLBACK_PLAYBOOK = {
  deploymentPatterns: [
    { name: "Template Normalisation", source: "Bureau Veritas", appliesWhen: "Client uses inconsistent templates across teams or regions", confidence: "High", pattern: "Standardize inspection templates before rollout. Inconsistent templates create adoption friction as users encounter unfamiliar formats.", recommendedAction: "Add a template audit step to onboarding." },
    { name: "Mobile UI Friction = #1 Blocker", source: "Bureau Veritas, TÜV SÜD", appliesWhen: "Field teams report difficulty with mobile capture workflow", confidence: "High", pattern: "Mobile interface friction is consistently the top adoption blocker.", recommendedAction: "Test the upload/capture flow with real inspectors before deployment." },
    { name: "Phased Rollout Outperforms Full Launch", source: "Bureau Veritas", appliesWhen: "Enterprise clients with 100+ potential users", confidence: "High", pattern: "Starting with 10-20 pilot users leads to higher sustained adoption than big-bang launches.", recommendedAction: "Always start with a pilot cohort of 10-15 users." },
    { name: "Supervisor Adoption Creates Inspector Pull", source: "Bureau Veritas", appliesWhen: "Hierarchical inspection teams with supervisor layer", confidence: "Medium", pattern: "When supervisors actively use dashboards, field inspectors report feeling more motivated.", recommendedAction: "Prioritise supervisor value props in Phase 1." },
  ],
  resolutionPatterns: [
    { name: "Mobile UI Friction - Adoption Blocker", source: "Bureau Veritas, TÜV SÜD", confidence: "High", pattern: "When adoption stalls, first check mobile UI friction." },
    { name: "Template Configuration Mismatch - Adoption Blocker", source: "TÜV SÜD", confidence: "Medium", pattern: "Templates configured remotely without observing actual workflow will mismatch." },
    { name: "Data Format Inconsistency - Integration Failure", source: "Bureau Veritas", confidence: "High", pattern: "Legacy system data formats must be mapped before integration." },
    { name: "Localisation Incomplete - Integration Failure", source: "Bureau Veritas", confidence: "High", pattern: "Multi-region deployments fail when localisation is incomplete." },
  ],
  deploymentMethods: [],
  metricsBenchmarks: [
    { metric: "Inspector adoption", bureauVeritasMonth3: "84%", tuvSudMonth5: "40%", target: "85%+" },
    { metric: "Report turnaround improvement", bureauVeritasMonth3: "37%", tuvSudMonth5: "18%", target: "40%+" },
    { metric: "Supervisor adoption", bureauVeritasMonth3: "100%", tuvSudMonth5: "50%", target: "90%+" },
    { metric: "Compliance team engagement", bureauVeritasMonth3: "100%", tuvSudMonth5: "0%", target: "80%+" },
  ],
  metrics: {},
};

export const FALLBACK_METHODS = {
  methods: [
    { id: "M-001", name: "Phased Rollout", status: "Active - Default", conditions: "Enterprise, 100+ users", lastValidated: "BV, Jan 2026" },
    { id: "M-002", name: "Remote Setup", status: "Restricted ⚠️", conditions: "Flexible workflows only", lastValidated: "TÜV SÜD, Jan 2026" },
    { id: "M-003", name: "On-Site Embedding", status: "Available", conditions: "Protocol, high-value", lastValidated: "—" },
    { id: "M-004", name: "Hybrid", status: "Available", conditions: "Mid-high value, spread", lastValidated: "—" },
  ],
  rules: [
    { id: "R-001", rule: "All Phase 1 deployments must include at least 1 on-site observation day before template configuration." },
    { id: "R-002", rule: "Remote-only deployment method restricted to clients with flexible (non-protocol) inspection workflows." },
    { id: "R-003", rule: "Every resolved blocking issue must trigger a playbook update and cross-client scan." },
    { id: "R-004", rule: "Adoption below 50% at Phase 1 midpoint triggers automatic review and intervention plan." },
  ],
  changeLog: [],
};

export const FALLBACK_KNOWLEDGE = {
  sections: [
    {
      id: "inspection-cycle",
      title: "Inspection Cycle",
      icon: "RotateCcw",
      description: "Process flows, fields, instruments, and defects for all 6 TIC inspection types",
      data: [
        { name: "Pressure Vessel Inspection", slug: "pressure-vessel-inspection", description: "In-service inspection of pressure vessels per API 510", keyFields: ["Vessel ID", "Design pressure", "MAWP", "Wall thickness", "Corrosion rate"], instruments: ["UT thickness gauge", "Magnetic particle", "Dye penetrant"], commonDefects: [], deploymentNotes: ["High-value, safety-critical - accuracy is non-negotiable"], processFlow: [
          { id: 1, label: "Pre-inspection", detail: "Review previous records, history, and applicable standards", examples: ["Reviewing 10-year service history of a heat exchanger reveals accelerating corrosion rate"] },
          { id: 2, label: "External Survey", detail: "Visual and NDE examination of external surfaces", examples: [] },
          { id: 3, label: "Internal Survey", detail: "Entry and examination of internal surfaces where accessible", examples: [] },
          { id: 4, label: "Thickness Testing", detail: "Ultrasonic thickness measurements at predetermined points", examples: [] },
          { id: 5, label: "Assessment", detail: "Evaluate findings against acceptance criteria", examples: [] },
          { id: 6, label: "Report", detail: "Document findings, recommendations, and next inspection date", examples: ["Final report includes 24 UT readings, 6 photos of external corrosion, and recommended re-inspection date"] },
        ]},
        { name: "Lifting Equipment Inspection", slug: "lifting-equipment-inspection", description: "Thorough examination of lifting equipment per LOLER", keyFields: ["Equipment ID", "SWL", "Last examination date", "Defects found"], instruments: ["Calibrated load cells", "NDT equipment", "Measuring tools"], commonDefects: [], deploymentNotes: ["Statutory requirement - legal compliance drives adoption"], processFlow: [
          { id: 1, label: "Pre-inspection", detail: "Review LOLER thorough examination scheme", examples: [] },
          { id: 2, label: "Visual Check", detail: "Inspect for damage, corrosion, deformation", examples: ["Overhead crane wire rope shows 6 broken wires in one lay length"] },
          { id: 3, label: "Functional Test", detail: "Operate equipment through full range", examples: [] },
          { id: 4, label: "Load Test", detail: "Apply proof load where required by scheme", examples: [] },
          { id: 5, label: "Assessment", detail: "Compare findings to statutory requirements", examples: [] },
          { id: 6, label: "Report", detail: "Issue report of thorough examination", examples: [] },
        ]},
        { name: "Electrical Installation Inspection", slug: "electrical-installation-inspection", description: "Periodic inspection and testing of electrical installations per BS 7671", keyFields: ["Circuit reference", "Insulation resistance", "RCD trip time", "Loop impedance"], instruments: ["Multifunction tester", "Insulation resistance tester", "RCD tester"], commonDefects: [], deploymentNotes: ["EICR format is standardised - good template candidate"], processFlow: [
          { id: 1, label: "Review", detail: "Review previous EICR and installation records", examples: ["Previous EICR from 2021 noted 3 C3 observations"] },
          { id: 2, label: "Visual Inspection", detail: "Check for damage, deterioration, non-compliance", examples: [] },
          { id: 3, label: "Testing", detail: "Continuity, insulation resistance, RCD, loop impedance", examples: [] },
          { id: 4, label: "Assessment", detail: "Classify observations using EICR codes", examples: [] },
          { id: 5, label: "Report", detail: "Complete EICR with observation schedule", examples: [] },
        ]},
        { name: "NDT (Non-Destructive Testing)", slug: "ndt-non-destructive-testing", description: "Non-destructive examination using UT, RT, MT, PT, ET, VT methods", keyFields: ["Weld ID", "Technique", "Indication size", "Accept/reject"], instruments: ["UT flaw detector", "X-ray source", "Yoke electromagnet"], commonDefects: [], deploymentNotes: ["Highly technical - requires Level II/III certified operators"], processFlow: [
          { id: 1, label: "Preparation", detail: "Surface prep, equipment calibration, technique selection", examples: [] },
          { id: 2, label: "Application", detail: "Apply chosen NDT method (UT, RT, MT, PT, ET, VT)", examples: [] },
          { id: 3, label: "Interpretation", detail: "Analyse results against acceptance criteria", examples: [] },
          { id: 4, label: "Report", detail: "Document findings with indication locations and sizes", examples: [] },
        ]},
        { name: "Factory / Manufacturing Audit", slug: "factory-manufacturing-audit", description: "Quality management system audits per ISO 9001", keyFields: ["Audit scope", "Process area", "Finding classification", "Evidence"], instruments: ["Checklists", "Calibration records", "Document review"], commonDefects: [], deploymentNotes: ["Two-stage process - document review then on-site"], processFlow: [
          { id: 1, label: "Stage 1: Document Review", detail: "Evaluate QMS documentation against ISO 9001", examples: [] },
          { id: 2, label: "Stage 2: On-site Audit", detail: "Interview staff, observe processes, review records", examples: [] },
          { id: 3, label: "Finding Classification", detail: "Classify findings as major/minor NC or observation", examples: [] },
          { id: 4, label: "Report", detail: "Issue audit report with findings and corrective actions", examples: [] },
          { id: 5, label: "Follow-up", detail: "Verify corrective actions within agreed timeframe", examples: [] },
        ]},
        { name: "Fire Safety Inspection", slug: "fire-safety-inspection", description: "Fire risk assessment and inspection of fire protection systems", keyFields: ["Compartment ID", "Fire door condition", "Alarm zone", "Risk rating"], instruments: ["Thermal imaging camera", "Smoke detector tester", "Door gap gauge"], commonDefects: [], deploymentNotes: ["Life safety - zero tolerance for missed critical items"], processFlow: [
          { id: 1, label: "Document Review", detail: "Review fire risk assessment, previous reports", examples: [] },
          { id: 2, label: "Passive Fire", detail: "Inspect fire doors, compartmentation, penetrations", examples: [] },
          { id: 3, label: "Active Fire", detail: "Test alarms, sprinklers, emergency lighting", examples: [] },
          { id: 4, label: "Means of Escape", detail: "Check escape routes, signage, assembly points", examples: [] },
          { id: 5, label: "Risk Rating", detail: "Assign risk ratings per BS 9999 / RRO methodology", examples: [] },
          { id: 6, label: "Report", detail: "Issue fire risk assessment report with action plan", examples: [] },
        ]},
      ],
    },
    {
      id: "stakeholders",
      title: "Stakeholder Map",
      icon: "Users",
      description: "8 key personas in TIC deployment conversations",
      data: [
        { id: "inspector", name: "Field Inspector", icon: "HardHat", oneLiner: "End user - captures data and reviews generated reports", role: "Performs physical inspections. Uses mobile app for data capture.", successCriteria: "Faster report turnaround, fewer corrections", talkingPoints: ["Report writing time savings", "Offline mobile capture reliability"], frictionPoints: ["Distrust of AI accuracy", "Workflow change resistance"] },
        { id: "supervisor", name: "Operations Supervisor", icon: "ClipboardCheck", oneLiner: "Manages inspector teams - cares about throughput and consistency", role: "Oversees inspection teams. Reviews reports for quality.", successCriteria: "Consistent report quality, faster turnaround", talkingPoints: ["Team-wide consistency metrics", "Quality dashboard visibility"], frictionPoints: ["Loss of control over quality", "Training burden"] },
        { id: "quality-manager", name: "Quality Manager", icon: "ShieldCheck", oneLiner: "Owns accreditation and compliance - gatekeeper for new tools", role: "Maintains ISO 17020/17025 accreditation.", successCriteria: "Maintained accreditation, audit trail", talkingPoints: ["Audit trail and traceability", "Compliance checking automation"], frictionPoints: ["Accreditation risk", "Slow approval cycles"] },
        { id: "it-manager", name: "IT / Systems Manager", icon: "Server", oneLiner: "Evaluates technical fit - security, integration, infrastructure", role: "Manages enterprise systems. Evaluates security and integration.", successCriteria: "Clean integration, no security incidents", talkingPoints: ["API integration capabilities", "Data residency and security"], frictionPoints: ["Integration complexity", "Data sovereignty concerns"] },
        { id: "commercial-director", name: "Commercial Director", icon: "TrendingUp", oneLiner: "P&L owner - needs ROI justification and competitive advantage", role: "Owns divisional P&L. Evaluates investment against revenue impact.", successCriteria: "Measurable efficiency gains, margin expansion", talkingPoints: ["45% cycle time reduction", "Competitive differentiation"], frictionPoints: ["ROI must be proven before scale", "Annual budget cycles"] },
        { id: "technical-director", name: "Technical Director", icon: "Microscope", oneLiner: "Domain expert - sets technical standards and methodology", role: "Defines inspection methodologies and technical standards.", successCriteria: "Technical accuracy maintained, knowledge retention", talkingPoints: ["Domain-specific AI accuracy", "Anomaly detection"], frictionPoints: ["AI cannot replace domain judgment", "Sceptical of AI in safety-critical"] },
        { id: "asset-owner", name: "Asset Owner / End Client", icon: "Building2", oneLiner: "Receives reports - wants faster, clearer, more actionable output", role: "Commissions inspections. Manages assets based on findings.", successCriteria: "Faster report delivery, clearer findings", talkingPoints: ["Report delivery speed", "Portfolio-level dashboards"], frictionPoints: ["No direct purchasing relationship", "Resists format changes"] },
        { id: "regulator", name: "Regulator / Notified Body", icon: "Scale", oneLiner: "Sets the rules - any tool must demonstrably meet requirements", role: "Defines regulatory requirements. Audits TIC companies.", successCriteria: "Full compliance, clear audit trail", talkingPoints: ["Regulatory format compliance", "Human-in-the-loop guarantee"], frictionPoints: ["Conservative approach to AI in safety", "Different requirements per jurisdiction"] },
      ],
    },
    {
      id: "regulatory-standards",
      title: "Regulatory Standards",
      icon: "BookOpen",
      description: "8 standards governing TIC inspection work",
      data: [
        { name: "API 510", slug: "api-510", subtitle: "Pressure Vessel Inspection Code", fullName: "API 510 - Pressure Vessel Inspection Code", issuedBy: "American Petroleum Institute", governs: "In-service pressure vessel inspection", details: [], reportRequirements: "", externalLink: "https://www.api.org/products-and-services/individual-certification-programs/certifications/api510", workedExamples: ["Corrosion rate calculation: current thickness 12.1mm, previous 12.8mm measured 4 years ago - rate = 0.175 mm/yr"], scenarios: ["A refinery discovers CUI on a heat exchanger shell during routine insulation removal"], reportExcerpts: ["Vessel ID: V-1042 | Service: Crude Oil (H2S trace)\nTHICKNESS READINGS (UT):\n  TML-03 (Lower shell): 12.1 mm (nominal 19.1 mm) - Rate: 0.875 mm/yr\n  TML-04 (Bottom nozzle): 9.8 mm (nominal 19.1 mm) - Rate: 1.16 mm/yr [CRITICAL]\nREMAINING LIFE:\n  TML-03: (12.1 - 9.5) / 0.875 = 2.97 years - RED (<5yr)\n  TML-04: (9.8 - 9.5) / 1.16 = 0.26 years - CRITICAL (<2yr)"] },
        { name: "LOLER", slug: "loler", subtitle: "Lifting Operations and Lifting Equipment Regulations", fullName: "LOLER 1998", issuedBy: "UK HSE", governs: "Lifting equipment thorough examination", details: [], reportRequirements: "", externalLink: "https://www.hse.gov.uk/work-equipment-machinery/loler.htm", workedExamples: ["Thorough examination frequency: LOLER Regulation 9 requires 6-monthly examination for equipment used to lift persons, 12-monthly for all other lifting equipment. A building hoist carrying workers needs examination every 6 months."], scenarios: ["A construction site tower crane fails its thorough examination due to a cracked slew ring bolt. LOLER requires the crane to be taken out of service immediately. The competent person must issue a report within 28 days - but the verbal notification of a dangerous defect must go to the site manager and enforcing authority the same day."], reportExcerpts: ["Equipment: Overhead Bridge Crane, SWL 20 tonnes | Serial: SC-2019-4451\nSAFE TO CONTINUE IN USE: NO\nDEFECTS:\n1. Wire rope - primary hoist: 6 broken wires in one lay length (discard criteria exceeded per ISO 4309). Classification: COULD BECOME A DANGER. Action: Replace within 14 days.\n2. Upper travel limit switch: failed functional test. Classification: EXISTING OR IMMINENT DANGER. Crane immediately taken out of service. HSE notified same day."] },
        { name: "BS 7671", slug: "bs-7671", subtitle: "IET Wiring Regulations", fullName: "BS 7671:2018+A2:2022", issuedBy: "IET / BSI", governs: "Electrical installation design, erection, and verification", details: [], reportRequirements: "", externalLink: "https://electrical.theiet.org/wiring-matters/years/2022/86-mar-2022/bs-7671-18th-edition-amendments/", workedExamples: ["Maximum Zs verification: for a Type B 32A MCB, BS 7671 Table 41.3 gives max Zs of 1.37\u03A9 at 70\u00B0C. Measured Zs at ambient is 0.95\u03A9. Applying the 0.8 correction factor: 0.95 / 0.8 = 1.19\u03A9 - passes (below 1.37\u03A9)."], scenarios: ["An EICR on a 1970s property reveals TN-S earthing with a measured Ze of 0.8\u03A9, but the main earth terminal shows signs of corrosion. The inspector notes this as a C2 (potentially dangerous) because a high-impedance earth path could fail under fault conditions."], reportExcerpts: ["EICR - BS 7671:2018+A2:2022 | Supply: TN-S | Ze: 0.35 ohm\nOVERALL ASSESSMENT: UNSATISFACTORY\nOBSERVATIONS:\n  Cct 7 (32A radial) - C2: Zs = 1.82 ohm, exceeds max 1.37 ohm for Type B 32A MCB. Disconnection time not met (Table 41.3).\n  Cct 12 (ring final) - C2: IR (L-E) = 0.8 M ohm, below 1.0 M ohm minimum (Table 61).\n  Main switch - C3: No Type 2 SPD fitted. Recommended per Section 534."] },
        { name: "ISO 17020", slug: "iso-17020", subtitle: "Requirements for Inspection Bodies", fullName: "ISO/IEC 17020:2012", issuedBy: "ISO", governs: "Competence of inspection bodies", details: [], reportRequirements: "", externalLink: "https://www.iso.org/standard/52994.html", workedExamples: ["Competence matrix: an inspection body must demonstrate that each inspector has qualifications, training, and experience for the specific inspection types they perform. A gap analysis reveals 2 of 8 inspectors lack formal NDT Level II certification - corrective action required before next UKAS assessment."], scenarios: ["During a UKAS surveillance visit, the assessor finds that an inspection body's procedure for subcontracting NDT work does not include verification of the subcontractor's ISO 17025 accreditation. This is raised as a non-conformity under clause 6.3."], reportExcerpts: ["UKAS ASSESSMENT - ISO/IEC 17020:2012 | Inspection Body Type A\nNON-CONFORMITY 1 - Clause 6.1.6 (Competence):\n  Inspectors #INS-07 and #INS-11 authorised for MEWP thorough examinations. Personnel files show general lifting training only. No MEWP-specific competence evidence.\nNON-CONFORMITY 2 - Clause 6.3 (Subcontracting):\n  NDT subcontractor ISO 17025 accreditation expired 2025-10-15. No verification prior to engagement. 3 jobs affected."] },
        { name: "PED", slug: "ped", subtitle: "Pressure Equipment Directive", fullName: "Directive 2014/68/EU", issuedBy: "European Commission", governs: "Pressure equipment placed on the EU market", details: [], reportRequirements: "", externalLink: "https://single-market-economy.ec.europa.eu/sectors/pressure-equipment-and-gas-appliances/pressure-equipment-sector/pressure-equipment-directive-201468eu_en", workedExamples: ["Category classification: a steam boiler with volume 800L and max pressure 15 bar falls into PED Category IV (PS \u00D7 V > 3000 bar\u00B7L for Group 1 fluids). This requires a Notified Body to perform design examination and production surveillance."], scenarios: ["A pressure vessel manufacturer exports to the EU. The PED requires CE marking and a Declaration of Conformity before placing on the market. During an audit, the Notified Body discovers the manufacturer's weld procedures were qualified to an older standard - production halts until procedures are requalified."], reportExcerpts: ["EU-TYPE EXAMINATION - PED 2014/68/EU, Module B | NB 0045\nEquipment: Shell-and-tube heat exchanger, Type HX-450\nPS: 45 bar | V: 200 L | Fluid group: 1 | Category: III\nFINDINGS:\n  Design calculations: Verified per EN 13445-3. Adequate.\n  Welding: WPS references EN ISO 15614-1:2004 - NON-COMPLIANT. Current standard is 2017 revision.\nSTATUS: CERTIFICATE WITHHELD pending WPS requalification."] },
        { name: "PUWER", slug: "puwer", subtitle: "Provision and Use of Work Equipment Regulations", fullName: "PUWER 1998", issuedBy: "UK HSE", governs: "Work equipment safety", details: [], reportRequirements: "", externalLink: "https://www.hse.gov.uk/work-equipment-machinery/puwer.htm", workedExamples: ["Risk assessment threshold: a guillotine in a sheet metal workshop. PUWER Regulation 11 requires that access to dangerous parts be prevented. The risk assessment shows 3 operators use it daily - interlocked guard with trapped key is the minimum acceptable safeguard."], scenarios: ["An inspector examining a packaging line finds that a conveyor guard was removed to clear a jam and not replaced. Under PUWER Regulation 11, the employer must ensure guards are maintained in position. The inspector notes this as a PUWER breach requiring immediate reinstatement."], reportExcerpts: ["Equipment: Semi-automatic case erector, Endoline 221 | Line 3\nFINDINGS:\n  Reg 6 (Inspection): No inspection record following relocation. NON-COMPLIANT.\n  Reg 11 (Dangerous parts): Interlocked guard defeated with cable tie. NON-COMPLIANT.\n  Reg 9 (Training): No retraining after relocation. NON-COMPLIANT.\nACTIONS: Prohibition Notice - machine out of service. Improvement Notice due 2026-03-29."] },
        { name: "ISO 9001", slug: "iso-9001", subtitle: "Quality Management Systems", fullName: "ISO 9001:2015", issuedBy: "ISO", governs: "Quality management systems", details: [], reportRequirements: "", externalLink: "https://www.iso.org/standard/62085.html", workedExamples: ["Process performance metric: a factory targets <2% defect rate. Current 6-month rolling average is 3.4%. ISO 9001 Clause 9.1 requires analysis of this data and evidence of corrective action - the audit checks both the trend data and the CAPA records."], scenarios: ["A manufacturing company's internal audit programme has not covered the purchasing process for 18 months. The external auditor raises this as a minor non-conformity under Clause 9.2: the audit programme must cover all QMS processes within the audit cycle."], reportExcerpts: ["ISO 9001:2015 SURVEILLANCE AUDIT\nMAJOR NC - NCR-2026-001 | Clause 8.4.2 / 8.7:\n  Incoming inspection: 3/10 ABS pellet batches below MFI spec (16.1, 15.8, 17.2 vs. required 18-22 g/10min). All accepted into production with no concession or NCR raised.\n  Corrective action due: 2026-05-10 (90 days)."] },
        { name: "ISO 17025", slug: "iso-17025", subtitle: "Testing and Calibration Laboratories", fullName: "ISO/IEC 17025:2017", issuedBy: "ISO", governs: "Competence of testing and calibration laboratories", details: [], reportRequirements: "", externalLink: "https://www.iso.org/standard/66912.html", workedExamples: ["Measurement uncertainty budget: a calibration lab calculates expanded uncertainty for a 10mm gauge block calibration as U = 0.12\u03BCm (k=2). The customer requires uncertainty below 0.2\u03BCm - the lab's capability is confirmed adequate."], scenarios: ["A testing laboratory discovers that a batch of reference materials has expired. ISO 17025 Clause 6.6 requires that results produced using expired references be reviewed. Potentially affected reports must be identified and clients notified if results may have been compromised."], reportExcerpts: ["Charpy V-notch impact test, EN ISO 148-1:2016\nMaterial: S355J2+N steel plate, Heat No: 84291-T | Test temp: - 20C\nRESULTS:\n  Specimen 1: 47 J | Specimen 2: 52 J | Specimen 3: 44 J\n  Mean: 47.7 J (Requirement: min 27 J at - 20C per EN 10025-2)\nUNCERTAINTY: +/- 2.1 J (k=2, 95% confidence)\nCONFORMITY: PASS (47.7 - 2.1 = 45.6 J > 27 J)."] },
      ],
    },
    {
      id: "report-structure",
      title: "Report Structure",
      icon: "FileText",
      description: "Universal report skeleton with 7 sections",
      data: {
        skeleton: [
          { id: 1, label: "Header / Identification Block", detail: "Report ID, client, site, asset, inspector, dates, standard applied", goodExample: "Report No: PV-2026-0847 | Client: Acme Refining Ltd | Inspector: J. McPherson (API 510 Cert #48291)", badExample: "Report for pressure vessel inspection. Inspector: John." },
          { id: 2, label: "Scope of Work", detail: "What was inspected, methodology used, limitations, areas excluded", goodExample: "Scope: Internal and external visual examination of V-4012 per Written Scheme of Examination WSE-4012-R3.", badExample: "We inspected the vessel as requested." },
          { id: 3, label: "Findings / Observations", detail: "Individual findings with location, description, severity, evidence", goodExample: "Finding F-003: Localised external pitting at 6 o'clock position, 200mm above bottom tangent line. Max pit depth 2.1mm.", badExample: "Some corrosion found on the bottom of the vessel." },
          { id: 4, label: "Classification / Grading", detail: "Severity ratings per applicable standard's classification system", goodExample: "Overall condition Grade B (Acceptable - minor deterioration noted).", badExample: "Vessel condition: OK." },
          { id: 5, label: "Recommendations", detail: "Prioritised actions with timeframes and responsible parties", goodExample: "R-001 (Priority: High, Due: Before restart): Repair weld overlay on area F-004.", badExample: "Recommend repairs to the corroded areas." },
          { id: 6, label: "Conclusions", detail: "Overall assessment, fitness for continued service, next inspection date", goodExample: "V-4012 is fit for continued service at current MAWP of 15 bar. Next internal examination due: 2029-02.", badExample: "Vessel can continue to be used. Next inspection in a few years." },
          { id: 7, label: "Appendices", detail: "Photos, diagrams, measurement data, calibration certificates", goodExample: "Appendix A: UT thickness data (24 TMLs, tabulated). Appendix B: Photographic record (18 photos, geo-tagged).", badExample: "Photos attached." },
        ],
        classificationSystems: [],
        variations: [],
        goodVsBad: null,
        digitalTransition: "",
        aiValue: [],
      },
    },
    {
      id: "success-questions",
      title: "Success Questions",
      icon: "HelpCircle",
      description: "5 question groups for deployment conversations",
      data: [
        { id: "discovery", name: "Discovery & Scoping", icon: "Search", questions: ["How many inspectors do you have across all locations?", "What inspection types make up the majority of your workload?", "What does your current report writing workflow look like?", "How long does a typical report take from inspection to issuance?"] },
        { id: "pain-points", name: "Pain Points & Priorities", icon: "AlertTriangle", questions: ["What is your biggest bottleneck in the inspection cycle?", "Where do you see the most inconsistency in report quality?", "How often do late reports create compliance or contractual issues?", "What would be the impact of cutting report turnaround time in half?"] },
        { id: "technical-fit", name: "Technical Fit & Integration", icon: "Puzzle", questions: ["What CMMS/EAM systems are you running?", "Do you have API access to your current inspection platform?", "What are your data residency requirements?", "Do inspectors have reliable connectivity on site?"] },
        { id: "commercial", name: "Commercial & Decision-Making", icon: "DollarSign", questions: ["What does your procurement process look like for new tools?", "Who needs to sign off on a pilot? On a full deployment?", "What budget cycle are you in right now?", "Have you evaluated other inspection automation tools?"] },
        { id: "deployment", name: "Deployment & Change Management", icon: "Rocket", questions: ["How do you typically roll out new tools to your inspection teams?", "What has worked well in past technology deployments?", "What has failed in past technology deployments?", "Who are your internal champions for this kind of change?"] },
      ],
    },
    {
      id: "client-types",
      title: "Client Segmentation",
      icon: "Users",
      description: "Client types by scale, inspection workflow, and geography",
      data: {
        insights: [
          { name: "Enterprise TIC (top 10 companies)", points: ["Long sales cycles (3-6 months)", "Multiple divisions = multiple entry points", "Internal politics: digital transformation champion needed", "Regulatory compliance is non-negotiable", "Language and localisation: 100% before deployment"] },
          { name: "Protocol-Driven vs Flexible Inspection Workflows", points: ["Protocol-driven: must mirror exact sequence or slower than paper", "Flexible: more discretion, easier to adapt to digital tools"] },
        ],
        categories: [
          { name: "By Scale", types: [
            { name: "Enterprise (top 10 TIC, 1000+ inspectors)", points: ["Examples: Bureau Veritas, SGS, Intertek, TUV SUD", "Typical contract: 150k-500k+ annual", "Deployment method: Phased rollout or hybrid"] },
            { name: "Mid-Market (regional TIC, 100-1000 inspectors)", points: ["Typical contract: 50k-150k annual", "Deployment method: Remote or hybrid", "Key risk: Budget constraints, single decision-maker"] },
          ]},
          { name: "By Inspection Type", types: [
            { name: "Protocol-Driven (ISO, regulatory-mandated sequences)", points: ["Sectors: Automotive, aerospace, nuclear, pharma", "Deployment rule: On-site observation BEFORE template configuration", "Adoption killer: Extra steps, wrong sequence"] },
            { name: "Flexible (inspector discretion, varied formats)", points: ["Sectors: Construction, consumer products, general industrial", "Remote configuration can work if mobile UI is clean", "Adoption driver: Mobile convenience, photo-to-report automation"] },
          ]},
          { name: "By Geography", types: [
            { name: "UK", points: ["English language default", "Strong TIC presence", "Regulatory: UKAS, HSE, Building Safety Act"] },
            { name: "DACH (Germany, Austria, Switzerland)", points: ["German language MANDATORY", "TUV brands dominate", "Thoroughness valued over speed"] },
            { name: "Global (multi-country)", points: ["Multi-language support critical", "Phased by geography: prove in one country, replicate"] },
          ]},
        ],
      },
    },
    {
      id: "scope-product",
      title: "Scope Product",
      icon: "Zap",
      description: "Capabilities, metrics, competitive landscape",
      data: {
        description: "AI-powered inspection automation. Bespoke data layers per client.",
        capabilities: [
          { name: "Report Generation", slug: "report-generation", features: ["AI-generated inspection reports from captured data", "Error-free output with human review step"], maturity: "Live" },
          { name: "Data Normalisation", slug: "data-normalisation", features: ["Standardise inconsistent data across teams and regions", "Map legacy formats to unified schema"], maturity: "Live" },
          { name: "Anomaly Detection", slug: "anomaly-detection", features: ["Flag outlier readings and unusual patterns", "Historical trending against asset baseline"], maturity: "Live" },
          { name: "Compliance Dashboards", slug: "compliance-dashboards", features: ["Real-time compliance status across portfolio", "Automated alerts for overdue inspections"], maturity: "Beta" },
          { name: "Mobile Data Capture", slug: "mobile-data-capture", features: ["Offline-capable mobile app for field inspectors", "Photo capture with automatic metadata tagging"], maturity: "Live" },
          { name: "Template Engine", slug: "template-engine", features: ["Bespoke report templates per inspection type and client", "Configurable fields, validation rules, and output formats"], maturity: "Live" },
          { name: "Integration Layer", slug: "integration-layer", features: ["API-first architecture for CMMS/EAM/ERP integration", "Data import/export in standard formats"], maturity: "Beta" },
          { name: "Knowledge Retention", slug: "knowledge-retention", features: ["Capture institutional knowledge from experienced inspectors", "AI learns from corrections and approvals over time"], maturity: "Planned" },
        ],
        heroMetrics: { totalActiveUsers: 65, avgAdoptionRate: 62, productMaturity: "Growth" },
        metrics: [{ metric: "Cycle time reduction", value: "45%" }, { metric: "YoY revenue growth", value: "8x" }],
        revenue: "Enterprise SaaS with per-inspector pricing",
        companyFacts: [],
        moat: "Depth of per-client customisation. Custom workflow mapping per enterprise client.",
        competitors: [{ name: "Checkfirst", focus: "Digital checklists" }, { name: "SafetyCulture", focus: "Mobile inspection forms" }, { name: "Lumiform", focus: "Templates" }],
        coreTension: "Each deployment requires bespoke work that does not scale linearly with headcount.",
      },
    },
  ],
};

export const FALLBACK_CLIENT = null;

export const FALLBACK_TEMPLATES = { templates: [], patterns: null };
