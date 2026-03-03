/**
 * Playbook redaction for DS-OS API.
 *
 * Cross-client patterns stay useful, but client names are replaced with
 * anonymous labels (Client A, Client B, ...) for non-DS roles.
 */

const fs = require('fs');
const path = require('path');

const CLIENTS_DIR = path.resolve(__dirname, '..', '..', 'data', 'clients');

// Labels cycle: Client A, Client B, ... Client Z, Client AA, etc.
const LABEL_PREFIX = 'Client ';

/**
 * Build a redaction map from actual client names to anonymous labels.
 * Reads the /data/clients/ directory for filenames.
 *
 * @returns {Map<string, string>} clientName → "Client A" / "Client B" / ...
 */
function buildRedactionMap() {
  const map = new Map();

  if (!fs.existsSync(CLIENTS_DIR)) return map;

  const files = fs.readdirSync(CLIENTS_DIR).filter(f => f.endsWith('.md')).sort();
  let index = 0;

  for (const file of files) {
    const slug = file.replace('.md', '');

    // Read the file's first H1 to get the display name
    const content = fs.readFileSync(path.join(CLIENTS_DIR, file), 'utf-8');
    const nameMatch = content.match(/^# (.+)$/m);
    const displayName = nameMatch ? nameMatch[1].trim() : slug;

    const label = LABEL_PREFIX + indexToLabel(index);

    // Map both the display name and the slug (and common variations)
    map.set(displayName, label);
    map.set(slug, label);
    // Also map the slug with spaces (e.g. "bureau veritas")
    map.set(slug.replace(/_/g, ' '), label);

    index++;
  }

  return map;
}

/**
 * Convert an index to a letter label: 0→A, 1→B, ... 25→Z, 26→AA, etc.
 */
function indexToLabel(index) {
  let label = '';
  let n = index;
  do {
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return label;
}

/**
 * Deep string replacement on any JSON-serialisable object.
 * Replaces all occurrences of client names with their anonymous labels.
 *
 * @param {*} obj - Any JSON value (object, array, string, number, etc.)
 * @param {Map<string, string>} redactionMap - clientName → anonymous label
 * @returns {*} Redacted copy
 */
function redact(obj, redactionMap) {
  if (typeof obj === 'string') {
    let result = obj;
    for (const [name, label] of redactionMap) {
      // Case-insensitive global replacement
      const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      result = result.replace(new RegExp(escaped, 'gi'), label);
    }
    return result;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => redact(item, redactionMap));
  }

  if (obj !== null && typeof obj === 'object') {
    const redacted = {};
    for (const [key, value] of Object.entries(obj)) {
      redacted[key] = redact(value, redactionMap);
    }
    return redacted;
  }

  // Primitives (number, boolean, null) pass through
  return obj;
}

module.exports = { buildRedactionMap, redact };
