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

const express = require('express');
const cors = require('cors');
const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');

const { parseClientFile, buildClientSummary } = require('./parsers/client');
const { buildPlaybookResponse } = require('./parsers/playbook');
const { buildSystemResponse } = require('./parsers/system');

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
    }
  } else if (relative.startsWith('system/')) {
    const registryContent = readFile(path.join(DATA_DIR, 'system', 'method_registry.md'));
    const logContent = readFile(path.join(DATA_DIR, 'system', 'system_log.md'));
    if (registryContent && logContent) {
      cache.system = buildSystemResponse(registryContent, logContent);
      console.log('  Reloaded system');
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
  const activeCount = clients.length;
  const playbookEntries = (cache.playbook?.deploymentPatterns?.length || 0)
    + (cache.playbook?.resolutionPatterns?.length || 0);

  // Avg onboarding — compute from date created to first milestone/phase start
  // For clients with interaction history, find the gap between creation and first "Phase 1" or "Milestone"
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

  // Inspection improvement — use best healthy client's improvement (exclude stalled/at-risk)
  const healthyImprovements = clients
    .filter(c => {
      const stage = c.deploymentState?.stage?.toLowerCase() || '';
      return !stage.includes('stalled') && !stage.includes('at risk') && !stage.includes('intake');
    })
    .map(c => c.deploymentState?.baselineImprovement)
    .filter(Boolean)
    .map(v => {
      const match = v.match(/(\d+)%/);
      return match ? parseInt(match[1]) : null;
    })
    .filter(v => v !== null);
  const avgImprovement = healthyImprovements.length > 0
    ? `${Math.round(healthyImprovements.reduce((a, b) => a + b, 0) / healthyImprovements.length)}%`
    : '—';

  // Signal feed — combine recent interactions across all clients + system log
  const signals = buildSignalFeed(clients, cache.system?.systemLog || []);

  res.json({
    stats: {
      activeDeployments: activeCount,
      avgOnboarding,
      inspectionImprovement: avgImprovement,
      playbookEntries,
    },
    deployments: summaries,
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

// Playbook (patterns + methods + insights) — redacted for non-DS roles
app.get('/api/playbook', (req, res) => {
  if (!cache.playbook) {
    return res.status(503).json({ error: 'Playbook data not loaded' });
  }

  // DS sees raw playbook. Everyone else gets client names redacted.
  if (req.user.role === 'ds') {
    return res.json(cache.playbook);
  }

  const redactionMap = buildRedactionMap();
  const redacted = redact(cache.playbook, redactionMap);
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
  console.log(`  GET  /api/audit           (DS-only)`);
  console.log('');
});
