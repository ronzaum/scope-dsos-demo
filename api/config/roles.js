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
  ],
  fde: [
    'health', 'overview', 'clients', 'client_detail',
    'methods', 'system_log',
  ],
  ae: [
    'health', 'overview', 'clients', 'client_detail',
  ],
  leadership: [
    'health', 'overview', 'clients', 'playbook',
  ],
  view_only: [
    'health', 'overview',
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
