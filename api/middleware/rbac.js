/**
 * Role-Based Access Control middleware for DS-OS API.
 *
 * - Checks req.user.role against endpointAccess from role config.
 * - Returns 403 with a clear message on access denied.
 * - Exports filterClientFields() for stripping fields the role shouldn't see.
 */

const { endpointAccess, routeMap, clientFieldVisibility } = require('../config/roles');

/**
 * Build the endpoint key for a given request.
 * Matches the request method + route path against the routeMap.
 * Falls back to method + path for unrecognised routes.
 */
function resolveEndpointKey(req) {
  // Try exact match first (e.g. "GET /api/overview")
  const exact = `${req.method} ${req.path}`;
  if (routeMap[exact]) return routeMap[exact];

  // Try parameterised match (e.g. /api/clients/bureau_veritas → client_detail)
  if (req.method === 'GET' && req.route?.path === '/api/clients/:slug') {
    return 'client_detail';
  }

  // Fallback: match against route pattern if Express resolved it
  if (req.route) {
    const pattern = `${req.method} ${req.route.path}`;
    if (routeMap[pattern]) return routeMap[pattern];
  }

  return null;
}

/**
 * Express middleware — enforces role-based endpoint access.
 * Must run AFTER authMiddleware (requires req.user).
 */
function rbacMiddleware(req, res, next) {
  // Unauthenticated requests (public routes) pass through — auth.js handles gating.
  if (!req.user) return next();

  const role = req.user.role;
  const endpointKey = resolveEndpointKey(req);

  // If we can't map the route, allow it (don't block unknown routes)
  if (!endpointKey) return next();

  const allowed = endpointAccess[role] || [];
  if (!allowed.includes(endpointKey)) {
    return res.status(403).json({
      error: `Access denied. The '${role}' role does not have permission for this endpoint.`,
    });
  }

  next();
}

/**
 * Filter a client detail object to only include fields visible to the given role.
 * DS sees everything. Other roles get a subset defined in clientFieldVisibility.
 *
 * @param {Object} client - Full parsed client object
 * @param {string} role - User's role
 * @returns {Object} Filtered client object
 */
function filterClientFields(client, role) {
  const visibility = clientFieldVisibility[role];

  // DS gets everything
  if (visibility === '*') return client;

  // No visibility defined — return only name and slug
  if (!visibility || visibility.length === 0) {
    return { name: client.name, slug: client.slug };
  }

  const filtered = {};
  for (const field of visibility) {
    if (client[field] !== undefined) {
      filtered[field] = client[field];
    }
  }
  return filtered;
}

module.exports = { rbacMiddleware, filterClientFields };
