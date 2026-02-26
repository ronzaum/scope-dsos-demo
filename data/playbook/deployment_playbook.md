# Deployment Playbook
# Scope AI — DS-OS
# Last Updated: 2026-02-20

This is the institutional memory of how deployments work. Every resolved issue and milestone contributes here. The playbook makes each deployment better than the last.

---

## Deployment Methods

### Method 1: Phased Rollout by User Group
- **When to use:** Large enterprise (100+ inspectors), multiple user types, staged adoption preferred
- **How it works:** Start with the user group most likely to adopt (usually supervisors or a small inspector cohort). Prove value with early adopters. Let adoption pull from the bottom up
- **Success rate:** 1/1 deployments (Bureau Veritas — 84% adoption at month 3)
- **Key learning:** Start with 10-15 users, not the full base. Iterate on their feedback before expanding
- **Risk:** Slower initial deployment. Requires patience from exec sponsor
- **Validated by:** Bureau Veritas (construction, UK)

### Method 2: Remote Setup
- **When to use:** Client is tech-savvy, small user base (<30), clear and simple use case, budget-conscious
- **How it works:** Configure templates and features from documentation. Deploy remotely. Support via video calls and async channels
- **Success rate:** 0/1 deployments (TÜV SÜD — 40% adoption, stalled)
- **Key learning:** Remote configuration misses workflow nuances that on-site observation catches. Do NOT use for clients with highly standardised/protocol-driven inspection workflows
- **Risk:** HIGH for protocol-heavy clients. Template misconfiguration is invisible until users reject the tool
- **Validated by:** TÜV SÜD (automotive, UK/Germany) — NEGATIVE outcome
- **Recommendation:** Restrict to clients where inspection workflows are flexible or newly being created. For ISO/regulatory-standardised workflows, use on-site embedding or hybrid

### Method 3: On-Site Embedding
- **When to use:** Complex enterprise workflows, change management critical, high-value contract, protocol-driven inspections
- **How it works:** DS embeds on-site for first 2-4 weeks. Observes actual workflows before configuring. Iterates with real users in real time
- **Success rate:** 0/0 (not yet used — recommended for TÜV SÜD recovery)
- **Key learning:** Theorised based on TÜV SÜD failure analysis. Remote missed what on-site would have caught
- **Risk:** Expensive. Requires DS travel. Not scalable if every client needs it
- **Recommendation:** Reserve for high-value contracts (£150k+) or protocol-driven clients

### Method 4: Hybrid (Remote + On-Site Sprints)
- **When to use:** Geographic spread, budget constraints, but needs critical hands-on moments
- **How it works:** Remote for most configuration. 2-3 on-site sprints at key milestones (kick-off, go-live, adoption review)
- **Success rate:** 0/0 (not yet used)
- **Recommendation:** Good default for mid-value contracts. Balances cost with on-site benefits

---

## Deployment Patterns

### Pattern: Template Normalisation
- **Source:** Bureau Veritas | 2025-12-18
- **Applies when:** Client has multiple existing inspection templates or formats that need to be ingested into Scope
- **Pattern:** Every client with an established inspection practice has template drift: different supervisors, sites, or teams have created their own variants over time. The data normalisation engine can't auto-map without a deliberate mapping step
- **Recommended action:** Add a "template audit" step to onboarding. Collect ALL existing templates before configuration. Map variants to a canonical schema. Build the normalisation rules before deploying to users
- **Confidence:** High (confirmed across Bureau Veritas and TÜV SÜD)

### Pattern: Mobile UI Friction = #1 Adoption Blocker for Field Inspectors
- **Source:** Bureau Veritas | 2026-01-12
- **Applies when:** Deploying to field inspectors who work on mobile devices on-site
- **Pattern:** If the mobile workflow requires more taps/steps than the inspector's current method (even paper), they will revert. Field inspectors optimise for speed on autopilot. Any friction compounds across 4-6 inspections per day
- **Recommended action:** Test the upload/capture flow with REAL inspectors before deployment, not after. Measure taps-to-complete vs their current method. If digital is slower, fix it before go-live
- **Confidence:** High (Bureau Veritas: quick-capture fix drove adoption from stalled to 84%)

### Pattern: Phased User Group Rollout Outperforms Full Launch
- **Source:** Bureau Veritas (positive) + TÜV SÜD (negative counter-example) | 2026-01-20
- **Applies when:** Client has 20+ inspectors
- **Pattern:** Deploying to ALL users simultaneously removes the ability to iterate. Problems surface in week 1-2, but by then every user has formed an opinion. Starting with 10-15 users creates a feedback loop before the majority forms their view
- **Recommended action:** Always start with a pilot cohort of 10-15 users (or fewer for <20 total). Iterate for 2-3 weeks. Fix the first 3 issues. Then expand
- **Confidence:** High (BV: phased worked. TÜV SÜD: full launch contributed to decline)

### Pattern: Supervisor Adoption Creates Inspector Pull
- **Source:** Bureau Veritas | 2026-02-01
- **Applies when:** Deployment includes both inspectors and supervisors
- **Pattern:** When supervisors adopt the tool and start using its outputs (anomaly alerts, compliance views), they naturally pull inspectors toward adoption because the supervisors start expecting digital submissions. Top-down mandates create resistance. Supervisor organic pull creates adoption
- **Recommended action:** Prioritise supervisor value props in Phase 1. If supervisors are saved time, they become the adoption engine for inspectors
- **Confidence:** Medium (single instance, strong signal at BV)

---

## Client Type Insights

### Enterprise TIC (top 10 companies: BV, SGS, Intertek, TÜV SÜD, etc.)
- Long sales cycles (3-6 months from contact to contract)
- Multiple divisions = multiple entry points. Win one division, expand
- Internal politics: digital transformation champion needed. Without one, adoption dies
- Regulatory compliance is non-negotiable. If the tool doesn't match their reporting format, compliance teams won't engage
- Language and localisation: global companies have multi-language workforces. 100% localisation before deployment, not after

### Protocol-Driven vs Flexible Inspection Workflows
- **Protocol-driven** (automotive, aerospace, nuclear): Inspectors follow exact sequences mandated by regulators. Any tool must mirror the exact sequence or it's slower than paper. Remote configuration is dangerous for these clients. On-site observation is essential
- **Flexible** (construction, consumer products): Inspectors have more discretion in how they conduct inspections. Easier to adapt to digital tools. Remote deployment can work if mobile UI is clean

---

## Metrics Benchmarks (from deployed clients)

| Metric | Bureau Veritas (Month 3) | TÜV SÜD (Month 5) | Target |
|--------|-------------------------|-------------------|--------|
| Inspector adoption | 84% | 40% | 85%+ |
| Report turnaround improvement | 37% | 18% | 40%+ |
| Supervisor adoption | 100% | 50% | 90%+ |
| Compliance team engagement | 100% | 0% | 80%+ |
| Issues resolved | 2/3 | 1/2 | All blocking within 2 weeks |
