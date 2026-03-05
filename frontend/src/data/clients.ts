export interface ClientData {
  name: string;
  slug: string;
  stage: string;
  health: string;
  contract: string;
  sector: string;
  size: string;
  inspectionTypes: string;
  geography: string;
  source: string;
  dateCreated: string;
  contractStatus: string;
  contractValue: string;
  term: string;
  renewal: string;
  economicBuyer: string;
  expansionPotential: string;
  features: { live: string[]; configured: string[]; planned: string[] };
  usersActive: number | null;
  usersTotal: number | null;
  adoption: number | null;
  baselineImprovement: string;
  constraintMap: {
    users: { type: string; count: number; painPoint: string; adoptionSignal: string }[];
    tools: { name: string; friction: string; severity: string }[];
    productMatch: { need: string; capability: string; fit: string; priority: string }[];
    wedge: string;
  };
  deploymentPlan: {
    method: string;
    rationale: string;
    phases: { name: string; status: string; duration: string; features: string[] }[];
    risks: { risk: string; likelihood: string; impact: string; mitigation: string; status: string }[];
  };
  issues: {
    id: string;
    title: string;
    severity: string;
    status: string;
    date: string;
    description: string;
    rootCause: string;
    resolution: string;
    crossClientScan: string;
    playbookUpdate: string;
  }[];
  interactions: { date: string; source: string; summary: string }[];
  stakeholders: {
    name: string;
    role: string;
    priority: string;
    trustLevel: number;
    commStyle: string;
    notes: string;
  }[];
}

export const clientsData: Record<string, ClientData> = {
  "bureau-veritas": {
    name: "Bureau Veritas",
    slug: "bureau-veritas",
    stage: "Phase 2",
    health: "green",
    contract: "£250k",
    sector: "Construction & Infrastructure",
    size: "80,000+ employees globally",
    inspectionTypes: "Building safety, structural integrity, fire compliance",
    geography: "UK (primary), expanding to France",
    source: "Inbound - conference demo",
    dateCreated: "Sep 2025",
    contractStatus: "Active",
    contractValue: "£250,000",
    term: "18 months",
    renewal: "Mar 2027",
    economicBuyer: "Marc Durand (VP Digital Transformation)",
    expansionPotential: "High - France rollout, marine division interest",
    features: {
      live: ["Mobile capture", "Report generation", "Template engine"],
      configured: ["Compliance dashboard", "Analytics"],
      planned: ["API integrations", "Custom workflows"],
    },
    usersActive: 49,
    usersTotal: 56,
    adoption: 84,
    baselineImprovement: "37% report turnaround reduction",
    constraintMap: {
      users: [
        { type: "Field Inspector", count: 42, painPoint: "Paper forms slow, error-prone", adoptionSignal: "High - daily use" },
        { type: "Supervisor", count: 8, painPoint: "No real-time visibility", adoptionSignal: "Medium - weekly review" },
        { type: "Compliance Manager", count: 4, painPoint: "Manual report compilation", adoptionSignal: "High - dashboard daily" },
        { type: "Admin", count: 2, painPoint: "User management overhead", adoptionSignal: "Low - monthly" },
      ],
      tools: [
        { name: "Paper forms + Excel", friction: "No real-time data, transcription errors", severity: "High" },
        { name: "Legacy inspection app", friction: "Outdated UI, no offline mode", severity: "Medium" },
        { name: "Email for approvals", friction: "Delays, lost in thread", severity: "High" },
      ],
      productMatch: [
        { need: "Mobile data capture", capability: "Scope mobile app", fit: "Strong", priority: "P1" },
        { need: "Automated reports", capability: "Report engine", fit: "Strong", priority: "P1" },
        { need: "Real-time dashboards", capability: "Analytics suite", fit: "Partial", priority: "P2" },
        { need: "Compliance tracking", capability: "Compliance module", fit: "Strong", priority: "P1" },
      ],
      wedge: "Mobile capture replacing paper forms - immediate productivity gain visible to all stakeholders",
    },
    deploymentPlan: {
      method: "Phased Rollout",
      rationale: "Enterprise scale requires controlled expansion. Prove value with pilot team before wider rollout.",
      phases: [
        { name: "Phase 1", status: "complete", duration: "6 weeks", features: ["Mobile capture", "Basic reporting", "10 pilot users"] },
        { name: "Phase 2", status: "in-progress", duration: "8 weeks", features: ["Full reporting", "Template engine", "Compliance dashboard", "56 users"] },
        { name: "Phase 3", status: "planned", duration: "12 weeks", features: ["API integrations", "France expansion", "Custom workflows", "200+ users"] },
      ],
      risks: [
        { risk: "Change resistance in field teams", likelihood: "Medium", impact: "High", mitigation: "Supervisor champions + incentives", status: "Mitigated" },
        { risk: "Network connectivity on-site", likelihood: "High", impact: "Medium", mitigation: "Offline-first architecture", status: "Resolved" },
        { risk: "Template complexity", likelihood: "Low", impact: "Medium", mitigation: "Template design workshops", status: "Monitoring" },
      ],
    },
    issues: [
      { id: "ISSUE-001", title: "Photo upload timeout on large files", severity: "degrading", status: "Resolved", date: "Jan 12, 2026", description: "Users experiencing timeouts when uploading high-res inspection photos over 10MB.", rootCause: "No client-side compression before upload.", resolution: "Implemented automatic image compression to 2MB max before upload.", crossClientScan: "Not reported elsewhere.", playbookUpdate: "Added to mobile optimization checklist." },
      { id: "ISSUE-002", title: "Quick capture mode missing", severity: "blocking", status: "Resolved", date: "Jan 20, 2026", description: "Field inspectors need rapid-fire photo mode for documenting multiple defects quickly.", rootCause: "Initial design focused on detailed single-capture workflow.", resolution: "Shipped quick capture mode with batch upload and auto-tagging.", crossClientScan: "TÜV SÜD also reported similar need.", playbookUpdate: "Mobile UI friction = #1 adoption blocker pattern confirmed." },
      { id: "ISSUE-003", title: "Compliance dashboard data lag", severity: "minor", status: "Open", date: "Feb 15, 2026", description: "Dashboard shows data up to 4 hours behind real-time.", rootCause: "Batch processing pipeline runs every 4 hours.", resolution: "", crossClientScan: "N/A", playbookUpdate: "" },
    ],
    interactions: [
      { date: "Feb 24, 2026", source: "Call", summary: "Weekly check-in with Sophie Laurent. Phase 2 rollout on track. Compliance dashboard demo scheduled for next week." },
      { date: "Feb 20, 2026", source: "Email", summary: "Marc Durand inquired about France expansion timeline. Sent Phase 3 proposal draft." },
      { date: "Feb 15, 2026", source: "Support", summary: "ISSUE-003 logged: compliance dashboard data lag reported by compliance team." },
      { date: "Feb 10, 2026", source: "On-site", summary: "Template design workshop with 8 supervisors. Refined 12 inspection templates." },
      { date: "Jan 20, 2026", source: "Call", summary: "Escalation call re: quick capture mode. Resolved within 48 hours." },
      { date: "Jan 12, 2026", source: "Support", summary: "Photo upload timeout reported. Fix shipped same day." },
    ],
    stakeholders: [
      { name: "Marc Durand", role: "VP Digital Transformation", priority: "Critical", trustLevel: 4, commStyle: "Executive summary, quarterly face-to-face", notes: "Economic buyer. Focused on ROI metrics and France expansion." },
      { name: "Sophie Laurent", role: "Head of Inspection Operations", priority: "High", trustLevel: 5, commStyle: "Weekly calls, data-driven", notes: "Day-to-day champion. Drives adoption from the top." },
      { name: "Pierre Moreau", role: "IT Director", priority: "Medium", trustLevel: 3, commStyle: "Technical documentation, security reviews", notes: "Gatekeeper for integrations. Needs security compliance docs." },
      { name: "Isabelle Petit", role: "Field Supervisor Lead", priority: "High", trustLevel: 4, commStyle: "In-person demos, hands-on training", notes: "Key influencer among field teams. Early adopter." },
    ],
  },
  "tuv-sud": {
    name: "TÜV SÜD",
    slug: "tuv-sud",
    stage: "Phase 1",
    health: "red",
    contract: "£150k",
    sector: "Industrial Safety & Certification",
    size: "25,000+ employees globally",
    inspectionTypes: "Equipment certification, safety audits, regulatory compliance",
    geography: "Germany (primary), APAC",
    source: "Outbound - targeted campaign",
    dateCreated: "Nov 2025",
    contractStatus: "Active",
    contractValue: "£150,000",
    term: "12 months",
    renewal: "Nov 2026",
    economicBuyer: "Andreas Keller (Director of Digital Services)",
    expansionPotential: "Medium - depends on Phase 1 recovery",
    features: {
      live: ["Mobile capture"],
      configured: ["Template engine"],
      planned: ["Report generation", "Compliance dashboard"],
    },
    usersActive: 10,
    usersTotal: 26,
    adoption: 40,
    baselineImprovement: "18% (below target)",
    constraintMap: {
      users: [
        { type: "Certification Auditor", count: 18, painPoint: "Rigid protocol requirements", adoptionSignal: "Low - resistance to change" },
        { type: "Team Lead", count: 5, painPoint: "Audit scheduling complexity", adoptionSignal: "Medium - sees value" },
        { type: "Compliance Officer", count: 3, painPoint: "Report standardization", adoptionSignal: "Low - waiting for templates" },
      ],
      tools: [
        { name: "SAP-based audit system", friction: "Deeply integrated, hard to replace", severity: "High" },
        { name: "Custom checklist PDFs", friction: "Standardized but inflexible", severity: "Medium" },
      ],
      productMatch: [
        { need: "Protocol-compliant capture", capability: "Template engine", fit: "Partial", priority: "P1" },
        { need: "SAP integration", capability: "API layer", fit: "Gap", priority: "P1" },
        { need: "Audit trail", capability: "Compliance module", fit: "Strong", priority: "P2" },
      ],
      wedge: "Template engine matching existing protocol checklists - must feel like an upgrade, not a replacement",
    },
    deploymentPlan: {
      method: "Remote Setup (now pivoting to Hybrid)",
      rationale: "Initially chose remote for cost efficiency. Pivoting due to protocol complexity requiring on-site observation.",
      phases: [
        { name: "Phase 1", status: "in-progress", duration: "8 weeks (extended)", features: ["Mobile capture", "Template configuration", "10 pilot users"] },
        { name: "Phase 2", status: "planned", duration: "10 weeks", features: ["Report generation", "Expanded templates", "26 users"] },
        { name: "Phase 3", status: "planned", duration: "TBD", features: ["SAP integration", "Full rollout"] },
      ],
      risks: [
        { risk: "Protocol mismatch with templates", likelihood: "High", impact: "High", mitigation: "On-site observation sprint", status: "Active" },
        { risk: "SAP integration complexity", likelihood: "High", impact: "High", mitigation: "Phased integration approach", status: "Planned" },
        { risk: "Stakeholder patience", likelihood: "High", impact: "Critical", mitigation: "6-week visible progress commitment", status: "Active" },
      ],
    },
    issues: [
      { id: "ISSUE-001", title: "Template configuration doesn't match inspector workflow", severity: "blocking", status: "Open", date: "Jan 28, 2026", description: "Templates configured remotely don't match the actual step-by-step protocol auditors follow on-site.", rootCause: "Remote configuration without observing actual workflow.", resolution: "", crossClientScan: "Bureau Veritas ISSUE-002 had similar mobile UI friction.", playbookUpdate: "Pattern: Remote deployment limitations for protocol-driven clients." },
      { id: "ISSUE-002", title: "Offline sync conflicts", severity: "degrading", status: "Open", date: "Feb 5, 2026", description: "Data conflicts when auditors sync after working offline in factory environments.", rootCause: "Sync logic doesn't handle concurrent edits to same audit.", resolution: "", crossClientScan: "Not reported elsewhere.", playbookUpdate: "" },
    ],
    interactions: [
      { date: "Feb 22, 2026", source: "Call", summary: "Andreas Keller escalation call. Needs visible progress in 6 weeks or contract review triggered." },
      { date: "Feb 15, 2026", source: "Email", summary: "Sent revised deployment plan with on-site sprint proposal." },
      { date: "Feb 5, 2026", source: "Support", summary: "ISSUE-002 logged: offline sync conflicts in factory environment." },
      { date: "Jan 28, 2026", source: "On-site", summary: "Discovery visit: observed template mismatch firsthand. ISSUE-001 logged." },
    ],
    stakeholders: [
      { name: "Andreas Keller", role: "Director of Digital Services", priority: "Critical", trustLevel: 2, commStyle: "Direct, outcome-focused, low patience", notes: "Economic buyer. Losing confidence. Needs visible wins." },
      { name: "Dr. Maria Weber", role: "Head of Certification", priority: "High", trustLevel: 3, commStyle: "Technical, detail-oriented", notes: "Supportive but needs protocol compliance proof." },
      { name: "Thomas Braun", role: "IT Architecture Lead", priority: "Medium", trustLevel: 3, commStyle: "Technical documentation, integration specs", notes: "SAP integration gatekeeper." },
    ],
  },
  "intertek": {
    name: "Intertek",
    slug: "intertek",
    stage: "Intake",
    health: "green",
    contract: "Scoping",
    sector: "Consumer Products Testing",
    size: "46,000+ employees globally",
    inspectionTypes: "Product testing, quality assurance, supply chain audits",
    geography: "UK + Asia",
    source: "Inbound - BD campaign",
    dateCreated: "Feb 2026",
    contractStatus: "Scoping",
    contractValue: "TBD",
    term: "TBD",
    renewal: "TBD",
    economicBuyer: "James Wright (VP Operations, UK)",
    expansionPotential: "High - large org, multiple divisions",
    features: {
      live: [],
      configured: [],
      planned: ["Mobile capture", "Report generation", "Template engine"],
    },
    usersActive: null,
    usersTotal: null,
    adoption: null,
    baselineImprovement: "N/A",
    constraintMap: {
      users: [
        { type: "Product Tester", count: 200, painPoint: "Manual data entry, slow reporting", adoptionSignal: "TBD" },
        { type: "QA Manager", count: 30, painPoint: "No real-time visibility into testing status", adoptionSignal: "TBD" },
      ],
      tools: [
        { name: "SafetyCulture (iAuditor)", friction: "Hitting enterprise limits, limited customization", severity: "High" },
        { name: "Internal LIMS system", friction: "Siloed data, no mobile access", severity: "Medium" },
      ],
      productMatch: [
        { need: "Scalable mobile capture", capability: "Scope mobile app", fit: "Strong", priority: "P1" },
        { need: "Enterprise customization", capability: "Template engine", fit: "Strong", priority: "P1" },
        { need: "LIMS integration", capability: "API layer", fit: "Partial", priority: "P2" },
      ],
      wedge: "Consumer product testing automation - replacing SafetyCulture at enterprise scale",
    },
    deploymentPlan: {
      method: "TBD - likely Hybrid",
      rationale: "Awaiting intake completion. Geographic spread suggests hybrid approach.",
      phases: [
        { name: "Intake", status: "in-progress", duration: "2-4 weeks", features: ["Client intel", "Constraint mapping", "Proposal development"] },
        { name: "Phase 1", status: "planned", duration: "TBD", features: ["TBD"] },
        { name: "Phase 2", status: "planned", duration: "TBD", features: ["TBD"] },
      ],
      risks: [
        { risk: "SafetyCulture migration complexity", likelihood: "Medium", impact: "Medium", mitigation: "Data migration toolkit", status: "Planned" },
        { risk: "Asia timezone coordination", likelihood: "Medium", impact: "Low", mitigation: "Regional deployment leads", status: "Planned" },
      ],
    },
    issues: [],
    interactions: [
      { date: "Feb 24, 2026", source: "Email", summary: "James Wright confirmed March 5 initial meeting." },
      { date: "Feb 20, 2026", source: "Internal", summary: "Client file created from BD campaign lead." },
    ],
    stakeholders: [
      { name: "James Wright", role: "VP Operations, UK", priority: "High", trustLevel: 3, commStyle: "Professional, data-driven", notes: "Initial contact. Interested in SafetyCulture replacement." },
    ],
  },
};
