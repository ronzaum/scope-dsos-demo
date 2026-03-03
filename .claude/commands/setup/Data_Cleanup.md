You are running Data Cleanup — the end-of-session data purge command.

---

## Purpose

Remove all sensitive session data created during a trial day or working session. This is the counterpart to the consent step in `/Friday_Context` — data capture starts with consent, and ends with cleanup.

---

## Step 1: Inventory

Scan and list what will be deleted. Display each category with the number of files/entries found:

1. **Trial log** — `/data/friday/trial_log.md` (all timestamped entries from today's session)
2. **Client files** — `/data/clients/*.md` (all client files created or modified this session)
3. **Audit logs** — `api/logs/audit.log` (all API request logs)
4. **Tool capture** — `/data/friday/tool_capture.md` (only if it contains session-specific data; skip if it was pre-existing Layer 2 knowledge)

Display the inventory as a clear checklist:

```
Data Cleanup — files to be purged:

☐ /data/friday/trial_log.md (X entries)
☐ /data/clients/ (X files: [list filenames])
☐ api/logs/audit.log (X entries)
☐ /data/friday/tool_capture.md (if session-specific)
```

**Important:** Do NOT delete:
- `/data/knowledge/` — pre-built industry knowledge (not session data)
- `/data/templates/` — template specs (persistent, not session data)
- `/data/playbook/` — institutional memory (never deleted per-session)
- `/data/system/` — system log and method registry (persistent)

---

## Step 2: Confirm

Ask for explicit confirmation before proceeding:

> **This will permanently delete the files listed above. This cannot be undone.**
> Type "confirm cleanup" to proceed, or "cancel" to abort.

Do NOT proceed without the exact confirmation phrase.

---

## Step 3: Log Before Delete

Before deleting anything, write a cleanup record to `/data/system/system_log.md`:

```
### [TIMESTAMP] — DATA CLEANUP
**Action:** Session data purged
**Files deleted:** [list of files/paths removed]
**Initiated by:** User command (/Data_Cleanup)
**Reason:** End-of-session data hygiene
```

---

## Step 4: Execute Cleanup

Delete the confirmed files:

1. Delete `/data/friday/trial_log.md` contents (or the file itself)
2. Delete all files in `/data/clients/`
3. Delete `api/logs/audit.log` contents (or the file itself)
4. Clear `/data/friday/tool_capture.md` if flagged for cleanup

After deletion, confirm to the user:

```
Cleanup complete. X files purged. System log updated.
```

---

## Rules

- Never delete without explicit confirmation
- Always log the cleanup action to system log BEFORE deleting
- Never touch knowledge, templates, playbook, or system files
- If no session data exists, tell the user "Nothing to clean up" and exit
- This command can be run multiple times safely (idempotent)
