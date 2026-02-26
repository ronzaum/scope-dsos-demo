# Client Type Definitions
# Scope AI — DS-OS
# Last Updated: 2026-02-20

Segmentation rules for how clients behave and what deployment approach works for each type.

---

## By Scale

### Enterprise (top 10 TIC, 1000+ inspectors)
- **Examples:** Bureau Veritas, SGS, Intertek, TÜV SÜD, Eurofins, DNV
- **Typical contract:** £150k-£500k+ annual
- **Sales cycle:** 3-6 months
- **Deployment method:** Phased rollout or hybrid. Never full launch
- **Key success factor:** Executive sponsor who can protect budget through adoption ramp
- **Key risk:** Internal politics, multiple divisions with competing priorities
- **Expansion pattern:** Win one division, prove ROI, expand to adjacent divisions

### Mid-Market (regional TIC, 100-1000 inspectors)
- **Examples:** Regional inspection firms, specialist sector companies
- **Typical contract:** £50k-£150k annual
- **Sales cycle:** 1-3 months
- **Deployment method:** Remote or hybrid. On-site for protocol-driven
- **Key success factor:** Speed to value. Mid-market won't wait 3 months for Phase 1
- **Key risk:** Budget constraints, single decision-maker (if they leave, deal dies)

---

## By Inspection Type

### Protocol-Driven (ISO, regulatory-mandated sequences)
- **Sectors:** Automotive, aerospace, nuclear, pharma, food safety
- **Inspector behaviour:** Follow exact sequences on autopilot. 4-6 inspections daily. Any deviation from their flow is slower
- **Deployment rule:** On-site observation BEFORE template configuration. NEVER configure from documentation alone
- **Adoption driver:** Tool must be faster than paper for their specific sequence
- **Adoption killer:** Extra steps, wrong sequence, incomplete localisation
- **Evidence:** TÜV SÜD (negative — remote configuration missed workflow nuances)

### Flexible (inspector discretion, varied formats)
- **Sectors:** Construction, consumer products, general industrial
- **Inspector behaviour:** More discretion in how inspections are conducted. Willing to adapt workflow
- **Deployment rule:** Remote configuration can work if mobile UI is clean
- **Adoption driver:** Mobile convenience, photo-to-report automation, time savings
- **Adoption killer:** Slow mobile UI, too many taps, poor offline support
- **Evidence:** Bureau Veritas (positive — mobile-first approach drove 84% adoption)

---

## By Geography

### UK
- English language default. Straightforward localisation
- Strong TIC presence (BV, Intertek, TÜV SÜD all have UK operations)
- Regulatory framework: UKAS, HSE, Building Safety Act

### DACH (Germany, Austria, Switzerland)
- German language MANDATORY. 100% localisation before deployment
- TÜV brands dominate. High standards, high protocol adherence
- Regulatory framework: KBA (automotive), TÜV standards, DIN
- Cultural note: Thoroughness valued over speed. "Does it work correctly?" before "Is it fast?"

### Global (multi-country deployments)
- Multi-language support critical
- Time zone considerations for support
- Local regulatory formats per country
- Phased by geography: prove in one country, replicate
