# Resolution Patterns
# Scope AI — DS-OS
# Last Updated: 2026-02-20

Proven solutions to recurring issue types. Every resolved issue feeds back here.

---

## Adoption Blockers

### Mobile UI Friction
- **Source:** Bureau Veritas ISSUE-002 | 2026-01-12
- **Category:** Adoption blocker
- **Root cause:** Mobile workflow requires more taps/steps than inspector's current method
- **Resolution that works:** Identify the specific friction point (usually capture-to-attach flow). Work with product to reduce taps. "Quick capture" mode at BV: one tap to photo, auto-attach to current inspection point
- **Resolution that failed:** N/A (first instance)
- **Conditions:** Any deployment with field inspectors on mobile devices
- **Confidence:** High
- **Prevention:** Test upload/capture flow with real inspectors pre-deployment. Measure taps vs current method

### Template Configuration Mismatch
- **Source:** TÜV SÜD ISSUE-001 (pending resolution) | 2026-01-15
- **Category:** Adoption blocker
- **Root cause:** Digital inspection flow doesn't match the sequence inspectors use on paper/muscle memory. Configured from documentation, not observation
- **Resolution that works:** TBD — recommended: on-site observation sprint, reconfigure to match actual workflow
- **Resolution that failed:** Remote reconfiguration from documentation (same approach that caused the problem)
- **Conditions:** Protocol-driven clients with standardised inspection sequences (ISO, regulatory)
- **Confidence:** Medium (single instance, clear causal chain)
- **Prevention:** On-site workflow observation BEFORE template configuration for protocol-driven clients

---

## Integration Failures

### Data Format Inconsistency
- **Source:** Bureau Veritas ISSUE-001 | 2025-12-18
- **Category:** Integration failure
- **Root cause:** Multiple template variants across the client organisation. No central standard. Normalisation engine couldn't auto-map
- **Resolution that works:** Template normalisation layer: map all variants to canonical schema. Create "template intake" step in onboarding
- **Conditions:** Any client with established inspection practices (100% of enterprise clients)
- **Confidence:** High
- **Prevention:** Template audit in onboarding checklist. Collect ALL existing templates before configuration

### Localisation Incomplete
- **Source:** TÜV SÜD ISSUE-002 | 2025-11-15
- **Category:** Integration failure
- **Root cause:** Localisation was 85% complete at deployment. Remaining 15% in error messages, edge cases, help docs
- **Resolution that works:** Full localisation sprint before deployment. Test every UI state, not just primary flows
- **Conditions:** Any non-English market deployment
- **Confidence:** High
- **Prevention:** 100% localisation verification before go-live. Add to deployment checklist

---

## Commercial Risks

*No resolved patterns yet. TÜV SÜD ISSUE-001 may contribute to this category if adoption recovery fails and contract renewal is at risk.*

---

## Feature Gaps

*CMMS integration (Bureau Veritas ISSUE-003) and KBA report format (TÜV SÜD) are open feature gaps. No resolution patterns yet — these require product development, not DS intervention.*
