/**
 * Shared parsing utilities for DS-OS markdown files.
 * Three primitives: section splitting, key-value bullets, markdown tables.
 */

/**
 * Split markdown content by heading level into named sections.
 * @param {string} content - Raw markdown
 * @param {number} level - Heading level (2 for ##, 3 for ###)
 * @returns {Map<string, string>} Map of heading text → section content
 */
function splitSections(content, level = 2) {
  const prefix = '#'.repeat(level) + ' ';
  const lines = content.split('\n');
  const sections = new Map();
  let currentHeading = null;
  let currentLines = [];

  for (const line of lines) {
    if (line.startsWith(prefix)) {
      if (currentHeading !== null) {
        sections.set(currentHeading, currentLines.join('\n').trim());
      }
      currentHeading = line.slice(prefix.length).trim();
      currentLines = [];
    } else if (currentHeading !== null) {
      currentLines.push(line);
    }
  }

  if (currentHeading !== null) {
    sections.set(currentHeading, currentLines.join('\n').trim());
  }

  return sections;
}

/**
 * Parse bullet list with bold keys into an object.
 * Pattern: `- **Key:** Value`
 * @param {string} content - Section content
 * @returns {Object} Parsed key-value pairs with camelCase keys
 */
function parseKeyValueBullets(content) {
  const result = {};
  const regex = /^-\s+\*\*([^*]+)\*\*:\s*(.+)$/gm;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const key = toCamelCase(match[1].trim());
    result[key] = match[2].trim();
  }

  return result;
}

/**
 * Parse a markdown table into an array of objects.
 * @param {string} content - Content containing a markdown table
 * @returns {Array<Object>} Array of row objects with camelCase keys
 */
function parseTable(content) {
  const lines = content.split('\n').filter(line => line.trim().startsWith('|'));
  if (lines.length < 2) return [];

  // First line is headers, second is separator, rest are data
  const headers = parseCells(lines[0]);
  const rows = [];

  for (let i = 2; i < lines.length; i++) {
    const cells = parseCells(lines[i]);
    if (cells.length === 0) continue;

    const row = {};
    headers.forEach((header, index) => {
      row[toCamelCase(header)] = cells[index] || '';
    });
    rows.push(row);
  }

  return rows;
}

/**
 * Parse cells from a single table row.
 */
function parseCells(line) {
  return line
    .split('|')
    .slice(1, -1)  // Remove empty first/last from leading/trailing |
    .map(cell => cell.trim())
    .filter((_, i, arr) => {
      // Filter out separator rows (all dashes)
      if (i === 0 && arr.every(c => /^[-:]+$/.test(c))) return false;
      return true;
    });
}

/**
 * Convert a string to camelCase.
 * "Contract status" → "contractStatus"
 * "Trust Level" → "trustLevel"
 */
function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^[A-Z]/, char => char.toLowerCase());
}

/**
 * Check if section content is a placeholder (italic text indicating not yet completed).
 */
function isPlaceholder(content) {
  if (!content) return true;
  const trimmed = content.trim();
  return trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.startsWith('**');
}

/**
 * Extract the H1 title from markdown content.
 */
function extractTitle(content) {
  const match = content.match(/^# (.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Convert a client name to a URL-safe slug.
 * "Bureau Veritas" → "bureau_veritas"
 * "TÜV SÜD" → "tuv_sud"
 */
function toSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Remove diacritics
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Parse severity from emoji prefix.
 * "🔴 Blocking" → { level: "blocking", emoji: "🔴" }
 * "🟠 Degrading" → { level: "degrading", emoji: "🟠" }
 * "🟢 Minor" → { level: "minor", emoji: "🟢" }
 */
function parseSeverity(text) {
  if (!text) return { level: 'unknown', emoji: '' };
  const clean = text.trim();

  if (clean.includes('🔴')) return { level: 'blocking', emoji: '🔴', text: clean.replace('🔴', '').trim() };
  if (clean.includes('🟠')) return { level: 'degrading', emoji: '🟠', text: clean.replace('🟠', '').trim() };
  if (clean.includes('🟢')) return { level: 'minor', emoji: '🟢', text: clean.replace('🟢', '').trim() };

  return { level: 'unknown', emoji: '', text: clean };
}

/**
 * Parse phase status from text.
 * "Phase 1 — Foundation (Weeks 1-4) ✅ COMPLETE" → { name: "Phase 1 — Foundation", timeline: "Weeks 1-4", status: "COMPLETE" }
 */
function parsePhaseHeading(heading) {
  let status = 'PLANNED';
  if (heading.includes('✅ COMPLETE') || heading.includes('COMPLETE')) status = 'COMPLETE';
  else if (heading.includes('IN PROGRESS')) status = 'IN PROGRESS';
  else if (heading.includes('STALLED')) status = 'STALLED';
  else if (heading.includes('PARTIALLY COMPLETE')) status = 'PARTIALLY COMPLETE';
  else if (heading.includes('ON HOLD')) status = 'ON HOLD';

  // Extract timeline from parentheses
  const timelineMatch = heading.match(/\(([^)]+)\)/);
  const timeline = timelineMatch ? timelineMatch[1] : '';

  // Clean the name
  const name = heading
    .replace(/✅\s*COMPLETE/g, '')
    .replace(/—\s*(IN PROGRESS|PLANNED|STALLED|PARTIALLY COMPLETE|ON HOLD)/g, '')
    .replace(/\([^)]+\)/, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s*—\s*$/, '');

  return { name, timeline, status };
}

module.exports = {
  splitSections,
  parseKeyValueBullets,
  parseTable,
  toCamelCase,
  isPlaceholder,
  extractTitle,
  toSlug,
  parseSeverity,
  parsePhaseHeading,
};
