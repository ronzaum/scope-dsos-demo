/**
 * Parser for DS-OS playbook files:
 * - deployment_playbook.md (methods, patterns, client insights, benchmarks)
 * - resolution_patterns.md (resolution patterns by category)
 * - client_type_definitions.md (segmentation rules)
 */

const {
  splitSections,
  parseKeyValueBullets,
  parseTable,
  isPlaceholder,
} = require('./utils');

/**
 * Parse deployment_playbook.md
 */
function parseDeploymentPlaybook(content) {
  const sections = splitSections(content, 2);

  return {
    methods: parsePlaybookMethods(sections.get('Deployment Methods')),
    patterns: parseDeploymentPatterns(sections.get('Deployment Patterns')),
    clientTypeInsights: parseClientTypeInsights(sections.get('Client Type Insights')),
    metricsBenchmarks: parseMetricsBenchmarks(sections.get('Metrics Benchmarks (from deployed clients)')),
  };
}

function parsePlaybookMethods(content) {
  if (!content) return [];
  const subsections = splitSections(content, 3);
  const methods = [];

  for (const [heading, body] of subsections) {
    // "Method 1: Phased Rollout by User Group"
    const nameMatch = heading.match(/Method \d+:\s*(.+)/);
    const fields = parseKeyValueBullets(body);

    methods.push({
      name: nameMatch ? nameMatch[1].trim() : heading,
      whenToUse: fields.whenToUse || '',
      howItWorks: fields.howItWorks || '',
      successRate: fields.successRate || '',
      keyLearning: fields.keyLearning || '',
      risk: fields.risk || '',
      validatedBy: fields.validatedBy || '',
      recommendation: fields.recommendation || '',
    });
  }

  return methods;
}

function parseDeploymentPatterns(content) {
  if (!content) return [];
  const subsections = splitSections(content, 3);
  const patterns = [];

  for (const [heading, body] of subsections) {
    // "Pattern: Template Normalisation"
    const nameMatch = heading.match(/Pattern:\s*(.+)/);
    const fields = parseKeyValueBullets(body);

    patterns.push({
      name: nameMatch ? nameMatch[1].trim() : heading,
      source: fields.source || '',
      appliesWhen: fields.appliesWhen || '',
      pattern: fields.pattern || '',
      recommendedAction: fields.recommendedAction || '',
      confidence: fields.confidence || '',
    });
  }

  return patterns;
}

function parseClientTypeInsights(content) {
  if (!content) return [];
  const subsections = splitSections(content, 3);
  const insights = [];

  for (const [heading, body] of subsections) {
    // Parse bullet points
    const points = body
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().replace(/^-\s+/, ''));

    // Also check for bold-prefixed items
    const boldItems = [];
    const boldRegex = /\*\*([^*]+)\*\*\s*(?:\(([^)]+)\))?:\s*(.+)/g;
    let match;
    while ((match = boldRegex.exec(body)) !== null) {
      boldItems.push({
        label: match[1].trim(),
        qualifier: match[2] || '',
        text: match[3].trim(),
      });
    }

    insights.push({
      name: heading,
      points,
      boldItems,
    });
  }

  return insights;
}

function parseMetricsBenchmarks(content) {
  if (!content) return [];
  return parseTable(content);
}

/**
 * Parse resolution_patterns.md
 */
function parseResolutionPatterns(content) {
  const sections = splitSections(content, 2);
  const allPatterns = [];

  for (const [category, body] of sections) {
    if (isPlaceholder(body)) continue;

    const subsections = splitSections(body, 3);
    for (const [heading, patternBody] of subsections) {
      const fields = parseKeyValueBullets(patternBody);

      allPatterns.push({
        name: heading,
        category,
        source: fields.source || '',
        issueCategory: fields.category || '',
        rootCause: fields.rootCause || '',
        resolutionThatWorks: fields.resolutionThatWorks || '',
        resolutionThatFailed: fields.resolutionThatFailed || '',
        conditions: fields.conditions || '',
        confidence: fields.confidence || '',
        prevention: fields.prevention || '',
      });
    }
  }

  return allPatterns;
}

/**
 * Parse client_type_definitions.md
 */
function parseClientTypeDefinitions(content) {
  const sections = splitSections(content, 2);
  const definitions = {};

  for (const [sectionName, body] of sections) {
    const subsections = splitSections(body, 3);
    const types = [];

    for (const [heading, typeBody] of subsections) {
      const fields = parseKeyValueBullets(typeBody);

      // If no bold keys found, parse as plain bullets
      if (Object.keys(fields).length === 0) {
        const points = typeBody
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.trim().replace(/^-\s+/, ''));

        types.push({ name: heading, points });
      } else {
        types.push({ name: heading, ...fields });
      }
    }

    definitions[sectionName.toLowerCase().replace(/\s+/g, '_')] = types;
  }

  return definitions;
}

/**
 * Build the full playbook response from all three files.
 */
function buildPlaybookResponse(playbookContent, resolutionContent, clientTypesContent) {
  const playbook = parseDeploymentPlaybook(playbookContent);
  const resolutionPatterns = parseResolutionPatterns(resolutionContent);
  const clientTypeDefinitions = parseClientTypeDefinitions(clientTypesContent);

  return {
    deploymentPatterns: playbook.patterns,
    deploymentMethods: playbook.methods,
    resolutionPatterns,
    clientTypeInsights: playbook.clientTypeInsights,
    clientTypeDefinitions,
    metricsBenchmarks: playbook.metricsBenchmarks,
  };
}

module.exports = {
  parseDeploymentPlaybook,
  parseResolutionPatterns,
  parseClientTypeDefinitions,
  buildPlaybookResponse,
};
