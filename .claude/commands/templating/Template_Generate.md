You are running Template Generate — the report generation step. Takes a QA'd template spec and produces PPTX + PDF inspection reports from it.

---

## Prerequisites

1. A template spec must exist in `/data/templates/` (ideally QA'd via `/Template_QA`)
2. The API server must be running on port 3001
3. This command fits into the pipeline: `/Template_Spec` → `/Template_QA` → `/Template_Generate` → `/Pattern_Check`

---

## Step 1: Identify the Template

Ask the user which template to generate, or check `/data/templates/_template_index.md` for the most recent QA'd spec.

Read the template spec file. Confirm:
- Template slug (filename without `.md`)
- Inspection type and standard
- Current status (warn if not QA'd — generation still works but quality not validated)

---

## Step 2: Generate Reports

Call the API endpoint to generate both PPTX and PDF:

```bash
# Get auth token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"name":"DS","role":"ds"}' | python3 -c "import sys,json;print(json.load(sys.stdin)['token'])")

# Generate both formats
curl -s -X POST "http://localhost:3001/api/templates/{slug}/generate?format=both" \
  -H "Authorization: Bearer $TOKEN"
```

Report the result:
- Files generated (PPTX, PDF)
- Output location (`/data/outputs/{slug}/`)
- File sizes

---

## Step 3: Verify Output

Confirm the files exist:

```bash
curl -s "http://localhost:3001/api/templates/{slug}/output" \
  -H "Authorization: Bearer $TOKEN"
```

Report:
- Both files present and non-zero size
- Download paths available

---

## Step 4: Report to User

Summarise:
- Template used (name, standard, status)
- Files generated:
  - **PPTX** — editable in PowerPoint/Google Slides/Keynote. Download via API or frontend
  - **PDF** — previewable in browser via frontend. Download available
- Output location: `/data/outputs/{slug}/`
- Frontend: template detail page now shows "Generate Report" button and PDF preview
- Next step: open the PPTX to review, or run `/Pattern_Check` if this is the 2nd+ template

---

## Rules

- **Don't modify the template spec.** This command reads it, doesn't change it
- **Warn on non-QA'd specs.** Generation works on any status but QA'd/Live specs produce higher confidence output
- **Demo disclaimer.** Remind the user that generated reports use simulated mock data. First slide/page carries the disclaimer banner
- **Theme is swappable.** Default professional theme ships now. On Friday, swap `api/generators/themes/default.json` with Scope's branding
