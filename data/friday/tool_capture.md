# Scope AI — Tool Capture (Layer 2)
# Captured via /Tool_Setup
# Last Updated: 2026-03-06 11:30

---

## Status: PARTIAL — Hands-On (from platform screenshots + product deck + Helpful Expressions doc)

Layer 2 captures Scope's actual tool mechanics. This capture combines initial product deck/doc review with hands-on platform screenshots taken at ~11:19-11:20 on 2026-03-06.

---

## Product Interface

### Login & Navigation
- **URL:** app.getscope.ai
- **Login method:** Email-based (Ron logged in as ronzaum@gmail.com)
- **Organisation:** Scope Ltd. (domain: getscope.ai)
- **Main navigation (left sidebar):**
  - Dashboard
  - Assets
  - Reports
  - Actions
  - Upcoming Inspections
  - Settings (expandable):
    - Organization
    - Clients
    - Templates
    - Profile
    - Branding
    - Library
  - Invite Members
  - Support
- **Branding:** "Powered by SCOPE" at bottom of sidebar
- **Top bar:** Notification bell, user avatar

### User Roles in Product
- **Organization Admin:** Full access (e.g., Antoine Test 2)
- **Organization User:** Standard access (e.g., Andy Ismaili, Arman Uddin)
- **Titles:** Configurable via "Manage Titles" (e.g., "Senior Inspection Engineer" for Gagan Khurana)
- **Inspector:** Mobile app user — field data capture
- **Supervisor/Compliance lead:** TBC — not visible in screenshots

### Known Users (Scope Ltd. org)
- Andy Ismaili — Organization User
- Arman Uddin — Organization User
- Gagan Khurana — Senior Inspection Engineer, Organization User
- Antoine Test 2 — Organization Admin
- Ron (ronzaum@gmail.com) — current user

---

## Dashboard

- **Welcome message:** "Welcome back, [Name]"
- **Four tabs:** Task List, Actions, Upcoming Inspections, Billable Reports
- **Task List columns:** Title, Client, Asset ID, Due Date, Created
- **Status filter:** Dropdown (To-do)
- **Dashboard is template-configurable** — pages and sections are managed via Settings > Templates > Dashboard Template
- **Dashboard Template pages:** Task List, Actions, Upcoming Inspections, Billable Reports — each with configurable sections (e.g., "Platform Actions — Custom Component")

---

## Assets

### Asset List
- **Search:** By registration number
- **Filters:** Client, Location, Plant
- **Asset cards show:** Name, Description, Type tag (Other, Vessel), Location > Plant > N/A
- **"Create new asset" button** (top right)

### Asset Detail Page
- **Header fields:** Client, Asset ID, Description, Type, Subtype, Location, Plant, Unit ID
- **Visual:** Asset diagram/illustration (e.g., pressure vessel schematic)
- **Edit button** (pencil icon) on header
- **Tabs:** Reports, Files and Attachments, GA Extraction, Actions, Header, Activity
- **Reports tab:** Title, Issue, Status, Type, Created At, Assignee — with Status/Type filters
- **"Create Report" button** — opens template selection modal
- **Asset types seen:** Other, Vessel (Subtype: Pressure Vessel)
- **Asset Template is configurable** — pages (Reports, Files and Attachments, GA Extraction, Actions, Header, Activity) managed via Settings > Templates > Asset Template

### GA Extraction Tab
- Visible on asset detail — appears to be a Scope-specific feature for extracting data from General Arrangement drawings. TBC — need to explore

---

## Report Template Selection (Creating a Report)

- **Trigger:** "Create Report" button on asset detail page
- **Modal:** "Select a Report Template — Choose a template to create a report for this asset"
- **Search:** Search templates field
- **Display:** Cards with template name + description
- **Selection:** "Select Template" button per card
- **Templates seen:** Number Input Validation, Repeating Container Context Vis, One Draft, Saucy minx, Build & Learn, EEMUA Draft

---

## Reports

### Report List
- **Search:** Search titles
- **Filters:** Add filter button
- **Export:** Export button
- **Columns:** Client, Location, Asset Type, Report Type, Report Title, Status
- **Statuses seen:** DRAFT, COMPLETE
- **Report types seen:** Half-Cell Survey, T&L-NS-Rev.00 - Zorgplicht

### Report Detail / Review Page
- **PDF preview:** Embedded viewer with page navigation (1/1), zoom (54%), rotation, download
- **Report info panel (right side):**
  - Title
  - Status badge (Draft)
  - Visibility: "Internally Visible"
  - Recipients: "No recipients" (configurable)
  - Version: "Version 1 — 06/03/2026"
- **Actions:** "Start Review" button, "Edit Report Data" button
- **Attachment icons:** Paperclip, download, and other action icons
- **Review Process section:**
  - Add Preparer, Add Reviewer, Add Client
  - Shows assigned person with role (e.g., "Rayan Haifi — Inspection Engineer")
  - Review status: "Review Not Started"

### Report Review Workflow (CONFIRMED)
- **Three-role review:** Preparer, Reviewer, Client
- **Statuses:** Draft → Review (with Start Review) → presumably Approved/Complete
- **Version tracking:** Yes, version numbered
- **Visibility control:** Internal vs external (recipients)
- **PDF output confirmed** — report.pdf rendered in viewer
- **Edit capability:** "Edit Report Data" available from review page

---

## Actions

- **Summary cards:** Open Actions (count), Due Soon (within 7 days), Overdue (requires attention)
- **Columns:** Client, Location, Asset, Description, Owner, Level, Status, Due Date
- **Levels:** Recommended, Mandatory
- **Statuses:** Open, Superseded
- **Search:** By description
- **Filters:** Add filter button
- **Export:** Export button

---

## Client Management (Settings > Clients)

- **Search:** Search clients
- **Columns:** Client Name, Industry, Created, Actions
- **"Add New Client" button**
- **Pagination:** Page 1 of 2
- **Clients seen (demo):** Scope Test (Scope), Playground (Client) (Oil), Playground (SP) (tbd), Playground (SB) (Chemicals), Playground (JL) (Oil and Gas)
- **Actions:** Settings cog per client

---

## Inspection Template Configuration

### Self-Serve Template Builder (Settings > Templates)

**Five tabs:** Overview, Data Collection Templates, Report Templates, Asset Template, Dashboard Template

### Overview Tab — Architecture
Two-tier system:
1. **User Defined Sections (Web & Mobile)** — building blocks
   - User-created sections for data collection on web and mobile
   - Reusable building blocks for report templates
   - Dynamic forms with custom fields and validation
   - "Manage Templates" button
2. **Pre-built Sections** — Scope-delivered
   - Bespoke template design
   - Custom data integrations
   - Personalized workflow automation

**Flow:** User Defined Sections (building blocks) → assembled into → Report Templates (complete workflows) → generate reports

### Data Collection Templates (User Defined Sections)
- **Active count:** 17 active sections, plus Archived tab
- **Display:** Cards with tags indicating platform: Asset, Mobile, Report
- **Each card:** Title, description, Updated date, Edit button, Preview button
- **"Create Section" button** (top right)
- **Sections seen:**
  - Half-Cell Report Output (Asset)
  - Table bug testing (Report)
  - Number Input Validation (Mobile, Report)
  - Pavement Coring (Mobile, Report)
  - Core Log Photosheet (Mobile, Report)
  - Repeating Container Context Vis (Mobile)

### Report Templates
- **Active count:** 15+ active, plus Archived tab
- **Each template:** Title, description, Updated date, Baseline status, Edit button
- **Baseline status:** "No baseline" (red tag) on most — indicates templates not yet baselined
- **"Create Template" button** (top right)
- **Templates seen:**
  - Half-Cell Survey
  - Table bug testing
  - T&L-NS-Rev.00 - Zorgplicht
  - Number Input Validation
  - Lab Test Report (CTS)
  - CTS Log
  - Repeating Container Context Vis
  - Test - Joseph, Test - James

### Asset Template
- Configures asset homepage layout
- Manages pages and sections per page
- Drag-handle reordering
- Default pages: Reports, Files and Attachments, GA Extraction, Actions, Header, Activity
- Add Page, Add Section buttons

### Dashboard Template
- Configures dashboard layout
- Pages: Task List, Actions, Upcoming Inspections, Billable Reports
- Each page has configurable sections
- Add Page, Add Section buttons

### Context Containers (Key Concept — from docs)
From the "Helpful Expressions" documentation:
- Context containers capture information (photos, audio) in mobile
- Used to pull data from one container into repeating sections
- **Data Source Expression** for repeating section:
  ```
  @(sectionData["a1240-...-190ea0"]["container-schema-key"].value.contextContainers)
  @([container that has your data in it].value.contextContainers)
  ```
- **Photo block expression** inside repeating section:
  ```
  {"contextUid": @(self.dataSourceData.contextUid), "caption": @(self.dataSourceData["contextContainer:caption"].value)}
  ```

### Template Design Approach (from docs)
- Think through what user fills out in **mobile** (field) vs **web** (office)
- Separate data collection template for mobile vs web
- Ask the team if unsure how things work

### How Templates Are Assigned
- Templates selected from modal when creating a report for an asset
- Selection is per-report, not per-inspector or per-team
- Template list is organisation-wide (all templates available to all users)
- **Per-inspector vs per-team vs per-client assignment:** Not visible — appears all templates available to all

### Template Structure
- **Section types:** User Defined Sections + Pre-built Sections (confirmed)
- **Repeating sections:** Confirmed (from docs + "Repeating Container Context Vis" template)
- **Platform tags:** Mobile, Report, Asset — sections tagged for where they're used
- **Photo attachment method:** Context containers → repeating sections with photo blocks
- **Field validation options:** "Dynamic forms with custom fields and validation" — detail TBC
- **Required vs optional fields:** TBC
- **Ordering/sequencing:** TBC

---

## Report Generation

### How Reports Are Generated
- **Trigger:** Manual — user clicks "Create Report" on asset detail page, selects template
- **Input data source:** Data collected via mobile/web data collection sections within the template
- **Output format:** PDF confirmed (report.pdf visible in viewer). PPTX also confirmed from product deck
- **Branding/formatting options:** "Branding" page exists under Settings — TBC detail
- **Regulatory format selection:** TBC

### Report Review Workflow (CONFIRMED)
- **Three-role review process:** Preparer → Reviewer → Client
- **Draft → Review → Approve flow:** Yes — "Start Review" button transitions from Draft
- **Who can edit generated reports:** "Edit Report Data" button available on review page
- **Version tracking:** Yes — "Version 1 — 06/03/2026" format
- **Visibility control:** "Internally Visible" / recipients management
- **Approval mechanism:** Review process with explicit role assignments

---

## Data Flow

### Inspector Mobile Workflow
- **App name:** TBC — mobile app exists (referenced in offline mode bug)
- **Offline capability:** KNOWN BUG — "A bug has been discovered with saving data in offline mode on the mobile app. Please avoid using the mobile app offline until a fix is released."
- **Photo capture flow:** Context containers — capture photos with captions on mobile, auto-populate into report sections
- **Data sync mechanism:** TBC
- **Speed/performance notes:** TBC

### Data Import/Export
- **Import formats supported:** "Extract and input data from any source" — PDFs, P&ID diagrams, inspection reports, regulatory requirements
- **Export formats supported:** PPTX, PDF, plus Export button on Reports and Actions lists (likely CSV)
- **GA Extraction:** Dedicated tab on asset detail — appears to extract data from General Arrangement drawings
- **API availability:** TBC
- **Integration methods:** TBC

---

## Anomaly Detection

### Configuration
- **How anomaly rules are set up:** TBC
- **Per-client vs universal:** TBC
- **Alert mechanism:** TBC
- **Sensitivity tuning:** TBC

---

## Compliance Checking

### How Compliance Rules Are Configured
- **Standard selection:** TBC
- **Acceptance criteria setup:** TBC
- **Auto-check vs manual check:** "Automated data clean up" confirmed. "Create workflows with standards and AI" confirmed
- **Override/exception handling:** TBC

---

## Dashboard (Analytics)

### Available Views
- **Dashboard tabs confirmed:** Task List, Actions, Upcoming Inspections, Billable Reports
- **Dashboard is template-configurable** — layout managed via Settings > Templates > Dashboard Template
- **Portfolio overview:** Not visible as separate view — may be within dashboard
- **Client-specific views:** Reports filterable by client
- **Inspector-specific views:** TBC
- **KPI/metrics available:** Actions summary (Open, Due Soon, Overdue) confirmed
- **Filtering/drill-down:** Filters available on Reports and Actions lists

---

## Performance Claims (from Product Deck)

### General Claims
- Cut reporting time by 80%
- 2x faster inspections with same headcount
- "Major increase in efficiency"
- "Leading solution for complex data ingestion and reporting"

### TUV Rheinland Case Study (post 3 months deployment)
| Metric | Result |
|--------|--------|
| Inspector time saved | +50 hrs/inspector/month |
| Contract won | £1.2M deal secured through competitive pricing enabled by inspector efficiency |
| Inspection delivery speed | 5x faster delivery of results and risk assessments |
| Software uptime | 99.99% — 4 minutes downtime/month |

### Trusted by
- "Leading engineering providers" (logos not captured)
- TUV Rheinland confirmed (co-branding: SmartRBI)

---

## Gaps & Limitations Identified

| Area | Gap Description | Severity | Workaround |
|------|----------------|----------|------------|
| Offline capability | **KNOWN BUG** — banner on platform: "A bug has been discovered with saving data in offline mode on the mobile app. Please avoid using the mobile app offline until a fix is released." | CRITICAL | Cannot use mobile offline. Applus field inspectors need connectivity |
| Format matching | Can Scope replicate Applus L5-NDT-UTT-F01 exactly? | HIGH | Need to verify template flexibility in builder |
| Template baselines | Most report templates show "No baseline" (red) — unclear what baseline means and if this affects deployment | MEDIUM | Ask Scope team what baseline means |
| Photo handling | Context containers documented but not tested hands-on | MEDIUM | Test during hands-on |
| Report output | PPTX confirmed from deck, PDF confirmed from platform — but Applus may need Word/PDF matching existing format | MEDIUM | Verify output options |
| GA Extraction | Tab visible on assets but functionality unclear | LOW | Explore during hands-on |
| Anomaly detection | Not visible in any screenshot — no UI path found | LOW | Ask Scope team where this lives |
| Compliance checking | Not visible in any screenshot — no UI path found | LOW | Ask Scope team where this lives |

---

## Capture Notes

> **2026-03-06 09:30** — Initial capture from product overview deck ("Scope AI - for onsite.pptx") and "Helpful Expressions" technical doc. No hands-on platform access yet. Key finding: context containers are the mechanism for mobile photo/data capture flowing into report sections. Expressions syntax documented above.
>
> **2026-03-06 11:30** — Major update from 16 platform screenshots (app.getscope.ai). Full navigation structure mapped. Key findings:
> - Two-tier template architecture confirmed: User Defined Sections (building blocks) assembled into Report Templates
> - Three-role review process: Preparer → Reviewer → Client
> - CRITICAL: Mobile offline mode has a known bug — banner warning on the platform
> - Asset management includes GA Extraction feature (not in product deck)
> - Actions system with Recommended/Mandatory levels and Open/Superseded statuses
> - Client management is multi-tenant with industry tagging
> - Dashboard and Asset pages are template-configurable
>
> **Next step:** Hands-on exploration of template builder (create a section, build a template). Test GA Extraction. Ask about anomaly detection and compliance checking UI paths. Understand "baseline" concept for report templates.
