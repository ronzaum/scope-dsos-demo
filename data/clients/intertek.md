# Intertek

## Profile
- **Sector:** Testing, Inspection, Certification (TIC). Third-largest globally
- **Size:** 44,000+ employees, ~8,000 inspectors, operations in 100+ countries
- **Inspection types:** Consumer goods testing, building & construction, energy & utilities, chemicals & pharma, government & trade
- **Geography:** HQ in London. UK operations large. Initial conversation focused on consumer goods testing (UK + Asia)
- **Source:** Inbound — BD outreach. Responded to targeted email campaign referencing BV deployment results
- **Initial contact:** James Wright, Director of Innovation, Consumer Products Division
- **Date created:** 2026-02-20

## Commercial
- **Contract status:** Scoping
- **Estimated value:** £180,000 annual (consumer products pilot). Expansion potential £500k+ if cross-divisional
- **Timeline:** Aiming for pilot start Q2 2026
- **Economic buyer:** TBD — likely VP Operations or Divisional MD
- **Success criteria:** TBD — to be defined in first workshop
- **Expansion potential:** Consumer products → building & construction → energy (three divisions with overlapping inspection logic)

## Deployment State
- **Stage:** Intake
- **Phase:** Pre-deployment
- **Features:** None
- **Users:** TBD — estimated 200+ inspectors in consumer products division alone
- **Adoption:** N/A

## Constraint Map
*Not yet completed. Run /Constraint_Map after /Client_Intel.*

## Deployment Plan
*Not yet created. Run /Deploy_Plan after /Constraint_Map.*

## Issue Log

### ISSUE-001 | Users not trusting AI-generated documentation
- **Status:** In Progress
- **Logged:** 2026-02-26
- **Source:** Usage data (spotted 2026-02-25)
- **Category:** Adoption blocker
- **Severity:** 🟠 Degrading
- **Affected users:** Inspectors (all user types — pattern observed across the board)
- **Description:** Users are not consistently reusing the automated documentation outputs. Root cause is lack of trust in AI-generated results — inspectors don't believe the AI outputs are accurate or reliable enough to submit without manual rework, leading to inconsistent adoption and reversion to manual processes.
- **Resolution date:** 2026-02-26 (plan created — execution pending deployment)
- **Cross-client scan:** TÜV SÜD ISSUE-001 shows trust erosion when outputs don't match expectations (40% adoption, declining). BV avoided this through phased rollout + supervisor validation layer. No exact precedent for pure AI output trust — this is a novel pattern for the portfolio.
- **Root cause:** AI documentation presented as finished output with no verification mechanism. In regulated industries, inspectors carry personal liability for submitted documentation. Without ability to verify AI accuracy against their domain knowledge, trust defaults to zero. First impressions are sticky — early distrust is hard to reverse (TÜV SÜD lesson).
- **Resolution:** Preventive approach for Intertek deployment: (1) Build "review and approve" mode — AI outputs are drafts, not finals. Inspectors review, edit, approve. (2) Champion-led validation cohort of 3-5 trusted inspectors goes first for 2 weeks. (3) Champions share accuracy findings as social proof before wider rollout. (4) Only expand after documented >95% accuracy match rate. (5) Present trust-building approach to James Wright at March 5 meeting.
- **Prevention:** Add "AI Output Trust Protocol" to deployment playbook — never present AI documentation as finished output on day one. Start with human-in-the-loop review mode. Graduate to automated only after measured accuracy thresholds.
- **Playbook update needed:** Yes — novel pattern. Run /Update_Playbook to add "AI Output Trust Protocol"

## Interaction History
| Date | Source | Summary |
|------|--------|---------|
| 2026-02-20 | BD outreach | Client file created. James Wright responded to email campaign. Interested in AI inspection for consumer products testing. Currently using SafetyCulture for basic checklists but hitting limits at enterprise scale |
| 2026-02-22 | Email | James confirmed first meeting for March 5. Wants to understand: (1) how Scope handles bespoke testing protocols, (2) what BV deployment looked like, (3) integration with their LIMS (Laboratory Information Management System) |
| 2026-02-25 | Internal | Pre-meeting prep. Key angle: SafetyCulture replacement positioned as "from checklists to intelligence." Consumer products testing has high volume, standardised protocols — good fit for rapid deployment |
| 2026-02-26 | Log_Issue | ISSUE-001 logged: Users not trusting AI-generated documentation. Severity: Degrading |
| 2026-02-26 | Resolve | ISSUE-001 resolved (preventive plan). Root cause: no verification mechanism for AI outputs in regulated context. Action: human-in-the-loop review mode + champion-led validation cohort before wider rollout. Playbook update: yes — novel "AI Output Trust Protocol" pattern |

## Stakeholder Map
| Name | Role | Priority | Communication Style | Trust Level | Notes |
|------|------|----------|-------------------|-------------|-------|
| James Wright | Director of Innovation, Consumer Products | Primary — initial contact | Enthusiastic about tech, asks detailed product questions, wants to see demos not decks | New | Responded to BV case study reference. Seems motivated to modernise but needs to build internal case |

## Playbook Contributions
No contributions yet.
