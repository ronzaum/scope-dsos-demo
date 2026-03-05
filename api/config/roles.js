/**
 * Role configuration for DS-OS API.
 * Maps the 5 roles from CLAUDE.md to endpoint access and field visibility.
 *
 * Roles:
 *   ds            — Deployment Strategist (full access)
 *   fde           — Forward Deployed Engineer (technical scope)
 *   ae            — Account Executive (commercial scope)
 *   leadership    — Leadership (overview + playbook)
 *   view_only     — View Only (dashboard only)
 */

// --- Endpoint access by role ---
// Each role lists the endpoint keys it can reach.
const endpointAccess = {
  ds: [
    'health', 'overview', 'clients', 'client_detail',
    'playbook', 'methods', 'system_log', 'audit',
    'templates', 'template_detail', 'template_patterns',
    'template_generate', 'template_output',
    'core_blocks', 'core_blocks_write',
    'knowledge', 'knowledge_section',
  ],
  fde: [
    'health', 'overview', 'clients', 'client_detail',
    'methods', 'system_log', 'templates', 'template_detail',
    'template_generate', 'template_output',
    'core_blocks',
    'knowledge', 'knowledge_section',
  ],
  ae: [
    'health', 'overview', 'clients', 'client_detail',
    'knowledge', 'knowledge_section',
  ],
  leadership: [
    'health', 'overview', 'clients', 'playbook', 'templates',
    'core_blocks',
    'knowledge', 'knowledge_section',
  ],
  view_only: [
    'health', 'overview',
    'knowledge', 'knowledge_section',
  ],
};

// --- Route-to-endpoint key mapping ---
// Maps Express route paths to the endpoint keys used in endpointAccess.
const routeMap = {
  'GET /api/health':       'health',
  'GET /api/overview':     'overview',
  'GET /api/clients':      'clients',
  'GET /api/clients/:slug': 'client_detail',
  'GET /api/playbook':     'playbook',
  'GET /api/methods':      'methods',
  'GET /api/system/log':   'system_log',
  'GET /api/audit':        'audit',
  'GET /api/templates':    'templates',
  'GET /api/templates/:slug': 'template_detail',
  'GET /api/templates/patterns': 'template_patterns',
  'GET /api/templates/core-blocks': 'core_blocks',
  'POST /api/templates/core-blocks': 'core_blocks_write',
  'PUT /api/templates/core-blocks/:name': 'core_blocks_write',
  'DELETE /api/templates/core-blocks/:name': 'core_blocks_write',
  'POST /api/templates/:slug/generate': 'template_generate',
  'GET /api/templates/:slug/output': 'template_output',
  'GET /api/knowledge':              'knowledge',
  'GET /api/knowledge/:section':     'knowledge_section',
};

// --- Per-role field visibility for client detail ---
// DS sees everything. Other roles get a filtered view.
const clientFieldVisibility = {
  ds: '*',  // all fields
  fde: [
    'name', 'slug', 'profile', 'deploymentState',
    'constraintMap', 'issueLog', 'interactionHistory',
  ],
  ae: [
    'name', 'slug', 'profile', 'commercial',
    'deploymentState', 'interactionHistory', 'stakeholderMap',
  ],
  leadership: [
    'name', 'slug', 'profile', 'commercial',
    'deploymentState', 'playbookContributions',
  ],
  view_only: [],  // no client detail access (blocked at endpoint level)
};

// --- Valid role names ---
const validRoles = Object.keys(endpointAccess);

module.exports = {
  endpointAccess,
  routeMap,
  clientFieldVisibility,
  validRoles,
};
