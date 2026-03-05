/**
 * DS-OS API Server
 * Bridges Claude Code markdown files to the Lovable frontend.
 *
 * Reads /data/ markdown files, parses into JSON, serves over HTTP.
 * Watches for file changes and auto-refreshes cache.
 *
 * Usage: node server.js
 * Runs on port 3001 by default.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');

const { parseClientFile, buildClientSummary } = require('./parsers/client');
const { buildPlaybookResponse } = require('./parsers/playbook');
const { buildSystemResponse } = require('./parsers/system');
const { loadTemplates, loadCoreBlocks, writeCoreBlocks } = require('./parsers/template');
const { buildKnowledgeResponse } = require('./parsers/knowledge');
const { computeRevenueAtRisk, computePendingAdoption, buildPriorityQueue, buildTemplateRevenueContext } = require('./parsers/commercial');
const { generatePptx } = require('./generators/pptx');
const { generatePdf } = require('./generators/pdf');

// --- Security layer ---
const { validRoles } = require('./config/roles');
const { authMiddleware, generateToken } = require('./middleware/auth');
const { rbacMiddleware, filterClientFields } = require('./middleware/rbac');
const { auditMiddleware, readAuditLog } = require('./middleware/audit');
const { buildRedactionMap, redact } = require('./middleware/redact');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.resolve(__dirname, '..', 'data');

// --- In-memory cache ---
const cache = {
  clients: new Map(),        // slug → parsed client
  playbook: null,            // full playbook response
  system: null,              // full system response
  templates: null,           // { templates: [], patterns: {}, indexEntries: [] }
  knowledge: null,           // full knowledge response (7 sections)
  lastUpdated: null,
};

// --- File reading helper ---
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error(`Failed to read ${filePath}:`, err.message);
    return null;
  }
}

// --- Parse all data ---
function loadAllData() {
  console.log('Loading all data from', DATA_DIR);

  // Load clients
  const clientsDir = path.join(DATA_DIR, 'clients');
  if (fs.existsSync(clientsDir)) {
    const files = fs.readdirSync(clientsDir).filter(f => f.endsWith('.md'));
    cache.clients.clear();
    for (const file of files) {
      const content = readFile(path.join(clientsDir, file));
      if (content) {
        const parsed = parseClientFile(content, file);
        cache.clients.set(parsed.slug, parsed);
        console.log(`  Loaded client: ${parsed.name} (${parsed.slug})`);
      }
    }
  }

  // Load playbook
  const playbookContent = readFile(path.join(DATA_DIR, 'playbook', 'deployment_playbook.md'));
  const resolutionContent = readFile(path.join(DATA_DIR, 'playbook', 'resolution_patterns.md'));
  const clientTypesContent = readFile(path.join(DATA_DIR, 'playbook', 'client_type_definitions.md'));
  if (playbookContent && resolutionContent && clientTypesContent) {
    cache.playbook = buildPlaybookResponse(playbookContent, resolutionContent, clientTypesContent);
    console.log('  Loaded playbook');
  }

  // Load system
  const registryContent = readFile(path.join(DATA_DIR, 'system', 'method_registry.md'));
  const logContent = readFile(path.join(DATA_DIR, 'system', 'system_log.md'));
  if (registryContent && logContent) {
    cache.system = buildSystemResponse(registryContent, logContent);
    console.log('  Loaded system');
  }

  // Load templates
  cache.templates = loadTemplates();
  console.log(`  Loaded ${cache.templates.templates.length} template(s)`);

  // Load knowledge base
  const knowledgeDir = path.join(DATA_DIR, 'knowledge');
  const inspTypesContent = readFile(path.join(knowledgeDir, 'inspection_types.md'));
  const regStdsContent = readFile(path.join(knowledgeDir, 'regulatory_standards.md'));
  const reportAnatomyContent = readFile(path.join(knowledgeDir, 'report_anatomy.md'));
  const scopeProductContent = readFile(path.join(knowledgeDir, 'scope_product.md'));
  if (inspTypesContent && regStdsContent && reportAnatomyContent && scopeProductContent) {
    cache.knowledge = buildKnowledgeResponse(inspTypesContent, regStdsContent, reportAnatomyContent, scopeProductContent, cache.clients, cache.playbook);
    console.log(`  Loaded knowledge base (${cache.knowledge.sections.length} sections)`);
  }

  cache.lastUpdated = new Date().toISOString();
  console.log('Data loaded at', cache.lastUpdated);
}

// --- Selective reload ---
function reloadFile(filePath) {
  const relative = path.relative(DATA_DIR, filePath);
  console.log(`File changed: ${relative}`);

  if (relative.startsWith('clients/')) {
    const content = readFile(filePath);
    if (content) {
      const filename = path.basename(filePath);
      const parsed = parseClientFile(content, filename);
      cache.clients.set(parsed.slug, parsed);
      console.log(`  Reloaded client: ${parsed.name}`);
    }
  } else if (relative.startsWith('playbook/')) {
    const playbookContent = readFile(path.join(DATA_DIR, 'playbook', 'deployment_playbook.md'));
    const resolutionContent = readFile(path.join(DATA_DIR, 'playbook', 'resolution_patterns.md'));
    const clientTypesContent = readFile(path.join(DATA_DIR, 'playbook', 'client_type_definitions.md'));
    if (playbookContent && resolutionContent && clientTypesContent) {
      cache.playbook = buildPlaybookResponse(playbookContent, resolutionContent, clientTypesContent);
      console.log('  Reloaded playbook');
      // Refresh knowledge too — it includes client type data from playbook
      const knowledgeDir = path.join(DATA_DIR, 'knowledge');
      const inspTypesContent = readFile(path.join(knowledgeDir, 'inspection_types.md'));
      const regStdsContent = readFile(path.join(knowledgeDir, 'regulatory_standards.md'));
      const reportAnatomyContent = readFile(path.join(knowledgeDir, 'report_anatomy.md'));
      const scopeProductContent = readFile(path.join(knowledgeDir, 'scope_product.md'));
      if (inspTypesContent && regStdsContent && reportAnatomyContent && scopeProductContent) {
        cache.knowledge = buildKnowledgeResponse(inspTypesContent, regStdsContent, reportAnatomyContent, scopeProductContent, cache.clients, cache.playbook);
        console.log('  Reloaded knowledge base (playbook data changed)');
      }
    }
  } else if (relative.startsWith('system/')) {
    const registryContent = readFile(path.join(DATA_DIR, 'system', 'method_registry.md'));
    const logContent = readFile(path.join(DATA_DIR, 'system', 'system_log.md'));
    if (registryContent && logContent) {
      cache.system = buildSystemResponse(registryContent, logContent);
      console.log('  Reloaded system');
    }
  } else if (relative.startsWith('templates/')) {
    cache.templates = loadTemplates();
    console.log(`  Reloaded templates (${cache.templates.templates.length} template(s))`);
  } else if (relative.startsWith('knowledge/')) {
    const knowledgeDir = path.join(DATA_DIR, 'knowledge');
    const inspTypesContent = readFile(path.join(knowledgeDir, 'inspection_types.md'));
    const regStdsContent = readFile(path.join(knowledgeDir, 'regulatory_standards.md'));
    const reportAnatomyContent = readFile(path.join(knowledgeDir, 'report_anatomy.md'));
    const scopeProductContent = readFile(path.join(knowledgeDir, 'scope_product.md'));
    if (inspTypesContent && regStdsContent && reportAnatomyContent && scopeProductContent) {
      cache.knowledge = buildKnowledgeResponse(inspTypesContent, regStdsContent, reportAnatomyContent, scopeProductContent, cache.clients, cache.playbook);
      console.log('  Reloaded knowledge base');
    }
  }

  cache.lastUpdated = new Date().toISOString();
}

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Security middleware stack: audit first (captures everything), then auth, then RBAC.
app.use(auditMiddleware);
app.use(authMiddleware);
app.use(rbacMiddleware);

// --- Routes ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    lastUpdated: cache.lastUpdated,
    clients: cache.clients.size,
  });
});

// Login — validates name + role, returns JWT
app.post('/api/auth/login', (req, res) => {
  const { name, role } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required.' });
  }
  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({
      error: `Invalid role. Must be one of: ${validRoles.join(', ')}`,
    });
  }

  const token = generateToken(name.trim(), role);
  res.json({ token, name: name.trim(), role, expiresIn: '8h' });
});

// Audit log — DS-only (RBAC enforces this)
app.get('/api/audit', (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 100;
  const entries = readAuditLog(limit);
  res.json({ entries, count: entries.length });
});

// Overview: aggregated stats + deployment table + signal feed
app.get('/api/overview', (req, res) => {
  const clients = Array.from(cache.clients.values());
  const summaries = clients.map(buildClientSummary);

  // Compute stats
  const now = new Date();
  const activeCount = clients.length;
  const resolutionPatterns = cache.playbook?.resolutionPatterns || [];

  // Avg onboarding — compute from date created to first milestone/phase start
  let avgOnboarding = '14 days';
  const onboardingDays = [];
  for (const c of clients) {
    const created = c.profile?.dateCreated;
    const firstMilestone = (c.interactionHistory || []).find(
      i => i.source?.toLowerCase().includes('milestone') || i.summary?.toLowerCase().includes('phase 1')
    );
    if (created && firstMilestone?.date) {
      const days = Math.round((new Date(firstMilestone.date) - new Date(created)) / (1000 * 60 * 60 * 24));
      if (days > 0) onboardingDays.push(days);
    }
  }
  if (onboardingDays.length > 0) {
    avgOnboarding = `${Math.round(onboardingDays.reduce((a, b) => a + b, 0) / onboardingDays.length)} days`;
  }

  // Commercial aggregations
  const revenueAtRisk = computeRevenueAtRisk(clients, now);
  const pendingAdoption = computePendingAdoption(clients);
  const priorityQueue = buildPriorityQueue(clients, resolutionPatterns, now);

  // Templates per client — customisation density metric
  const templateCount = cache.templates?.templates?.length || 0;
  const templatesPerClient = activeCount > 0
    ? (templateCount / activeCount).toFixed(1)
    : '—';

  // Signal feed — combine recent interactions across all clients + system log
  const signals = buildSignalFeed(clients, cache.system?.systemLog || []);

  res.json({
    stats: {
      activeDeployments: activeCount,
      avgOnboarding,
      revenueAtRisk: { total: revenueAtRisk.total, clientCount: revenueAtRisk.clients.length },
      pendingAdoption: { totalUsers: pendingAdoption.totalUsers, clientCount: pendingAdoption.clientCount },
      templatesPerClient,
    },
    deployments: summaries,
    priorityQueue,
    signalFeed: signals,
    lastUpdated: cache.lastUpdated,
  });
});

// All clients (summary list)
app.get('/api/clients', (req, res) => {
  const clients = Array.from(cache.clients.values());
  const summaries = clients.map(buildClientSummary);
  res.json(summaries);
});

// Single client (full detail, filtered by role)
app.get('/api/clients/:slug', (req, res) => {
  const client = cache.clients.get(req.params.slug);
  if (!client) {
    return res.status(404).json({ error: `Client '${req.params.slug}' not found` });
  }
  const filtered = filterClientFields(client, req.user.role);
  res.json(filtered);
});

// Playbook (patterns + methods) — redacted for non-DS roles
// Client type data has moved to /api/knowledge (client-types section)
app.get('/api/playbook', (req, res) => {
  if (!cache.playbook) {
    return res.status(503).json({ error: 'Playbook data not loaded' });
  }

  // Strip client type data — now served via /api/knowledge
  const { clientTypeInsights, clientTypeDefinitions, ...playbookResponse } = cache.playbook;

  // DS sees raw playbook. Everyone else gets client names redacted.
  if (req.user.role === 'ds') {
    return res.json(playbookResponse);
  }

  const redactionMap = buildRedactionMap();
  const redacted = redact(playbookResponse, redactionMap);
  res.json(redacted);
});

// Method registry (methods + rules + change log)
app.get('/api/methods', (req, res) => {
  if (!cache.system) {
    return res.status(503).json({ error: 'System data not loaded' });
  }
  res.json({
    methods: cache.system.methods,
    rules: cache.system.rules,
    changeLog: cache.system.changeLog,
  });
});

// System log
app.get('/api/system/log', (req, res) => {
  if (!cache.system) {
    return res.status(503).json({ error: 'System data not loaded' });
  }
  res.json(cache.system.systemLog);
});

// Knowledge base — full response (all 7 sections)
app.get('/api/knowledge', (req, res) => {
  if (!cache.knowledge) {
    return res.status(503).json({ error: 'Knowledge base not loaded' });
  }
  res.json(cache.knowledge);
});

// Knowledge base — single section by slug
app.get('/api/knowledge/:section', (req, res) => {
  if (!cache.knowledge) {
    return res.status(503).json({ error: 'Knowledge base not loaded' });
  }
  const section = cache.knowledge.sections.find(s => s.id === req.params.section);
  if (!section) {
    return res.status(404).json({
      error: `Section '${req.params.section}' not found`,
      available: cache.knowledge.sections.map(s => s.id),
    });
  }
  res.json(section);
});

// Templates — list all templates with metadata + revenue context
app.get('/api/templates', (req, res) => {
  const templates = cache.templates || { templates: [], indexEntries: [] };
  const clients = Array.from(cache.clients.values());
  const revenueContext = buildTemplateRevenueContext(templates.templates, clients);

  const list = templates.templates.map(t => ({
    slug: t.slug,
    name: t.name,
    inspectionType: t.inspectionType,
    inspectionFamily: t.inspectionFamily,
    standard: t.standard,
    status: t.status,
    created: t.created,
    sections: t.sections,
    fieldCount: t.fieldCount,
    revenueContext: revenueContext[t.slug] || null,
  }));
  res.json({ templates: list, indexEntries: templates.indexEntries });
});

// Template patterns — must be before :slug route.
// Returns existing overlap/reusable/scalability data plus the new grid payload.
app.get('/api/templates/patterns', (req, res) => {
  const templates = cache.templates || { patterns: null, grid: null };
  if (!templates.patterns && !templates.grid) {
    return res.json({
      overlaps: [],
      reusableElements: [],
      scalabilitySignals: [],
      grid: null,
      message: 'No pattern analysis available. Run /Pattern_Check to generate.',
    });
  }
  res.json({
    ...(templates.patterns || { overlaps: [], reusableElements: [], scalabilitySignals: [] }),
    grid: templates.grid || null,
  });
});

// --- Core Block CRUD (DS-only for writes, all authenticated for reads) ---

// GET /api/templates/core-blocks — returns all core blocks with linked templates
app.get('/api/templates/core-blocks', (req, res) => {
  const coreBlocks = cache.templates?.coreBlocks || [];
  res.json({ coreBlocks });
});

// POST /api/templates/core-blocks — DS creates a core block from selected sections
app.post('/api/templates/core-blocks', (req, res) => {
  if (!req.user || req.user.role !== 'ds') {
    return res.status(403).json({ error: 'Core block creation requires DS role.' });
  }

  const { name, templates: templateSlugs, fields } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Block name is required.' });
  }
  if (!fields || !Array.isArray(fields) || fields.length === 0) {
    return res.status(400).json({ error: 'At least one field is required.' });
  }

  const blocks = loadCoreBlocks();
  if (blocks.find(b => b.name.toLowerCase() === name.trim().toLowerCase())) {
    return res.status(409).json({ error: `Core block '${name}' already exists.` });
  }

  const block = {
    name: name.trim(),
    templates: Array.isArray(templateSlugs) ? templateSlugs : [],
    updated: new Date().toISOString().split('T')[0],
    reviewFlags: [],
    fields,
  };

  blocks.push(block);
  writeCoreBlocks(blocks);

  // Refresh cache
  cache.templates = loadTemplates();
  console.log(`  [Core Block] Created: ${block.name} (${block.fields.length} fields)`);
  res.status(201).json(block);
});

// PUT /api/templates/core-blocks/:name — DS updates a core block; flags affected templates
app.put('/api/templates/core-blocks/:name', (req, res) => {
  if (!req.user || req.user.role !== 'ds') {
    return res.status(403).json({ error: 'Core block updates require DS role.' });
  }

  const blockName = decodeURIComponent(req.params.name);
  const blocks = loadCoreBlocks();
  const index = blocks.findIndex(b => b.name.toLowerCase() === blockName.toLowerCase());

  if (index === -1) {
    return res.status(404).json({ error: `Core block '${blockName}' not found.` });
  }

  const existing = blocks[index];
  const { fields, templates: templateSlugs } = req.body;

  // Track which templates need review (all currently linked templates)
  const affectedTemplates = [...existing.templates];

  if (fields && Array.isArray(fields)) existing.fields = fields;
  if (templateSlugs && Array.isArray(templateSlugs)) existing.templates = templateSlugs;
  existing.updated = new Date().toISOString().split('T')[0];
  existing.reviewFlags = affectedTemplates;

  blocks[index] = existing;
  writeCoreBlocks(blocks);

  // Refresh cache
  cache.templates = loadTemplates();
  console.log(`  [Core Block] Updated: ${existing.name} — ${affectedTemplates.length} template(s) flagged for review`);
  res.json({ ...existing, affectedTemplates });
});

// DELETE /api/templates/core-blocks/:name — DS removes a core block
app.delete('/api/templates/core-blocks/:name', (req, res) => {
  if (!req.user || req.user.role !== 'ds') {
    return res.status(403).json({ error: 'Core block deletion requires DS role.' });
  }

  const blockName = decodeURIComponent(req.params.name);
  const blocks = loadCoreBlocks();
  const index = blocks.findIndex(b => b.name.toLowerCase() === blockName.toLowerCase());

  if (index === -1) {
    return res.status(404).json({ error: `Core block '${blockName}' not found.` });
  }

  const removed = blocks.splice(index, 1)[0];
  writeCoreBlocks(blocks);

  // Refresh cache
  cache.templates = loadTemplates();
  console.log(`  [Core Block] Deleted: ${removed.name}`);
  res.json({ deleted: removed.name, affectedTemplates: removed.templates });
});

// Single template — full content + revenue context
app.get('/api/templates/:slug', (req, res) => {
  const templates = cache.templates || { templates: [] };
  const template = templates.templates.find(t => t.slug === req.params.slug);
  if (!template) {
    return res.status(404).json({ error: `Template '${req.params.slug}' not found` });
  }
  const clients = Array.from(cache.clients.values());
  const revenueContext = buildTemplateRevenueContext([template], clients);
  res.json({ ...template, revenueContext: revenueContext[template.slug] || null });
});

// --- Report Generation ---

const OUTPUTS_DIR = path.resolve(DATA_DIR, 'outputs');
const SAMPLE_DATA_DIR = path.resolve(__dirname, 'generators', 'sample-data');
const THEMES_DIR = path.resolve(__dirname, 'generators', 'themes');

/**
 * Load the sample data JSON for a given template slug.
 * Falls back to pressure_vessel_sample.json for demo purposes.
 */
function loadSampleData(slug) {
  // Try slug-specific file first, fall back to pressure vessel sample
  const slugFile = path.join(SAMPLE_DATA_DIR, `${slug}_sample.json`);
  const fallbackFile = path.join(SAMPLE_DATA_DIR, 'pressure_vessel_sample.json');
  const file = fs.existsSync(slugFile) ? slugFile : fallbackFile;
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

/** Load a theme config by name (defaults to 'default'). */
function loadTheme(themeName) {
  const file = path.join(THEMES_DIR, `${themeName || 'default'}.json`);
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

/**
 * POST /api/templates/:slug/generate
 * Generate report files from a template spec.
 * Query params:
 *   format — 'pptx', 'pdf', or 'both' (default: 'both')
 *   theme  — theme name (default: 'default')
 */
app.post('/api/templates/:slug/generate', async (req, res) => {
  // Inline RBAC — generation requires DS or FDE role
  const allowedRoles = ['ds', 'fde'];
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Report generation requires DS or FDE role.' });
  }

  const { slug } = req.params;
  const format = req.query.format || 'both';
  const themeName = req.query.theme || 'default';

  // Verify template exists
  const templates = cache.templates || { templates: [] };
  const template = templates.templates.find(t => t.slug === slug);
  if (!template) {
    return res.status(404).json({ error: `Template '${slug}' not found` });
  }

  try {
    const data = loadSampleData(slug);
    const theme = loadTheme(themeName);
    const outputDir = path.join(OUTPUTS_DIR, slug);
    const results = { slug, files: [], generatedAt: new Date().toISOString() };

    if (format === 'pptx' || format === 'both') {
      const pptxPath = path.join(outputDir, 'report.pptx');
      await generatePptx(data, theme, pptxPath);
      results.files.push({ format: 'pptx', filename: 'report.pptx', path: `/api/templates/${slug}/output/report.pptx` });
    }

    if (format === 'pdf' || format === 'both') {
      const pdfPath = path.join(outputDir, 'report.pdf');
      await generatePdf(data, theme, pdfPath);
      results.files.push({ format: 'pdf', filename: 'report.pdf', path: `/api/templates/${slug}/output/report.pdf` });
    }

    console.log(`  Generated ${format} report(s) for template: ${slug}`);
    res.json(results);
  } catch (err) {
    console.error(`Report generation failed for ${slug}:`, err.message);
    res.status(500).json({ error: `Generation failed: ${err.message}` });
  }
});

/**
 * GET /api/templates/:slug/output
 * List or download generated report files for a template.
 * Without a filename path param, lists available files.
 */
app.get('/api/templates/:slug/output', (req, res) => {
  const { slug } = req.params;
  const outputDir = path.join(OUTPUTS_DIR, slug);

  if (!fs.existsSync(outputDir)) {
    return res.json({ slug, files: [], message: 'No generated reports yet. Use POST /api/templates/:slug/generate.' });
  }

  const files = fs.readdirSync(outputDir)
    .filter(f => f.endsWith('.pptx') || f.endsWith('.pdf'))
    .map(f => ({
      filename: f,
      format: path.extname(f).slice(1),
      path: `/api/templates/${slug}/output/${f}`,
      size: fs.statSync(path.join(outputDir, f)).size,
    }));

  res.json({ slug, files, generatedAt: files.length > 0 ? fs.statSync(path.join(outputDir, files[0].filename)).mtime.toISOString() : null });
});

/**
 * GET /api/templates/:slug/output/:filename
 * Download a specific generated report file.
 */
app.get('/api/templates/:slug/output/:filename', (req, res) => {
  const { slug, filename } = req.params;

  // Sanitise filename to prevent path traversal
  const safe = path.basename(filename);
  if (safe !== filename) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  const filePath = path.join(OUTPUTS_DIR, slug, safe);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `File '${safe}' not found for template '${slug}'` });
  }

  const ext = path.extname(safe).toLowerCase();
  const mimeTypes = {
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.pdf': 'application/pdf',
  };

  res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
  // Support inline display for PDF preview (default: attachment for download)
  const disposition = req.query.inline === 'true' ? 'inline' : `attachment; filename="${safe}"`;
  res.setHeader('Content-Disposition', disposition);
  fs.createReadStream(filePath).pipe(res);
});

/**
 * POST /api/templates/:slug/request-edit
 * Edit request: accepts a TLDR body (auto-generated from flagged sections on the
 * frontend) and an optional comment. Creates one Linear issue and keeps a local
 * JSON backup.
 *
 * Body: { templateName: string, body: string, comment?: string }
 * Returns: { id, linearIssueId?, linearUrl? }
 */
app.post('/api/templates/:slug/request-edit', express.json(), async (req, res) => {
  const { slug } = req.params;
  const { templateName, body, comment } = req.body;

  if (!body || typeof body !== 'string' || !body.trim()) {
    return res.status(400).json({ error: 'body is required and must be a non-empty string' });
  }

  // --- Local JSON backup (always write, even if Linear fails) ---
  const requestsDir = path.join(__dirname, '..', 'data', 'edit_requests');
  if (!fs.existsSync(requestsDir)) {
    fs.mkdirSync(requestsDir, { recursive: true });
  }

  const requestsFile = path.join(requestsDir, `${slug}.json`);
  const existing = fs.existsSync(requestsFile)
    ? JSON.parse(fs.readFileSync(requestsFile, 'utf-8'))
    : [];

  const id = `EDIT-${slug.toUpperCase().slice(0, 8)}-${existing.length + 1}`;
  const entry = {
    id,
    slug,
    templateName: templateName || slug,
    body: body.trim(),
    comment: comment?.trim() || null,
    status: 'open',
    createdAt: new Date().toISOString(),
  };

  existing.push(entry);
  fs.writeFileSync(requestsFile, JSON.stringify(existing, null, 2));
  console.log(`  [Edit Request] ${id} in ${slug}`);

  // --- Build Linear issue description (TLDR body + optional comment) ---
  const title = `Template Fix: ${templateName || slug}`;
  const description = comment?.trim()
    ? `${body.trim()}\n\n---\n\n**Comment:** ${comment.trim()}`
    : body.trim();

  // --- Call Linear GraphQL API ---
  const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
  if (!LINEAR_API_KEY) {
    console.warn('  [Linear] LINEAR_API_KEY not set — skipping Linear issue creation');
    return res.json({ id, linearIssueId: null, linearUrl: null });
  }

  try {
    // Linear IDs from plan
    const TEAM_ID = 'e8390124-668b-4863-8f68-b7a078cfed05';
    const PROJECT_ID = '79e8551a-380a-4eef-bc62-7cd1d9aee977';
    const ASSIGNEE_ID = '3748ebf7-f071-4ffd-99f9-cfb8c9c88f31';

    // Ensure "Template Fix" label exists, or create it
    const labelId = await ensureLinearLabel(LINEAR_API_KEY, TEAM_ID, 'Template Fix');

    const mutation = `
      mutation IssueCreate($input: IssueCreateInput!) {
        issueCreate(input: $input) {
          success
          issue {
            id
            identifier
            url
          }
        }
      }
    `;

    const variables = {
      input: {
        teamId: TEAM_ID,
        projectId: PROJECT_ID,
        assigneeId: ASSIGNEE_ID,
        title,
        description,
        ...(labelId ? { labelIds: [labelId] } : {}),
      },
    };

    const linearRes = await fetch('https://api.linear.app/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: LINEAR_API_KEY,
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    const linearData = await linearRes.json();
    const issue = linearData?.data?.issueCreate?.issue;

    if (issue) {
      console.log(`  [Linear] Created issue ${issue.identifier}: ${issue.url}`);
      return res.json({ id, linearIssueId: issue.identifier, linearUrl: issue.url });
    } else {
      console.error('  [Linear] Issue creation failed:', JSON.stringify(linearData.errors || linearData));
      return res.json({ id, linearIssueId: null, linearUrl: null, linearError: 'Issue creation failed' });
    }
  } catch (err) {
    console.error('  [Linear] API call failed:', err.message);
    return res.json({ id, linearIssueId: null, linearUrl: null, linearError: err.message });
  }
});

/**
 * Ensure a Linear label with the given name exists on the team.
 * Returns the label ID, or null if creation fails.
 */
async function ensureLinearLabel(apiKey, teamId, labelName) {
  try {
    // Search for existing label
    const searchQuery = `
      query Labels($teamId: String!) {
        issueLabels(filter: { team: { id: { eq: $teamId } } }) {
          nodes { id name }
        }
      }
    `;

    const searchRes = await fetch('https://api.linear.app/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: apiKey },
      body: JSON.stringify({ query: searchQuery, variables: { teamId } }),
    });

    const searchData = await searchRes.json();
    const existing = searchData?.data?.issueLabels?.nodes?.find(
      l => l.name.toLowerCase() === labelName.toLowerCase()
    );
    if (existing) return existing.id;

    // Create the label
    const createQuery = `
      mutation CreateLabel($input: IssueLabelCreateInput!) {
        issueLabelCreate(input: $input) {
          success
          issueLabel { id name }
        }
      }
    `;

    const createRes = await fetch('https://api.linear.app/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: apiKey },
      body: JSON.stringify({
        query: createQuery,
        variables: { input: { teamId, name: labelName, color: '#F97316' } },
      }),
    });

    const createData = await createRes.json();
    return createData?.data?.issueLabelCreate?.issueLabel?.id || null;
  } catch (err) {
    console.error(`  [Linear] Label lookup/creation failed: ${err.message}`);
    return null;
  }
}

// --- Signal Feed Builder ---
function buildSignalFeed(clients, systemLog) {
  const events = [];
  const now = new Date();

  // Pull recent interactions from all clients
  for (const client of clients) {
    for (const interaction of (client.interactionHistory || [])) {
      if (!interaction.date) continue;
      events.push({
        date: interaction.date,
        client: client.name,
        source: interaction.source,
        text: `${client.name}: ${interaction.summary}`,
        icon: mapSourceToIcon(interaction.source),
      });
    }
  }

  // Pull system log entries
  for (const entry of systemLog) {
    if (!entry.date) continue;
    events.push({
      date: entry.date,
      client: null,
      source: entry.type,
      text: entry.description,
      icon: mapTypeToIcon(entry.type),
    });
  }

  // Commercial signals — computed from client data, dated today so they sort to top
  const today = now.toISOString().split('T')[0];
  for (const client of clients) {
    const commercial = client.commercial || {};
    const ds = client.deploymentState || {};
    const issues = client.issueLog || [];

    const renewalDate = commercial.renewalDateParsed ? new Date(commercial.renewalDateParsed) : null;
    const adoptionTarget = commercial.adoptionTarget || null;
    const adoptionPercent = ds.adoptionPercent || null;

    // Renewal signal: renewal <90 days
    if (renewalDate) {
      const daysToRenewal = Math.ceil((renewalDate - now) / (1000 * 60 * 60 * 24));
      if (daysToRenewal > 0 && daysToRenewal < 90) {
        const adoptionText = adoptionPercent !== null && adoptionTarget
          ? ` Adoption at ${adoptionPercent}% (target ${adoptionTarget}%)`
          : '';
        events.push({
          date: today,
          client: client.name,
          source: 'commercial',
          text: `${client.name}: Renewal in ${daysToRenewal} days.${adoptionText}`,
          icon: 'renewal',
        });
      }
    }

    // Expansion criteria met: adoption >= target, no blockers, renewal >90 days
    const openBlockers = issues.filter(i =>
      i.severity === 'blocking' && i.status && !i.status.toLowerCase().includes('resolved')
    );
    const daysToRenewal = renewalDate ? Math.ceil((renewalDate - now) / (1000 * 60 * 60 * 24)) : null;

    if (adoptionTarget && adoptionPercent !== null && adoptionPercent >= adoptionTarget
        && openBlockers.length === 0 && (daysToRenewal === null || daysToRenewal > 90)) {
      const economicBuyer = commercial.economicBuyer || 'economic buyer';
      const expansionPotential = commercial.expansionPotential || '';
      events.push({
        date: today,
        client: client.name,
        source: 'commercial',
        text: `${client.name}: Expansion criteria met. Prepare brief for ${economicBuyer} (${expansionPotential})`,
        icon: 'expansion',
      });
    }

    // Low-adoption-by-type signal: any type >10% below client's overall adoption
    const adoptionByType = ds.adoptionByType || [];
    if (adoptionByType.length > 0 && adoptionPercent !== null) {
      for (const abt of adoptionByType) {
        const gap = adoptionPercent - abt.percent;
        if (gap > 10) {
          const notEngaging = abt.total - abt.active;
          events.push({
            date: today,
            client: client.name,
            source: 'commercial',
            text: `${client.name}: ${abt.type} adoption (${abt.percent}%) is ${gap}% below client average. ${notEngaging} users not engaging`,
            icon: 'alert',
          });
        }
      }
    }
  }

  // Sort newest first, take top 15
  events.sort((a, b) => b.date.localeCompare(a.date));
  const recent = events.slice(0, 15);

  // Add relative time
  return recent.map(event => ({
    ...event,
    time: relativeTime(event.date, now),
  }));
}

function mapSourceToIcon(source) {
  const s = (source || '').toLowerCase();
  if (s.includes('email')) return 'email';
  if (s.includes('call')) return 'call';
  if (s.includes('issue') || s.includes('log_issue')) return 'alert';
  if (s.includes('resolve')) return 'check';
  if (s.includes('milestone')) return 'milestone';
  if (s.includes('status')) return 'chart';
  if (s.includes('deploy') || s.includes('plan')) return 'plan';
  if (s.includes('intel')) return 'search';
  if (s.includes('bd') || s.includes('referral')) return 'inbox';
  return 'activity';
}

function mapTypeToIcon(type) {
  switch ((type || '').toUpperCase()) {
    case 'PIVOT': return 'warning';
    case 'PLAYBOOK': return 'book';
    case 'RULE': return 'shield';
    case 'REVIEW': return 'review';
    case 'INIT': return 'plus';
    default: return 'activity';
  }
}

function relativeTime(dateStr, now) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffHours < 1) return 'just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  return dateStr;
}

// --- Static file serving (production) ---
// Serves the built frontend from frontend/dist/ and handles client-side routing.
const FRONTEND_DIST = path.resolve(__dirname, '..', 'frontend', 'dist');
app.use(express.static(FRONTEND_DIST));
app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
});

// --- Startup ---
loadAllData();

// File watcher
const watcher = chokidar.watch(path.join(DATA_DIR, '**/*.md'), {
  ignoreInitial: true,
  awaitWriteFinish: { stabilityThreshold: 300, pollInterval: 100 },
});

watcher.on('change', reloadFile);
watcher.on('add', reloadFile);
watcher.on('unlink', (filePath) => {
  const relative = path.relative(DATA_DIR, filePath);
  if (relative.startsWith('clients/')) {
    const filename = path.basename(filePath, '.md');
    cache.clients.delete(filename);
    console.log(`  Removed client: ${filename}`);
  }
});

app.listen(PORT, () => {
  const authEnabled = true;
  console.log(`\nDS-OS API server running on http://localhost:${PORT}`);
  console.log(`Auth: ${authEnabled ? 'JWT (Bearer token)' : 'disabled'}`);
  console.log(`Watching ${DATA_DIR} for changes\n`);
  console.log('Public endpoints:');
  console.log(`  GET  /api/health`);
  console.log(`  POST /api/auth/login`);
  console.log('');
  console.log('Authenticated endpoints:');
  console.log(`  GET  /api/overview`);
  console.log(`  GET  /api/clients`);
  console.log(`  GET  /api/clients/:slug   (field-filtered by role)`);
  console.log(`  GET  /api/playbook        (redacted for non-DS roles)`);
  console.log(`  GET  /api/methods`);
  console.log(`  GET  /api/system/log`);
  console.log(`  GET  /api/knowledge`);
  console.log(`  GET  /api/knowledge/:section`);
  console.log(`  GET  /api/audit           (DS-only)`);
  console.log(`  GET  /api/templates/core-blocks      (DS, FDE, Leadership)`);
  console.log(`  POST /api/templates/core-blocks      (DS-only)`);
  console.log(`  PUT  /api/templates/core-blocks/:name (DS-only)`);
  console.log(`  DELETE /api/templates/core-blocks/:name (DS-only)`);
  console.log(`  POST /api/templates/:slug/generate  (DS, FDE)`);
  console.log(`  GET  /api/templates/:slug/output    (DS, FDE)`);
  console.log('');
});
