# Frontend Requirements

## Principle

Read-only reference layer. Not editable through the UI. All writes happen through Claude Code slash commands. The frontend surfaces what the system knows — live, always current, queryable.

## Why build this

Not for the sake of building. Clear benefits:

- **Visibility across all users and roles** — DS, FDE, AE, Leadership all see what they need without asking
- **Live deployment pulls** — no "what's the status of X?" conversations. It's always there
- **Pattern matching at a glance** — which deployments are healthy, which are at risk, what's working across clients
- **Internal tool** — built for the team operating deployments, not for clients

---

## Core Features

### 1. Client State Dashboard
Current stage per client. Deployment status categories:
- Successful
- In progress
- Not started
- Waitlist
- Not successful

Colour coding: green (healthy), orange (needs attention), red (blocked or failing).

### 2. Deployment Stats
- Count of deployments by status
- Success rates
- Average onboarding time
- Patterns emerging across deployments

### 3. Natural Language Querying
Ask questions in plain text, get answers from the data:
- "Show me all clients above 60% adoption"
- "Which deployments had issues this month?"
- "Pull up the latest templates"
- "Give me Bureau Veritas's current state"
- "What resolution patterns have we used more than twice?"

This is the database query layer — the data already exists in markdown, the API already serves it, this just adds a text interface on top.

### 4. Template and Report Access
Browse the full template library. Pull up any template or report instantly. See status (Draft → Complete → QA'd → Live). Filter by inspection type, standard, client.

### 5. DS Live Page
Per-client summary cards:
- Client name, current stage, health signal
- Short status line (one sentence)
- Recent activity (last 2-3 interaction log entries)
- Open issues count

Scannable — a DS should be able to read the whole page in 30 seconds and know where everything stands.

### 6. Cross-Company Patterns
Surfaces learnings automatically:
- Red/orange/green health signals per client
- Playbook entries and which clients they came from
- Resolution patterns — what was tried, what worked, conditions
- Reusable template elements (from Pattern_Check output)

### 7. Role-Based Views
Different users see different things (matches the permission model):
- DS sees everything
- FDE sees client state, diagnostics, issues
- AE sees overview and commercial
- Leadership sees KPIs, playbook, expansion signals
- View Only sees the overview dashboard
