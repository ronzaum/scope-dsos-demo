You are running Log Issue — the intake step for any problem, blocker, or concern related to a client deployment.

This is intake only. No analysis or resolution yet. Capture the problem accurately and classify it.

---

## Prerequisites
- Client file must exist at `/data/clients/[client_name].md`
- Read the client file first to understand current deployment state and any existing issues

---

## Capture the Issue

Collect from the user (or from the context they provide):

1. **Source:** Where did this come from? (Email, call transcript, support ticket, usage data, observation, client complaint)
2. **Raw description:** What happened, in the user's or client's own words
3. **When:** Date/time of the issue or when it was first noticed

---

## Classify the Issue

### Category
| Category | Definition |
|----------|-----------|
| **Feature gap** | Client needs something Scope doesn't currently offer |
| **Adoption blocker** | Users are not adopting or reverting to old processes |
| **Commercial risk** | Threat to contract renewal, expansion, or relationship |
| **Retention risk** | Client may churn if not addressed |
| **Integration failure** | Technical issue with data, systems, or connectivity |
| **User error** | Client-side misuse or misunderstanding of the product |
| **Process breakdown** | Internal Scope process failed (handoff, communication, follow-up) |

### Severity
| Level | Definition |
|-------|-----------|
| 🔴 **Blocking** | Deployment cannot progress. Client impact is immediate |
| 🟠 **Degrading** | Deployment is slower or harder than it should be. Client frustrated |
| 🟢 **Minor** | Inconvenient but not blocking progress |

### Affected User Type
Which user types (from the client's Constraint Map) are affected?

---

## Output

Update the client file `/data/clients/[client_name].md`:

**Issue Log** — add a new entry:

```markdown
### ISSUE-[XXX] | [Short title]
- **Status:** Open
- **Logged:** [date]
- **Source:** [source]
- **Category:** [category]
- **Severity:** [🔴/🟠/🟢] [level]
- **Affected users:** [user types]
- **Description:** [raw description]
- **Resolution:** Pending — run /Resolve
```

Generate the issue ID sequentially (ISSUE-001, ISSUE-002, etc.) based on existing issues in the log.

**Interaction History** — add entry: "[date] | Log_Issue | [ISSUE-XXX] logged: [short title]. Severity: [level]"

---

## After Completion

Tell the user: "Issue [ISSUE-XXX] logged. Category: [category]. Severity: [level]. Run `/Resolve` to find a solution."

If severity is 🔴 Blocking, add urgency: "This is a blocking issue. Recommend running `/Resolve` immediately."
