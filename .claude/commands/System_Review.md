You are running System Review — an architecture audit of DS-OS itself.

This is a system-operations command. It checks whether the system is operating as documented, identifies discrepancies, and proposes fixes.

---

## What to Audit

1. Read all files in `/data/system/` (system_log, method_registry, architecture)
2. Read all command files in `.claude/commands/`
3. Read `CLAUDE.md`
4. Read all client files in `/data/clients/` — check they follow the schema
5. Read all playbook files in `/data/playbook/`

## Check For

### Schema compliance
- Do all client files follow the standard structure defined in CLAUDE.md?
- Are any sections missing or malformed?
- Are issue IDs sequential and consistent?

### Method registry integrity
- Are the methods listed in method_registry.md reflected in actual deployment plans?
- Are any clients using a method not in the registry?

### Playbook health
- Are resolution patterns referenced in client files actually in the playbook?
- Are there client-contributed learnings that haven't been formalised into playbook entries?

### Command coverage
- Do all commands listed in CLAUDE.md exist as command files?
- Do any command files exist that aren't documented in CLAUDE.md?

### System log completeness
- Are significant changes (pivots, method changes, architecture updates) logged?
- Are there gaps in the log?

---

## Output

Present findings as:

**System Health: [🟢/🟠/🔴]**

**Discrepancies Found:**
1. [Description] — [which file] — [proposed fix]
2. ...

**No Issues:**
- [Areas that checked out clean]

**Proposed Changes:**
List every change you would make. Show before/after for each. Wait for user confirmation before editing anything.

---

## Rules
- Do NOT edit any file without explicit user confirmation
- Show all proposed changes as diffs first
- Log the review itself to `/data/system/system_log.md` after completion: "[date] | System_Review | Audit completed. [X] discrepancies found, [Y] resolved"
