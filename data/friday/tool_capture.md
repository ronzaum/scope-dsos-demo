# Scope AI — Tool Capture (Layer 2)
# Captured via /Tool_Setup
# Last Updated: 2026-03-06

---

## Status: PARTIAL — Pre-Hands-On (from product deck + Helpful Expressions doc)

Layer 2 captures Scope's actual tool mechanics. This initial capture is from the product overview deck and technical documentation provided before hands-on access. Will be updated as Ron explores the platform.

---

## Product Interface

### Login & Navigation
- **URL:** TBC — awaiting platform access
- **Login method:** TBC
- **Main navigation structure:** TBC
- **Key screens/pages:** TBC

### User Roles in Product
- **Admin:** TBC
- **Inspector:** Mobile app user — field data capture
- **Supervisor:** TBC
- **Compliance lead:** TBC

---

## Inspection Template Configuration

### How Templates Are Created
- **Entry point:** TBC — need hands-on
- **Steps to create a new template:** TBC
- **Field types available:** TBC — but "context containers" confirmed as a key concept
- **Conditional logic support:** TBC
- **Template versioning:** TBC

### Context Containers (Key Concept)
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
- **Assignment method:** TBC
- **Per-inspector vs per-team vs per-client:** TBC
- **Override capability:** TBC

### Template Structure
- **Section types:** TBC — repeating sections confirmed
- **Field validation options:** TBC
- **Photo attachment method:** Context containers → repeating sections with photo blocks
- **Required vs optional fields:** TBC
- **Ordering/sequencing:** TBC

---

## Report Generation

### How Reports Are Generated
- **Trigger (auto vs manual):** TBC
- **Input data source:** Data collected via mobile/web templates
- **Output format:** PowerPoint (PPTX) — editable in PowerPoint/Google Slides/Keynote — plus PDF for preview and final delivery
- **Branding/formatting options:** TBC — but "digital delivery of reports" with client branding confirmed
- **Regulatory format selection:** TBC

### Report Review Workflow
- **Draft → Review → Approve flow:** TBC
- **Who can edit generated reports:** TBC (PPTX is editable)
- **Version tracking:** TBC
- **Approval mechanism:** TBC

---

## Data Flow

### Inspector Mobile Workflow
- **App name:** TBC
- **Offline capability:** TBC — critical for Applus (Scott's field conditions)
- **Photo capture flow:** Context containers — capture photos with captions on mobile, auto-populate into report sections
- **Data sync mechanism:** TBC
- **Speed/performance notes:** TBC

### Data Import/Export
- **Import formats supported:** "Extract and input data from any source" — PDFs, P&ID diagrams, inspection reports, regulatory requirements
- **Export formats supported:** PPTX, PDF
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

## Dashboard

### Available Views
- **Automatically Generated Dashboards** confirmed from product deck
- **Portfolio overview:** TBC
- **Client-specific:** TBC
- **Inspector-specific:** TBC
- **KPI/metrics available:** TBC
- **Filtering/drill-down:** TBC

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
| Offline capability | Not confirmed from docs — critical for Applus field work | HIGH | Need to verify on platform |
| Format matching | Can Scope replicate Applus L5-NDT-UTT-F01 exactly? | HIGH | Need to verify template flexibility |
| Photo handling | Context containers documented but not tested | MEDIUM | Test during hands-on |
| Report output | PPTX confirmed — but Applus may need Word/PDF matching existing format | MEDIUM | Verify output options |

---

## Capture Notes

> **2026-03-06 09:30** — Initial capture from product overview deck ("Scope AI - for onsite.pptx") and "Helpful Expressions" technical doc. No hands-on platform access yet. Key finding: context containers are the mechanism for mobile photo/data capture flowing into report sections. Expressions syntax documented above.
>
> **Next step:** Get hands-on access to the platform. Priority: understand template builder, test context container workflow, verify format matching capability for Applus's existing report template.
