# System Log
# DS-OS — Scope AI
# Last Updated: 2026-02-20

Timestamped record of all system-level changes, pivots, and reviews.

---

| Date | Type | Description | Affected |
|------|------|-------------|----------|
| 2025-09-10 | INIT | DS-OS initialised. First client: TÜV SÜD | System |
| 2025-11-15 | INIT | Second client onboarded: Bureau Veritas | System |
| 2025-11-15 | RULE | Added R-003: 100% localisation before deployment | Method registry |
| 2025-12-18 | PLAYBOOK | "Template normalisation" pattern added | deployment_playbook.md |
| 2025-12-18 | RULE | Added R-004: template audit in onboarding | Method registry |
| 2026-01-12 | PLAYBOOK | "Mobile UI friction" pattern added | resolution_patterns.md |
| 2026-01-15 | PIVOT | Restricted M-002 (remote setup) for protocol-driven clients. Evidence: TÜV SÜD adoption failure | Method registry, all future deployments |
| 2026-01-15 | PIVOT | Added R-001: pilot before full launch. Evidence: TÜV SÜD full-launch contributed to adoption decline | Method registry, all future deployments |
| 2026-01-20 | PIVOT | Added R-002: on-site observation for protocol clients. Evidence: TÜV SÜD template misconfiguration from remote config | Method registry, all future deployments |
| 2026-01-20 | PLAYBOOK | "Phased rollout outperforms full launch" pattern added | deployment_playbook.md |
| 2026-01-20 | PLAYBOOK | "Supervisor adoption creates inspector pull" pattern added | deployment_playbook.md |
| 2026-02-01 | PLAYBOOK | Client type definitions updated: protocol-driven vs flexible distinction formalised | client_type_definitions.md |
| 2026-02-20 | INIT | Third client intake: Intertek | System |
| 2026-02-20 | REVIEW | Playbook contains 4 deployment patterns, 4 resolution patterns, 4 operational rules. Portfolio: 3 clients (1 active-healthy, 1 active-at-risk, 1 intake) | System |
