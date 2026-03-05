/**
 * Template parser for DS-OS API.
 * Parses template markdown files from /data/templates/ into structured JSON.
 * Also parses the template index and pattern analysis files.
 */

const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.resolve(__dirname, '..', '..', 'data', 'templates');

/**
 * Derive problem/fix/success metadata for a template section based on its
 * confidence level, name, and optional reason text. Used by the frontend for
 * tooltips, the review modal, and Linear issue creation.
 *
 * @param {string} sectionName  — human-readable section heading
 * @param {string} confidence   — emoji: 🟢 🟡 🟠
 * @param {string} confidenceLabel — "Regulatory" | "Industry Standard" | "Inferred"
 * @param {string|null} reason  — author-written reason from | suffix in markdown
 * @returns {{ problem: string, recommendedFix: string, successCriteria: string }}
 */
function deriveSectionMeta(sectionName, confidence, confidenceLabel, reason) {
  // Strip "Section N:" prefix for cleaner display
  const shortName = sectionName.replace(/^section\s+\d+:\s*/i, '').trim();

  // --- Problem (<=10 words) ---
  let problem;
  if (reason) {
    // Truncate reason to 10 words max
    const words = reason.split(/\s+/);
    problem = words.length <= 10 ? reason : words.slice(0, 10).join(' ');
  } else if (confidence === '🟠') {
    problem = `${shortName} based on assumptions, not client data`;
  } else if (confidence === '🟡') {
    problem = `${shortName} fields not confirmed by client`;
  } else {
    problem = `${shortName} verified against published standard`;
  }

  // --- Recommended Fix ---
  let recommendedFix;
  if (confidence === '🟠') {
    recommendedFix = `Validate ${shortName} against client's actual workflow`;
  } else if (confidence === '🟡') {
    recommendedFix = `Confirm ${shortName} format with client`;
  } else {
    recommendedFix = 'No action required — regulatory requirement';
  }

  // --- Success Criteria ---
  let successCriteria;
  if (confidence === '🟠') {
    successCriteria = `Fields verified on-site and updated`;
  } else if (confidence === '🟡') {
    successCriteria = `Client confirms ${shortName} fields match their process`;
  } else {
    successCriteria = 'Already compliant with published standard';
  }

  return { problem, recommendedFix, successCriteria };
}

/**
 * Parse a single template markdown file into structured data.
 * Extracts: name, type, standard, status, sections, field counts.
 */
function parseTemplateFile(content, filename) {
  const slug = filename.replace('.md', '');
  const lines = content.split('\n');

  // Extract header metadata from first few lines
  let name = '';
  let inspectionType = '';
  let standard = '';
  let status = 'Draft';
  let created = '';

  // First pass: extract header metadata from first 15 lines (# headings)
  for (const line of lines.slice(0, 15)) {
    if (line.startsWith('# Template Spec:') || line.startsWith('# ')) {
      if (!name) name = line.replace(/^#+\s*/, '').replace('Template Spec:', '').trim();
    }
    if (line.toLowerCase().includes('type:')) {
      inspectionType = line.replace(/.*type:\s*/i, '').trim();
    }
    if (line.toLowerCase().includes('standard:') || line.toLowerCase().includes('primary standard:')) {
      standard = line.replace(/.*standard:\s*/i, '').trim();
    }
    if (line.toLowerCase().includes('status:')) {
      const s = line.toLowerCase();
      if (s.includes('live')) status = 'Live';
      else if (s.includes("qa'd") || s.includes('qa\'d') || s.includes('qa')) status = "QA'd";
      else if (s.includes('complete')) status = 'Complete';
      else status = 'Draft';
    }
    if (line.toLowerCase().includes('created:')) {
      created = line.replace(/.*created:\s*/i, '').trim();
    }
  }

  // Second pass: extract **Inspection type:** and **Primary standard:** from Overview section.
  // These bold-format lines are more specific than the # heading metadata.
  for (const line of lines) {
    if (line.startsWith('**Inspection type:**')) {
      inspectionType = line.replace('**Inspection type:**', '').trim();
    }
    if (line.startsWith('**Primary standard:**')) {
      standard = line.replace('**Primary standard:**', '').trim();
    }
  }

  // Parse sections from ## headings into structured objects.
  // Handles backtick-wrapped confidence tags and optional | reason suffixes.
  // Format: ## Section Name `🟢 Label` | reason text
  // Also extracts field names from each section's table for cross-referencing.
  const sections = [];
  const sectionRegex = /^##\s+(.+?)\s+`([\u{1F7E2}\u{1F7E1}\u{1F7E0}])\s+([^`]+)`(?:\s*\|\s*(.+))?$/u;
  let currentSectionIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('## ') && !line.startsWith('## Overview')) {
      const match = line.match(sectionRegex);
      if (match) {
        const secName = match[1].trim();
        const secConfidence = match[2];
        const secLabel = match[3].trim();
        const secReason = match[4] ? match[4].trim() : null;
        const meta = deriveSectionMeta(secName, secConfidence, secLabel, secReason);

        sections.push({
          name: secName,
          confidence: secConfidence,
          confidenceLabel: secLabel,
          reason: secReason,
          problem: meta.problem,
          recommendedFix: meta.recommendedFix,
          successCriteria: meta.successCriteria,
          fields: [],
        });
        currentSectionIndex = sections.length - 1;
      }
      continue;
    }

    // Extract field names from table rows belonging to the current section.
    // Skips header and separator rows; captures the first cell as the field name.
    if (currentSectionIndex >= 0 && line.trim().startsWith('|')) {
      const cells = line.split('|').map(c => c.trim()).filter(Boolean);
      if (cells.length >= 2 && !line.includes('---')) {
        const fieldName = cells[0].toLowerCase();
        // Skip table header rows (contain generic labels like "field", "tag", "appendix")
        if (!['field', 'tag', 'meaning', 'appendix'].includes(fieldName)) {
          sections[currentSectionIndex].fields.push(cells[0]);
        }
      }
    }
  }

  // Count fields (rows in tables, excluding header rows)
  let fieldCount = 0;
  let inTable = false;
  let headerSkipped = false;
  for (const line of lines) {
    if (line.trim().startsWith('|') && line.includes('|')) {
      if (!inTable) {
        inTable = true;
        headerSkipped = false;
        continue; // header row
      }
      if (!headerSkipped) {
        headerSkipped = true; // separator row
        continue;
      }
      fieldCount++;
    } else {
      inTable = false;
      headerSkipped = false;
    }
  }

  // Derive inspection family from the inspection type for grid grouping.
  // Maps specific types to broader families (e.g. "Pressure Vessel" → "Pressure").
  const inspectionFamily = deriveInspectionFamily(inspectionType);

  return {
    slug,
    name: name || slug.replace(/_/g, ' '),
    inspectionType,
    inspectionFamily,
    standard,
    status,
    created,
    sections,
    fieldCount,
    content,
  };
}

/**
 * Derive a broad inspection family from a specific inspection type string.
 * Used to group template columns in the pattern grid.
 */
function deriveInspectionFamily(inspectionType) {
  const t = (inspectionType || '').toLowerCase();
  if (t.includes('pressure vessel') || t.includes('vessel')) return 'Pressure';
  if (t.includes('pipeline') || t.includes('piping')) return 'Pipeline';
  if (t.includes('storage tank') || t.includes('tank')) return 'Storage Tank';
  if (t.includes('structural') || t.includes('steel')) return 'Structural';
  if (t.includes('electrical')) return 'Electrical';
  if (t.includes('lifting') || t.includes('crane')) return 'Lifting';
  return 'General';
}

/**
 * Parse the template index file to get template listing with status.
 */
function parseTemplateIndex(content) {
  if (!content) return [];

  const templates = [];
  const lines = content.split('\n');
  let inTable = false;
  let headersParsed = false;

  for (const line of lines) {
    if (line.trim().startsWith('|') && line.includes('Inspection Type')) {
      inTable = true;
      continue;
    }
    if (inTable && line.trim().startsWith('|---')) {
      headersParsed = true;
      continue;
    }
    if (inTable && headersParsed && line.trim().startsWith('|')) {
      const cells = line.split('|').map(c => c.trim()).filter(Boolean);
      if (cells.length >= 5) {
        templates.push({
          number: cells[0],
          inspectionType: cells[1],
          standard: cells[2],
          clientContext: cells[3],
          status: cells[4],
          file: cells[5] ? cells[5].replace(/`/g, '') : '',
        });
      }
    } else if (inTable && headersParsed) {
      inTable = false;
    }
  }

  return templates;
}

/**
 * Parse the pattern analysis file (_pattern_analysis.md).
 * Expected format: structured markdown with overlap maps, reusable elements, scalability signals.
 */
function parsePatternAnalysis(content) {
  if (!content) return null;

  const result = {
    overlaps: [],
    reusableElements: [],
    scalabilitySignals: [],
    rawContent: content,
  };

  const lines = content.split('\n');
  let currentSection = '';

  for (const line of lines) {
    if (line.toLowerCase().includes('overlap') && line.startsWith('#')) {
      currentSection = 'overlaps';
      continue;
    }
    if (line.toLowerCase().includes('reusable') && line.startsWith('#')) {
      currentSection = 'reusable';
      continue;
    }
    if (line.toLowerCase().includes('scalab') && line.startsWith('#')) {
      currentSection = 'scalability';
      continue;
    }

    // Parse table rows or bullet items
    if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
      const text = line.replace(/^[\s\-\*]+/, '').trim();
      if (!text) continue;

      switch (currentSection) {
        case 'overlaps':
          result.overlaps.push(text);
          break;
        case 'reusable':
          result.reusableElements.push(text);
          break;
        case 'scalability':
          result.scalabilitySignals.push(text);
          break;
      }
    }

    // Parse table rows
    if (line.trim().startsWith('|') && !line.includes('---') && currentSection) {
      const cells = line.split('|').map(c => c.trim()).filter(Boolean);
      if (cells.length >= 2) {
        switch (currentSection) {
          case 'overlaps':
            result.overlaps.push({ pattern: cells[0], templates: cells.slice(1).join(', ') });
            break;
          case 'reusable':
            result.reusableElements.push({ element: cells[0], count: cells[1], details: cells.slice(2).join(', ') });
            break;
          case 'scalability':
            result.scalabilitySignals.push({ template: cells[0], reusable: cells[1], details: cells.slice(2).join(', ') });
            break;
        }
      }
    }
  }

  return result;
}

/**
 * Normalise a section name for cross-template matching.
 * Strips "Section N:" prefixes, trailing qualifiers, and normalises to lowercase.
 * e.g. "Section 4: Thickness Survey (CML Readings)" → "thickness survey"
 */
function normaliseSectionName(name) {
  return name
    .replace(/^section\s+\d+:\s*/i, '')        // strip "Section N:"
    .replace(/\s*\([^)]*\)\s*/g, '')            // strip parentheticals
    .replace(/\s*&\s*/g, ' and ')               // normalise "&"
    .replace(/\s*\/\s*/g, ' ')                  // normalise "/"
    .replace(/\s+/g, ' ')                       // collapse whitespace
    .trim()
    .toLowerCase();
}

/**
 * Map of known section name synonyms for cross-template matching.
 * Key is the normalised name, value is the canonical name to merge under.
 */
const SECTION_SYNONYMS = {
  'visual findings': 'visual findings',
  'visual external findings': 'visual findings',
  'conclusions': 'conclusions',
  'conclusions and recommendations': 'conclusions',
  'safety devices': 'safety devices',
  'safety systems': 'safety devices',
};

/**
 * Determine match level between two sections based on field overlap.
 * Returns: "identical" (100%), "near-identical" (>75%), "similar" (>40%), "none" (<40%).
 */
function computeMatchLevel(fieldsA, fieldsB) {
  if (fieldsA.length === 0 || fieldsB.length === 0) return { level: 'none', matchedFields: [] };

  const setA = new Set(fieldsA.map(f => f.toLowerCase()));
  const setB = new Set(fieldsB.map(f => f.toLowerCase()));
  const matched = [...setA].filter(f => setB.has(f));
  const unionSize = new Set([...setA, ...setB]).size;
  const ratio = unionSize > 0 ? matched.length / unionSize : 0;

  let level;
  if (ratio >= 1.0) level = 'identical';
  else if (ratio >= 0.75) level = 'near-identical';
  else if (ratio >= 0.4) level = 'similar';
  else level = 'none';

  // Return the original-cased field names that matched
  const matchedOriginal = fieldsA.filter(f => setB.has(f.toLowerCase()));
  return { level, matchedFields: matchedOriginal };
}

/**
 * Build grid-shaped data for the pattern heatmap.
 * Cross-references every template's sections against every other template's sections.
 *
 * Returns: {
 *   sections: string[],          — unique section names (row labels)
 *   templates: { slug, name, inspectionFamily }[], — template metadata (column labels)
 *   cells: { section, template, matchLevel, matchedFields[] }[]
 * }
 */
function parseGridData(templates) {
  if (!templates || templates.length < 2) return null;

  // Build a map of normalised section name → { original name, template slug → fields[] }
  const sectionMap = new Map();

  for (const tmpl of templates) {
    for (const sec of tmpl.sections) {
      const normalised = normaliseSectionName(sec.name);
      const key = SECTION_SYNONYMS[normalised] || normalised;
      if (!sectionMap.has(key)) {
        sectionMap.set(key, { original: sec.name, templates: new Map() });
      }
      sectionMap.get(key).templates.set(tmpl.slug, sec.fields || []);
    }
  }

  // Only include sections that appear in 2+ templates (those are the interesting ones)
  const multiTemplateSections = [...sectionMap.entries()]
    .filter(([, data]) => data.templates.size >= 2);

  // Also include single-template sections for completeness (shows where overlap is absent)
  const allSections = [...sectionMap.entries()];

  const sectionNames = allSections.map(([, data]) => data.original);
  const templateMeta = templates.map(t => ({
    slug: t.slug,
    name: t.name,
    inspectionFamily: t.inspectionFamily,
  }));

  // Build cells: for each section × template pair, compute match against all other templates
  const cells = [];
  for (const [key, data] of allSections) {
    // Get the union of all fields across all templates that have this section
    const allTemplateFields = [...data.templates.entries()];

    for (const tmpl of templates) {
      const myFields = data.templates.get(tmpl.slug);
      if (!myFields) {
        // This template doesn't have this section
        cells.push({
          section: data.original,
          template: tmpl.slug,
          matchLevel: 'none',
          matchedFields: [],
          present: false,
        });
        continue;
      }

      // Compare against the merged field set from OTHER templates that have this section
      const otherFields = allTemplateFields
        .filter(([slug]) => slug !== tmpl.slug)
        .flatMap(([, fields]) => fields);

      if (otherFields.length === 0) {
        // Only this template has this section — mark as unique
        cells.push({
          section: data.original,
          template: tmpl.slug,
          matchLevel: 'unique',
          matchedFields: [],
          present: true,
        });
      } else {
        const { level, matchedFields } = computeMatchLevel(myFields, otherFields);
        cells.push({
          section: data.original,
          template: tmpl.slug,
          matchLevel: level,
          matchedFields,
          present: true,
        });
      }
    }
  }

  return { sections: sectionNames, templates: templateMeta, cells };
}

// --- Core Blocks ---

const CORE_BLOCKS_FILE = path.join(TEMPLATES_DIR, '_core_blocks.md');

/**
 * Parse the core blocks markdown file into structured JSON.
 * Format: each block is an ## heading followed by metadata and a field table.
 *
 * ## Block Name
 * **Templates:** slug1, slug2
 * **Updated:** 2026-03-04
 * **Review flags:** slug3
 *
 * | Field | Type | Required | Notes |
 * |...|...|...|...|
 */
function parseCoreBlocks(content) {
  if (!content) return [];

  const blocks = [];
  const lines = content.split('\n');
  let current = null;

  for (const line of lines) {
    // New block heading
    if (line.startsWith('## ') && !line.startsWith('## Overview')) {
      if (current) blocks.push(current);
      current = {
        name: line.replace(/^##\s+/, '').trim(),
        templates: [],
        updated: '',
        reviewFlags: [],
        fields: [],
      };
      continue;
    }

    if (!current) continue;

    // Metadata lines
    if (line.startsWith('**Templates:**')) {
      current.templates = line.replace('**Templates:**', '').trim()
        .split(',').map(s => s.trim()).filter(Boolean);
    } else if (line.startsWith('**Updated:**')) {
      current.updated = line.replace('**Updated:**', '').trim();
    } else if (line.startsWith('**Review flags:**')) {
      const flags = line.replace('**Review flags:**', '').trim();
      current.reviewFlags = flags && flags !== 'none'
        ? flags.split(',').map(s => s.trim()).filter(Boolean)
        : [];
    }

    // Field table rows (skip header and separator)
    if (line.trim().startsWith('|') && !line.includes('---')) {
      const cells = line.split('|').map(c => c.trim()).filter(Boolean);
      if (cells.length >= 1 && !['field', 'name'].includes(cells[0].toLowerCase())) {
        current.fields.push(cells[0]);
      }
    }
  }

  if (current) blocks.push(current);
  return blocks;
}

/**
 * Serialise a core block object back to markdown for writing to _core_blocks.md.
 */
function serialiseCoreBlock(block) {
  const lines = [
    `## ${block.name}`,
    '',
    `**Templates:** ${block.templates.join(', ')}`,
    `**Updated:** ${block.updated || new Date().toISOString().split('T')[0]}`,
    `**Review flags:** ${block.reviewFlags.length > 0 ? block.reviewFlags.join(', ') : 'none'}`,
    '',
  ];

  if (block.fields && block.fields.length > 0) {
    lines.push('| Field |');
    lines.push('|-------|');
    for (const field of block.fields) {
      lines.push(`| ${field} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Write all core blocks back to _core_blocks.md.
 * Overwrites the file with a fresh header + all block sections.
 */
function writeCoreBlocks(blocks) {
  const header = [
    '# Core Blocks',
    `# Last Updated: ${new Date().toISOString().split('T')[0]}`,
    '',
    '---',
    '',
  ].join('\n');

  const body = blocks.map(serialiseCoreBlock).join('\n---\n\n');
  fs.writeFileSync(CORE_BLOCKS_FILE, header + body, 'utf-8');
}

/**
 * Load core blocks from disk. Returns [] if file doesn't exist.
 */
function loadCoreBlocks() {
  if (!fs.existsSync(CORE_BLOCKS_FILE)) return [];
  const content = fs.readFileSync(CORE_BLOCKS_FILE, 'utf-8');
  return parseCoreBlocks(content);
}

/**
 * Load all templates from the templates directory.
 * Returns { templates: [], patterns: {} | null, grid: {} | null, coreBlocks: [], indexEntries: [] }
 */
function loadTemplates() {
  const result = {
    templates: [],
    patterns: null,
    grid: null,
    coreBlocks: [],
    indexEntries: [],
  };

  if (!fs.existsSync(TEMPLATES_DIR)) return result;

  const files = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const content = fs.readFileSync(path.join(TEMPLATES_DIR, file), 'utf-8');

    if (file === '_template_index.md') {
      result.indexEntries = parseTemplateIndex(content);
      continue;
    }

    if (file === '_pattern_analysis.md') {
      result.patterns = parsePatternAnalysis(content);
      continue;
    }

    if (file === '_core_blocks.md') {
      result.coreBlocks = parseCoreBlocks(content);
      continue;
    }

    // Skip files starting with _ (internal files)
    if (file.startsWith('_')) continue;

    const parsed = parseTemplateFile(content, file);
    result.templates.push(parsed);
  }

  // Build grid data from parsed templates (requires 2+ templates)
  result.grid = parseGridData(result.templates);

  return result;
}

module.exports = {
  parseTemplateFile,
  parseTemplateIndex,
  parsePatternAnalysis,
  parseGridData,
  parseCoreBlocks,
  serialiseCoreBlock,
  writeCoreBlocks,
  loadCoreBlocks,
  loadTemplates,
  deriveSectionMeta,
};
