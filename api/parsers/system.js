/**
 * Parser for DS-OS system files:
 * - method_registry.md (deployment methods M-IDs, operational rules R-IDs, change log)
 * - system_log.md (timestamped system events)
 * - architecture.md (system design)
 */

const {
  splitSections,
  parseKeyValueBullets,
  parseTable,
} = require('./utils');

/**
 * Parse method_registry.md
 */
function parseMethodRegistry(content) {
  const sections = splitSections(content, 2);

  return {
    methods: parseMethods(sections.get('Deployment Methods')),
    rules: parseRules(sections.get('Operational Rules')),
    changeLog: parseChangeLog(sections.get('Change Log')),
  };
}

function parseMethods(content) {
  if (!content) return [];
  const subsections = splitSections(content, 3);
  const methods = [];

  for (const [heading, body] of subsections) {
    // "M-001: Phased Rollout by User Group"
    const idMatch = heading.match(/^(M-\d+):\s*(.+)$/);
    if (!idMatch) continue;

    const fields = parseKeyValueBullets(body);

    methods.push({
      id: idMatch[1],
      name: idMatch[2].trim(),
      status: fields.status || '',
      conditions: fields.conditions || '',
      sequence: fields.sequence || '',
      minimumPilotDuration: fields.minimumPilotDuration || '',
      successThresholdForExpansion: fields.successThresholdForExpansion || '',
      restrictionAdded: fields.restrictionAdded || '',
      doNotUseFor: fields.doNotUseFor || '',
      costConsideration: fields.costConsideration || '',
      lastValidated: fields.lastValidated || '',
    });
  }

  return methods;
}

function parseRules(content) {
  if (!content) return [];
  const subsections = splitSections(content, 3);
  const rules = [];

  for (const [heading, body] of subsections) {
    // "R-001: Pilot Before Full Launch"
    const idMatch = heading.match(/^(R-\d+):\s*(.+)$/);
    if (!idMatch) continue;

    const fields = parseKeyValueBullets(body);

    rules.push({
      id: idMatch[1],
      name: idMatch[2].trim(),
      rule: fields.rule || '',
      rationale: fields.rationale || '',
      exceptions: fields.exceptions || '',
    });
  }

  return rules;
}

function parseChangeLog(content) {
  if (!content) return [];
  return parseTable(content);
}

/**
 * Parse system_log.md
 */
function parseSystemLog(content) {
  return parseTable(content);
}

/**
 * Build the full system response.
 */
function buildSystemResponse(registryContent, logContent) {
  const registry = parseMethodRegistry(registryContent);
  const systemLog = parseSystemLog(logContent);

  return {
    methods: registry.methods,
    rules: registry.rules,
    changeLog: registry.changeLog,
    systemLog,
  };
}

module.exports = {
  parseMethodRegistry,
  parseSystemLog,
  buildSystemResponse,
};
