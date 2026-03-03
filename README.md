# DS-OS — Deployment Strategy Operating System

A system that runs the full lifecycle of enterprise deployments: from first contact through live implementation, issue resolution, and expansion. Every deployment compounds intelligence. The second client onboards with one deployment's learnings. The fifth starts with four.

---

## Commands

### Setup
| Command | What It Does |
|---------|-------------|
| `/Friday_Context` | Trial day entry point. Capture situation, load knowledge, set awareness |
| `/Tool_Setup` | Capture product mechanics from hands-on use. Re-runnable |

### Templating
| Command | What It Does |
|---------|-------------|
| `/Template_Spec` | Inspection type + context → structured template specification |
| `/Report_Map` | Analyse a customer's existing report. Map its structure |
| `/Template_QA` | Quality check a template spec against the knowledge base |
| `/Pattern_Check` | Scan the template library for overlaps and reusable elements |

### Strategy
| Command | What It Does |
|---------|-------------|
| `/Start` | Entry point. Three modes: new client, existing update, or problem |
| `/Client_Intel` | Deep company research and intelligence profile |
| `/Constraint_Map` | User mapping, solutions audit, product-fit analysis |
| `/Deploy_Plan` | Full deployment plan from all prior context + playbook precedents |
| `/Log_Issue` | Problem intake with classification and severity |
| `/Resolve` | Cross-client pattern scan + past solutions + action plan |
| `/Update_Playbook` | Compound learnings into the playbook after resolution |
| `/Status` | Pull up any client's current state (read-only) |

### System
| Command | What It Does |
|---------|-------------|
| `/Pivot` | Universal method or rule change. Shows diff before applying |
| `/System_Review` | Architecture audit. Compare actual state vs documented |
| `/Explore` | Investigation mode. Analyse without implementing |

### Anytime
| Command | What It Does |
|---------|-------------|
| `/Ask_Right` | Generate domain-specific questions for any audience or topic |

---

## Workflows

**Trial day:**
`/Friday_Context` → `/Tool_Setup` → `/Template_Spec` → `/Template_QA` → `/Pattern_Check`

**New client:**
`/Start` → `/Client_Intel` → `/Constraint_Map` → `/Deploy_Plan`

**Problem resolution:**
`/Start` → `/Log_Issue` → `/Resolve` → `/Update_Playbook`

**Expansion or update:**
`/Start` → relevant command based on what changed

**System change:**
`/Pivot` for method changes | `/System_Review` for architecture audit

Steps cannot be skipped. Each command reads prior outputs before producing its own. Customisation lives inside each step, not across the process.

---

## How Intelligence Compounds

Every resolved issue feeds the playbook. Every template built surfaces reusable patterns. `/Resolve` scans all prior clients before proposing a solution. `/Pattern_Check` identifies what's repeatable across templates so human judgment focuses only on what's genuinely custom.

By the tenth deployment, the system carries nine deployments of proven patterns, resolution precedents, and validated methods. The bespoke layer shrinks. The velocity increases. Nothing stays in someone's head.

---

## Data Model

All state lives in markdown files. No external database. Files are the database.

```
/data/
├── clients/          One file per client (single source of truth)
├── knowledge/        Industry knowledge (reference, not state)
├── friday/           Trial day infrastructure and logs
├── templates/        Template specifications (one per file, indexed)
├── playbook/         Patterns, resolution history, client segmentation
└── system/           Method registry, system log, architecture
```

Client files follow a fixed schema: profile, commercial, deployment state, constraint map, deployment plan, issue log, interaction history, stakeholder map, playbook contributions.

The playbook is institutional memory — deployment patterns by client type, resolution patterns by issue type, success rates per method.
