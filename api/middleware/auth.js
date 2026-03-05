/**
 * JWT authentication middleware for DS-OS API.
 *
 * - Verifies Bearer tokens on all routes except public ones (health, login).
 * - Provides generateToken() for the login endpoint.
 * - Secret from DSOS_JWT_SECRET env var, with a demo fallback.
 */

const jwt = require('jsonwebtoken');
const { validRoles } = require('../config/roles');

// Require DSOS_JWT_SECRET in production; allow demo fallback in development.
const JWT_SECRET = process.env.DSOS_JWT_SECRET || (process.env.NODE_ENV === 'production' ? (() => { throw new Error('DSOS_JWT_SECRET must be set in production'); })() : 'dsos-demo-secret-change-in-production');
const TOKEN_EXPIRY = '8h';

// Routes that skip authentication entirely.
const PUBLIC_ROUTES = ['/api/health', '/api/auth/login'];

/**
 * Generate a signed JWT for a given user.
 * @param {string} name - User's display name
 * @param {string} role - One of the 5 valid roles
 * @returns {string} Signed JWT
 */
function generateToken(name, role) {
  return jwt.sign({ name, role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Express middleware — verifies JWT on non-public routes.
 * Attaches decoded payload to req.user on success.
 */
function authMiddleware(req, res, next) {
  // Skip non-API routes (static files, SPA catch-all) and public API routes
  if (!req.path.startsWith('/api') || PUBLIC_ROUTES.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Provide a Bearer token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Validate that the role in the token is still a recognised role
    if (!validRoles.includes(decoded.role)) {
      return res.status(403).json({ error: `Invalid role '${decoded.role}' in token.` });
    }

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
}

module.exports = { authMiddleware, generateToken };
