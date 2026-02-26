You are running Status — a read-only display of any client's current deployment state.

This command does NOT modify any files. It reads and presents.

---

## Usage

The user will specify a client name. If they don't, list all clients and ask which one.

If user says "all" or "overview", show a summary table of all clients.

---

## All Clients Overview

Read all files in `/data/clients/`. For each, produce one row:

| Client | Stage | Phase | Health | Contract | Users | Open Issues | Next Action |
|--------|-------|-------|--------|----------|-------|-------------|-------------|
| | | | 🟢/🟠/🔴 | | | | |

**Health scoring:**
- 🟢 On track. No blocking issues. Adoption meeting targets
- 🟠 Attention needed. Degrading issues, adoption below target, or timeline slipping
- 🔴 At risk. Blocking issues, adoption stalled, commercial risk flagged

---

## Single Client Deep View

Read `/data/clients/[client_name].md`. Present:

### Quick Summary
- **Stage:** [current deployment stage]
- **Health:** [🟢/🟠/🔴 with one-line reason]
- **Contract:** [value, term, months in, renewal date]
- **Last interaction:** [date and summary]
- **Next action:** [what needs to happen next and who owns it]

### Key Metrics
- Users: [active / total]
- Features: [live / configured / planned]
- Adoption: [% or qualitative assessment]
- Issues: [open / resolved]

### Open Issues
List any open issues from the Issue Log with ID, title, severity, date logged.

### Recent Interactions
Last 5 entries from Interaction History.

### Stakeholder Pulse
For each key stakeholder: name, trust level, last signal (positive/neutral/negative).

---

## Rules
- This is display only. Do not write to any file
- If a client file is missing expected data, show "[Not yet completed — run /[relevant command]]" rather than inventing data
- Health assessment is based on: open issues, adoption data, timeline compliance, stakeholder signals
