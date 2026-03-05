# FRIDAY CHEATSHEET
### Scope AI Trial Day — Quick Reference

---

## BEFORE YOU WALK IN

```
/Friday_Context
```
Captures: who you're meeting, setting, agenda, vibe, key asks.
Loads: all industry knowledge. Gives you a brief + smart opening questions.

---

## WHEN YOU GET HANDS-ON WITH THE PRODUCT

```
/Tool_Setup
```
Describe what you see → system structures it into Layer 2 knowledge.
Re-runnable. Each run adds more. Flags gaps between claims and reality.

---

## CORE WORK COMMANDS

| When | Command | What It Does |
|------|---------|-------------|
| They want a template built | `/Template_Spec` | Inspection type + context → full structured spec |
| They show you an existing report | `/Report_Map` | Reverse-engineers report structure, maps gaps, feeds into Template_Spec |
| You've built a spec | `/Template_QA` | Quality check: fields, classification, structure, standard compliance |
| Spec is QA'd, want output | `/Template_Generate` | Generates PPTX + PDF reports from spec. Viewable in frontend |
| You have 2+ templates | `/Pattern_Check` | Scans for overlaps = scalability signal |

---

## ANYTIME

```
/Ask_Right
```
Generates 5-8 domain-specific questions for whoever you're talking to.
Works for inspectors, supervisors, compliance leads, CTOs.
Run it before any conversation.

---

## STRATEGY (IF NEEDED)

| When | Command |
|------|---------|
| New client discussion | `/Start` → `/Client_Intel` → `/Constraint_Map` → `/Deploy_Plan` |
| Problem comes up | `/Log_Issue` → `/Resolve` |
| They ask about other clients | `/Status` (read-only) |

---

## QUICK KNOWLEDGE REFERENCE

### Inspection Types (6)
1. **Pressure Vessel** — API 510, thickness trending, remaining life. Data-heavy
2. **Lifting Equipment** — LOLER, 6/12-month intervals. Highest volume
3. **Electrical** — BS 7671, C1/C2/C3/FI codes. Most tabular
4. **NDT** — 5 methods (UT, RT, MPI, DPT, ECT). Most technically dense
5. **Factory Audit** — ISO 9001, Major/Minor NC. Process-based
6. **Fire Safety** — RRFSO, risk matrices. Most qualitative

### Key Standards
| Standard | Domain | Key Fact |
|----------|--------|----------|
| API 510 | Pressure vessels | Remaining life = (t_actual − t_min) ÷ corrosion rate |
| LOLER | Lifting equipment | 6 months for persons/accessories, 12 months otherwise |
| BS 7671 | Electrical | C1/C2 = Unsatisfactory. C3 = advisory only |
| ISO 17020 | Inspection bodies | Type A (independent), B (in-house), C (related) |
| PED | Pressure equipment | Categories I-IV by risk. Notified Body for III-IV |
| ISO 9001 | Quality systems | Major NC prevents certification. Minor must be fixed |

### Scope AI Key Numbers
- 45% inspection cycle time reduction (claim)
- 12 min average reporting time
- 7 of top 10 TIC companies
- £10M ARR target 2026
- ~15 person team

---

## WHAT TO DEMONSTRATE

**If they care about speed:** Mobile capture → auto-report. "12 minutes vs your current time"

**If they care about compliance:** Auto-checks against standards. Classification consistency. Regulatory format output

**If they care about scale:** Pattern Check output. "X% of template work is repeatable. The bespoke layer is [specific areas]"

**If they care about risk:** Anomaly detection. Historical trending. "Catches what human review misses at scale"

---

## FILES YOU NEED TO KNOW

| File | What | When |
|------|------|------|
| `/data/knowledge/scope_product.md` | Scope features, claims, moat | If asked about the product |
| `/data/knowledge/inspection_types.md` | All 6 types in detail | If discussing specific inspection types |
| `/data/knowledge/regulatory_standards.md` | All 8 standards | If standards come up |
| `/data/knowledge/report_anatomy.md` | Report structures, good vs bad | If discussing reports |
| `/data/friday/tool_capture.md` | Scope's actual product mechanics | After `/Tool_Setup` |
| `/data/friday/trial_log.md` | Running log of the day | Review at end of day |
| `/data/templates/_template_index.md` | All template specs | Track what you've built |

---

## END OF DAY

1. Review `/data/friday/trial_log.md` for completeness
2. Run `/Pattern_Check` if you built 2+ templates
3. Note any follow-up actions needed
4. Update any client files if relevant
