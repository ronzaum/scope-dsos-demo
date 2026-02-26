You are running Resolve — the structured problem resolution step. This turns reactive firefighting into systematic resolution with cross-client intelligence.

---

## Prerequisites
- Issue must be logged in client file (run `/Log_Issue` first if not)
- Read `/data/clients/[client_name].md` — focus on the open issue and deployment context
- Read `/data/playbook/resolution_patterns.md` for past solutions
- Read ALL other client files in `/data/clients/` for cross-client pattern scanning

---

## Step 1: Cross-Client Scan

Compare this issue against all other clients:
- Has this issue type appeared before? At which clients?
- Were those clients at a similar deployment stage, sector, or scale?
- What was the outcome?

Output a pattern report:

| Client | Similar Issue | Stage When It Appeared | Resolution | Outcome |
|--------|-------------|----------------------|------------|---------|
| | | | | |

If no similar pattern exists: "No cross-client precedent. This is a novel issue for the portfolio."

---

## Step 2: Past Solutions

Pull from the resolution patterns playbook:
- What has been tried before for this issue category?
- What worked and under what conditions?
- What failed and why?

Rank solutions by:
1. Relevance to this specific client's context
2. Past success rate
3. Speed of resolution

---

## Step 3: Action Plan

Define the resolution:

**Immediate action:** What unblocks the client right now?

**Method:**
- Can this be resolved remotely or does it need on-site?
- What does the client prefer? (Check stakeholder profiles and interaction history)
- What is the fastest path that does not create downstream problems?

**Action plan:**
| Action | Owner | Method | Timeline | Follow-up Trigger |
|--------|-------|--------|----------|-------------------|
| | | | | |

**Root cause:** What is the underlying reason, not just the symptom?

**Prevention:** What would stop this from happening at the next client?

---

## Step 4: Novel Problems (if no playbook match)

If the playbook has no relevant precedent, run a structured brainstorm:

1. **Define precisely:** What is the problem in one sentence?
2. **List all approaches:** At least 3 possible solutions
3. **Map tradeoffs:** For each approach, what's the upside, downside, and risk?
4. **Fastest path:** Which approach resolves it quickest without creating new problems?
5. **Recommended approach:** Choose one with clear reasoning

---

## Output

Update the client file `/data/clients/[client_name].md`:

**Issue Log** — update the relevant issue entry:
```markdown
- **Status:** Resolved (or In Progress if multi-step)
- **Resolution date:** [date]
- **Cross-client scan:** [summary of patterns found]
- **Root cause:** [root cause]
- **Resolution:** [what was done]
- **Prevention:** [what prevents recurrence]
- **Playbook update needed:** Yes/No — if Yes, flag for /Update_Playbook
```

**Interaction History** — add entry: "[date] | Resolve | [ISSUE-XXX] resolved. Root cause: [cause]. Action: [action]. Playbook update: [yes/no]"

---

## After Completion

Tell the user: "Issue [ISSUE-XXX] resolved. Root cause: [cause]. Action plan: [summary]."

If playbook update is needed: "This resolution contains a new pattern. Run `/Update_Playbook` to compound this learning."

If the resolution changes how future deployments should be run: "This may require a method change. Consider running `/Pivot` if the pattern is universal."
