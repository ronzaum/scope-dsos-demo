/**
 * Parser for DS-OS client markdown files.
 * Handles all 9 sections: Profile, Commercial, Deployment State, Constraint Map,
 * Deployment Plan, Issue Log, Interaction History, Stakeholder Map, Playbook Contributions.
 */

const {
  splitSections,
  parseKeyValueBullets,
  parseTable,
  isPlaceholder,
  extractTitle,
  toSlug,
  parseSeverity,
  parsePhaseHeading,
} = require('./utils');

/**
 * Parse a complete client markdown file into structured JSON.
 * @param {string} content - Raw markdown content
 * @param {string} filename - Filename (used for slug fallback)
 * @returns {Object} Parsed client data
 */
function parseClientFile(content, filename) {
  const name = extractTitle(content) || filename.replace('.md', '');
  const slug = toSlug(name);
  const sections = splitSections(content, 2);

  return {
    name,
    slug,
    profile: parseProfile(sections.get('Profile')),
    commercial: parseCommercial(sections.get('Commercial')),
    deploymentState: parseDeploymentState(sections.get('Deployment State')),
    constraintMap: parseConstraintMap(sections.get('Constraint Map')),
    deploymentPlan: parseDeploymentPlan(sections.get('Deployment Plan')),
    issueLog: parseIssueLog(sections.get('Issue Log')),
    interactionHistory: parseInteractionHistory(sections.get('Interaction History')),
    stakeholderMap: parseStakeholderMap(sections.get('Stakeholder Map')),
    playbookContributions: parsePlaybookContributions(sections.get('Playbook Contributions')),
  };
}

function parseProfile(content) {
  if (!content || isPlaceholder(content)) return null;
  return parseKeyValueBullets(content);
}

function parseCommercial(content) {
  if (!content || isPlaceholder(content)) return null;
  return parseKeyValueBullets(content);
}

function parseDeploymentState(content) {
  if (!content || isPlaceholder(content)) return null;
  const parsed = parseKeyValueBullets(content);

  // Extract numeric adoption percentage if present
  if (parsed.adoption) {
    const adoptionMatch = parsed.adoption.match(/(\d+)%/);
    if (adoptionMatch) {
      parsed.adoptionPercent = parseInt(adoptionMatch[1], 10);
    }
  }

  return parsed;
}

function parseConstraintMap(content) {
  if (!content || isPlaceholder(content)) return null;

  const subsections = splitSections(content, 3);

  // User Map is a table
  const userMapContent = subsections.get('User Map');
  const userMap = userMapContent ? parseTable(userMapContent) : [];

  // Solutions Audit is a mix of bold key-value and emoji bullets
  const solutionsAuditContent = subsections.get('Solutions Audit');
  const solutionsAudit = parseSolutionsAudit(solutionsAuditContent);

  // Product Match is a table
  const productMatchContent = subsections.get('Product Match');
  const productMatch = productMatchContent ? parseTable(productMatchContent) : [];

  // Wedge use case is a bold-prefixed line after the product match table
  let wedgeUseCase = null;
  if (content) {
    const wedgeMatch = content.match(/\*\*Wedge use case:\*\*\s*(.+)/);
    if (wedgeMatch) wedgeUseCase = wedgeMatch[1].trim();
  }

  return { userMap, solutionsAudit, productMatch, wedgeUseCase };
}

function parseSolutionsAudit(content) {
  if (!content) return { previousTools: '', frictionPoints: [] };

  const toolsMatch = content.match(/\*\*Previous tools:\*\*\s*(.+)/);
  const previousTools = toolsMatch ? toolsMatch[1].trim() : '';

  // Parse friction points with emoji severity
  const frictionPoints = [];
  const frictionRegex = /^-\s+(🔴|🟠|🟢)\s+(.+)$/gm;
  let match;
  while ((match = frictionRegex.exec(content)) !== null) {
    const severity = parseSeverity(match[1]);
    frictionPoints.push({
      severity: severity.level,
      emoji: match[1],
      text: match[2].trim(),
    });
  }

  return { previousTools, frictionPoints };
}

function parseDeploymentPlan(content) {
  if (!content || isPlaceholder(content)) return null;

  const subsections = splitSections(content, 3);
  let method = null;
  const phases = [];
  let riskRegister = [];

  for (const [heading, body] of subsections) {
    if (heading.startsWith('Method:') || heading.startsWith('Method ')) {
      const name = heading.replace(/^Method:\s*/, '').replace(/^Method\s*/, '').trim();
      const rationaleMatch = body.match(/\*\*Rationale:\*\*\s*(.+)/);
      method = {
        name: name || heading,
        rationale: rationaleMatch ? rationaleMatch[1].trim() : '',
      };
    } else if (heading.startsWith('Phase')) {
      const phaseInfo = parsePhaseHeading(heading);
      // Parse bullet items (lines starting with -)
      const items = body
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.trim().replace(/^-\s+/, ''));

      phases.push({ ...phaseInfo, items });
    } else if (heading === 'Risk Register') {
      riskRegister = parseTable(body);
    }
  }

  return { method, phases, riskRegister };
}

function parseIssueLog(content) {
  if (!content || isPlaceholder(content)) return [];

  const subsections = splitSections(content, 3);
  const issues = [];

  for (const [heading, body] of subsections) {
    // Parse heading: "ISSUE-001 | Data format inconsistency..."
    const headingMatch = heading.match(/^(ISSUE-\d+)\s*\|\s*(.+)$/);
    if (!headingMatch) continue;

    const fields = parseKeyValueBullets(body);
    const severity = parseSeverity(fields.severity || '');

    issues.push({
      id: headingMatch[1],
      title: headingMatch[2].trim(),
      status: fields.status || '',
      logged: fields.logged || '',
      source: fields.source || '',
      category: fields.category || '',
      severity: severity.level,
      severityEmoji: severity.emoji,
      severityText: severity.text || '',
      affectedUsers: fields.affectedUsers || '',
      description: fields.description || '',
      resolutionDate: fields.resolutionDate || '',
      crossClientScan: fields.crossClientScan || '',
      rootCause: fields.rootCause || '',
      resolution: fields.resolution || '',
      prevention: fields.prevention || '',
      playbookUpdate: fields.playbookUpdate || '',
      note: fields.note || '',
    });
  }

  return issues;
}

function parseInteractionHistory(content) {
  if (!content || isPlaceholder(content)) return [];
  return parseTable(content);
}

function parseStakeholderMap(content) {
  if (!content || isPlaceholder(content)) return [];
  return parseTable(content);
}

function parsePlaybookContributions(content) {
  if (!content || isPlaceholder(content)) return [];

  // Check for "No contributions yet." type text
  if (content.trim().toLowerCase().includes('no contributions')) return [];

  // Parse: "- 2025-12-18 | "Template normalisation" pattern added..."
  const contributions = [];
  const lines = content.split('\n').filter(line => line.trim().startsWith('-'));

  for (const line of lines) {
    const match = line.match(/^-\s+(\d{4}-\d{2}-\d{2})\s*\|\s*(.+)$/);
    if (match) {
      contributions.push({ date: match[1], description: match[2].trim() });
    } else {
      contributions.push({ date: '', description: line.trim().replace(/^-\s+/, '') });
    }
  }

  return contributions;
}

/**
 * Build a summary object for the overview table from a parsed client.
 */
function buildClientSummary(client) {
  const ds = client.deploymentState || {};
  const commercial = client.commercial || {};
  const issues = client.issueLog || [];

  const openIssues = issues.filter(i => i.status && !i.status.toLowerCase().includes('resolved'));
  const hasBlocking = openIssues.some(i => i.severity === 'blocking');

  // Determine health from stage and issues
  let health = 'green';
  if (hasBlocking) health = 'red';
  else if (ds.stage && ds.stage.toLowerCase().includes('at risk')) health = 'red';
  else if (ds.stage && ds.stage.toLowerCase().includes('stalled')) health = 'red';
  else if (openIssues.some(i => i.severity === 'degrading')) health = 'amber';

  // Determine display stage
  let stage = 'Intake';
  if (ds.phase) {
    if (ds.phase.includes('Phase 1')) stage = 'Phase 1';
    else if (ds.phase.includes('Phase 2')) stage = 'Phase 2';
    else if (ds.phase.includes('Phase 3')) stage = 'Phase 3';
  }
  if (health === 'red' && stage !== 'Intake') stage = 'At Risk';

  // Parse users
  let users = null;
  if (ds.users && ds.users !== 'TBD') {
    const userMatch = ds.users.match(/(\d+)\s*inspectors?\s*\((\d+)\s*active/i);
    if (userMatch) {
      users = `${userMatch[2]}/${parseInt(userMatch[1]) + (parseInt(ds.users.match(/(\d+)\s*supervisors?/)?.[1]) || 0) + (parseInt(ds.users.match(/(\d+)\s*compliance/)?.[1]) || 0)}`;
    }
  }

  // Contract display
  let contract = commercial.contractValue || commercial.estimatedValue || 'Scoping';
  if (contract.includes('£')) {
    const valMatch = contract.match(/£([\d,]+)/);
    if (valMatch) {
      const num = parseInt(valMatch[1].replace(/,/g, ''));
      if (num >= 1000) contract = `£${Math.round(num / 1000)}k`;
    }
  }

  // Next action from most recent interaction
  const interactions = client.interactionHistory || [];
  const lastInteraction = interactions[interactions.length - 1];
  const nextAction = lastInteraction ? lastInteraction.summary.substring(0, 60) : '';

  return {
    client: client.name,
    slug: client.slug,
    sector: client.profile?.sector?.split('.')[0]?.trim() || 'TIC',
    stage,
    health,
    contract,
    users: users || '—',
    adoption: ds.adoptionPercent || null,
    openIssues: openIssues.length,
    hasBlocking,
    nextAction,
  };
}

module.exports = { parseClientFile, buildClientSummary };
