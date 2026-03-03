/**
 * Audit logging middleware for DS-OS API.
 *
 * - Logs every request: timestamp, user, role, method, path, status, response time.
 * - Writes to api/logs/audit.log as JSON lines (one JSON object per line).
 * - Provides readAuditLog() for the /api/audit endpoint.
 */

const fs = require('fs');
const path = require('path');

const LOG_DIR = path.resolve(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'audit.log');

/**
 * Ensure the logs directory exists.
 */
function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

/**
 * Append a single audit entry as a JSON line.
 */
function writeEntry(entry) {
  ensureLogDir();
  const line = JSON.stringify(entry) + '\n';
  fs.appendFileSync(LOG_FILE, line, 'utf-8');
}

/**
 * Express middleware — logs every request with timing and user context.
 * Runs first in the stack so it captures auth failures too.
 */
function auditMiddleware(req, res, next) {
  const start = Date.now();

  // Hook into response finish to capture status code and timing
  res.on('finish', () => {
    const entry = {
      timestamp: new Date().toISOString(),
      user: req.user?.name || 'anonymous',
      role: req.user?.role || 'none',
      method: req.method,
      path: req.path,
      status: res.statusCode,
      responseTime: Date.now() - start,
    };

    // Write async — don't block the response
    try {
      writeEntry(entry);
    } catch (err) {
      console.error('Audit log write failed:', err.message);
    }
  });

  next();
}

/**
 * Read the audit log and return recent entries.
 * @param {number} limit - Max entries to return (newest first). Default 100.
 * @returns {Array<Object>} Parsed audit entries
 */
function readAuditLog(limit = 100) {
  if (!fs.existsSync(LOG_FILE)) return [];

  const content = fs.readFileSync(LOG_FILE, 'utf-8').trim();
  if (!content) return [];

  const lines = content.split('\n');
  const entries = [];

  // Parse from the end for newest-first ordering
  for (let i = lines.length - 1; i >= 0 && entries.length < limit; i--) {
    try {
      entries.push(JSON.parse(lines[i]));
    } catch {
      // Skip malformed lines
    }
  }

  return entries;
}

module.exports = { auditMiddleware, readAuditLog };
