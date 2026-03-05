/**
 * Commercial aggregation functions for DS-OS.
 * Computes revenue at risk, pending adoption, urgency scores,
 * proposed actions, effort estimates, and priority queue.
 *
 * All functions operate on parsed client objects from client.js.
 */

/**
 * Compute total revenue at risk across all clients.
 * A client's contract value is at risk if:
 *   - Renewal <90 days AND adoption < target, OR
 *   - Has open blocking issues
 * @param {Object[]} clients - Parsed client objects
 * @param {Date} now - Current date
 * @returns {{ total: number, clients: Array<{ slug, name, contractValue, reason }> }}
 */
function computeRevenueAtRisk(clients, now) {
  const atRisk = [];

  for (const client of clients) {
    const commercial = client.commercial || {};
    const ds = client.deploymentState || {};
    const issues = client.issueLog || [];

    // Parse contract value
    const contractValue = parseMoneyValue(commercial.contractValue || commercial.estimatedValue || '');
    if (!contractValue) continue;

    const reasons = [];

    // Check renewal proximity + adoption gap
    const renewalDate = commercial.renewalDateParsed ? new Date(commercial.renewalDateParsed) : null;
    const daysToRenewal = renewalDate ? Math.ceil((renewalDate - now) / (1000 * 60 * 60 * 24)) : null;
    const adoptionTarget = commercial.adoptionTarget || null;
    const adoptionPercent = ds.adoptionPercent || null;

    if (daysToRenewal !== null && daysToRenewal < 90 && adoptionTarget && adoptionPercent !== null && adoptionPercent < adoptionTarget) {
      reasons.push(`Renewal in ${daysToRenewal}d, adoption ${adoptionPercent}% vs ${adoptionTarget}% target`);
    }

    // Check blocking issues
    const blockingIssues = issues.filter(i =>
      i.severity === 'blocking' && i.status && !i.status.toLowerCase().includes('resolved')
    );
    if (blockingIssues.length > 0) {
      reasons.push(`${blockingIssues.length} blocking issue(s)`);
    }

    if (reasons.length > 0) {
      atRisk.push({
        slug: client.slug,
        name: client.name,
        contractValue,
        reason: reasons.join('; '),
      });
    }
  }

  return {
    total: atRisk.reduce((sum, c) => sum + c.contractValue, 0),
    clients: atRisk,
  };
}

/**
 * Compute pending adoption (users not yet active) across all active deployments.
 * @param {Object[]} clients - Parsed client objects
 * @returns {{ totalUsers: number, clientCount: number, clients: Array<{ slug, name, pendingUsers, blocker }> }}
 */
function computePendingAdoption(clients) {
  const pending = [];

  for (const client of clients) {
    const ds = client.deploymentState || {};
    const stage = (ds.stage || '').toLowerCase();

    // Only count clients with active deployments (not intake/pre-deployment)
    if (stage.includes('intake') || !ds.users || ds.users === 'TBD') continue;

    // Parse total and active users from the users field
    // Pattern: "X inspectors (Y active daily), N supervisors..."
    const totalMatch = ds.users.match(/(\d+)\s*inspectors?/i);
    const activeMatch = ds.users.match(/\((\d+)\s*active/i);

    if (totalMatch && activeMatch) {
      const totalInspectors = parseInt(totalMatch[1], 10);
      const activeInspectors = parseInt(activeMatch[1], 10);
      const pendingUsers = totalInspectors - activeInspectors;

      if (pendingUsers > 0) {
        // Check if there's a blocking issue
        const issues = client.issueLog || [];
        const blocker = issues.find(i =>
          i.severity === 'blocking' && i.status && !i.status.toLowerCase().includes('resolved')
        );

        pending.push({
          slug: client.slug,
          name: client.name,
          pendingUsers,
          blocker: blocker ? `${blocker.id}: ${blocker.title}` : null,
        });
      }
    }
  }

  return {
    totalUsers: pending.reduce((sum, c) => sum + c.pendingUsers, 0),
    clientCount: pending.length,
    clients: pending,
  };
}

/**
 * Compute urgency score for a single client.
 * Weighted composite of: renewal proximity, adoption gap, blocking issues, champion risk.
 * @param {Object} client - Parsed client object
 * @param {Date} now - Current date
 * @returns {{ score: number, factors: string[] }}
 */
function computeUrgencyScore(client, now) {
  const commercial = client.commercial || {};
  const ds = client.deploymentState || {};
  const issues = client.issueLog || [];
  const stakeholders = client.stakeholderMap || [];

  let score = 0;
  const factors = [];

  // Renewal proximity
  const renewalDate = commercial.renewalDateParsed ? new Date(commercial.renewalDateParsed) : null;
  if (renewalDate) {
    const daysToRenewal = Math.ceil((renewalDate - now) / (1000 * 60 * 60 * 24));
    if (daysToRenewal < 30) {
      score += 40;
      factors.push(`Renewal in ${daysToRenewal}d (critical)`);
    } else if (daysToRenewal < 90) {
      score += 25;
      factors.push(`Renewal in ${daysToRenewal}d`);
    }
  }

  // Adoption gap
  const adoptionTarget = commercial.adoptionTarget || null;
  const adoptionPercent = ds.adoptionPercent || null;
  if (adoptionTarget && adoptionPercent !== null) {
    const gap = adoptionTarget - adoptionPercent;
    if (gap > 0) {
      score += Math.min(gap, 30); // Cap at 30 points
      factors.push(`Adoption ${gap}% below target`);
    }
  }

  // Open blocking issues
  const blockingIssues = issues.filter(i =>
    i.severity === 'blocking' && i.status && !i.status.toLowerCase().includes('resolved')
  );
  if (blockingIssues.length > 0) {
    score += blockingIssues.length * 20;
    factors.push(`${blockingIssues.length} blocking issue(s)`);
  }

  // Champion risk — check stakeholder trust levels
  for (const sh of stakeholders) {
    const trust = (sh.trustLevel || '').toLowerCase();
    if (trust.includes('low') || trust.includes('declining') || trust.includes('very low')) {
      score += 15;
      factors.push(`Champion risk: ${sh.name} (trust: ${sh.trustLevel})`);
      break; // Only count once
    }
  }

  return { score, factors };
}

/**
 * Generate a proposed action for a client based on hard rules + playbook pattern matching.
 * @param {Object} client - Parsed client object
 * @param {Object[]} resolutionPatterns - From playbook cache
 * @returns {string} Proposed action text
 */
function generateProposedAction(client, resolutionPatterns) {
  const commercial = client.commercial || {};
  const ds = client.deploymentState || {};
  const issues = client.issueLog || [];
  const stage = (ds.stage || '').toLowerCase();

  const adoptionTarget = commercial.adoptionTarget || null;
  const adoptionPercent = ds.adoptionPercent || null;
  const economicBuyer = commercial.economicBuyer || 'economic buyer';
  const expansionPotential = commercial.expansionPotential || '';

  const openBlockers = issues.filter(i =>
    i.severity === 'blocking' && i.status && !i.status.toLowerCase().includes('resolved')
  );
  const openIssues = issues.filter(i =>
    i.status && !i.status.toLowerCase().includes('resolved')
  );

  const renewalDate = commercial.renewalDateParsed ? new Date(commercial.renewalDateParsed) : null;
  const now = new Date();
  const daysToRenewal = renewalDate ? Math.ceil((renewalDate - now) / (1000 * 60 * 60 * 24)) : null;

  // Hard rules (priority order)
  if (openBlockers.length > 0) {
    const blocker = openBlockers[0];
    let action = `Resolve ${blocker.id}: ${blocker.title}`;

    // Playbook pattern matching — scan for matching issue category
    if (resolutionPatterns && resolutionPatterns.length > 0) {
      const matchingPattern = resolutionPatterns.find(p =>
        blocker.category && p.issueCategory &&
        blocker.category.toLowerCase().includes(p.issueCategory.toLowerCase())
      );
      if (matchingPattern) {
        action += `. Precedent: ${matchingPattern.name} — ${matchingPattern.resolutionThatWorks || 'see playbook'}`;
      }
    }
    return action;
  }

  if (adoptionTarget && adoptionPercent !== null && adoptionPercent < adoptionTarget && daysToRenewal !== null && daysToRenewal < 90) {
    return `Resolve blockers before renewal conversation with ${economicBuyer}`;
  }

  if (stage.includes('stalled')) {
    const phase = ds.phase || 'current phase';
    return `Re-engage champion, unblock ${phase}`;
  }

  if (adoptionTarget && adoptionPercent !== null && adoptionPercent >= adoptionTarget && openBlockers.length === 0) {
    return `Prepare expansion brief for ${economicBuyer} (${expansionPotential})`;
  }

  // Default: if there are open non-blocking issues
  if (openIssues.length > 0) {
    return `Address ${openIssues.length} open issue(s) to maintain momentum`;
  }

  return 'Monitor — on track';
}

/**
 * Estimate effort for a proposed action.
 * @param {string} proposedAction - Action text from generateProposedAction
 * @returns {string} Effort estimate
 */
function estimateEffort(proposedAction) {
  const action = proposedAction.toLowerCase();
  if (action.includes('resolve') && action.includes('issue')) return '2-3 days DS time';
  if (action.includes('resolve') && action.includes('blocker')) return '2-3 days DS time';
  if (action.startsWith('resolve')) return '2-3 days DS time';
  if (action.includes('re-engage') || action.includes('champion')) return '1 day DS + 1 AE call';
  if (action.includes('expansion brief') || action.includes('prepare')) return 'Half day';
  if (action.includes('monitor') || action.includes('on track')) return 'None right now';
  if (action.includes('address')) return '1-2 days DS time';
  if (action.includes('renewal conversation')) return '1 day DS + 1 AE call';
  return '1 day DS time';
}

/**
 * Build the priority queue: urgency-ranked list of all clients with actions.
 * @param {Object[]} clients - Parsed client objects
 * @param {Object[]} resolutionPatterns - From playbook cache
 * @param {Date} now - Current date
 * @returns {Array<{ slug, name, urgency, blocking, proposedAction, effort, factors }>}
 */
function buildPriorityQueue(clients, resolutionPatterns, now) {
  const queue = [];

  for (const client of clients) {
    const { score, factors } = computeUrgencyScore(client, now);
    const proposedAction = generateProposedAction(client, resolutionPatterns);
    const effort = estimateEffort(proposedAction);

    // Determine urgency level from score
    let urgency = 'low';
    if (score >= 50) urgency = 'high';
    else if (score >= 20) urgency = 'medium';

    // Determine blocking text
    const issues = client.issueLog || [];
    const openBlockers = issues.filter(i =>
      i.severity === 'blocking' && i.status && !i.status.toLowerCase().includes('resolved')
    );
    const blocking = openBlockers.length > 0
      ? openBlockers.map(i => `${i.id}: ${i.title}`).join('; ')
      : 'None';

    queue.push({
      slug: client.slug,
      name: client.name,
      urgency,
      score,
      blocking,
      proposedAction,
      effort,
      factors,
    });
  }

  // Sort by score descending
  queue.sort((a, b) => b.score - a.score);
  return queue;
}

/**
 * Parse a money string like "£250,000", "£1.2M", "£400k" into a number.
 * @param {string} str - Money string
 * @returns {number|null}
 */
function parseMoneyValue(str) {
  if (!str) return null;
  const match = str.match(/£([\d,.]+)\s*(k|m|M)?/i);
  if (!match) return null;
  let val = parseFloat(match[1].replace(/,/g, ''));
  const suffix = (match[2] || '').toLowerCase();
  if (suffix === 'k') val *= 1000;
  else if (suffix === 'm') val *= 1000000;
  return val;
}

/**
 * Build a revenue context map: for each template, find clients whose featuresLive
 * text overlaps with the template's inspectionType keywords.
 * @param {Object[]} templates - Parsed template objects (need slug, inspectionType)
 * @param {Object[]} clients - Parsed client objects
 * @returns {Object} Map of templateSlug -> { clients: [{ name, slug, contractValue, userCount, adoptionPercent }] }
 */
function buildTemplateRevenueContext(templates, clients) {
  const context = {};

  for (const template of templates) {
    const type = (template.inspectionType || '').toLowerCase();
    if (!type) continue;

    // Extract keywords from inspection type (e.g. "pressure vessel" -> ["pressure", "vessel"])
    const keywords = type.split(/[\s,/]+/).filter(w => w.length > 2);
    if (keywords.length === 0) continue;

    const matched = [];
    for (const client of clients) {
      const ds = client.deploymentState || {};
      const commercial = client.commercial || {};
      const featuresLive = (ds.featuresLive || '').toLowerCase();

      // Fuzzy match: at least one keyword appears in featuresLive
      const hits = keywords.filter(k => featuresLive.includes(k));
      if (hits.length === 0) continue;

      // Parse contract value and user count
      const contractValue = parseMoneyValue(commercial.contractValue || commercial.estimatedValue || '');
      const totalMatch = (ds.users || '').match(/(\d+)\s*inspectors?/i);
      const userCount = totalMatch ? parseInt(totalMatch[1], 10) : null;

      matched.push({
        name: client.name,
        slug: client.slug,
        contractValue: contractValue || 0,
        userCount,
        adoptionPercent: ds.adoptionPercent || null,
      });
    }

    if (matched.length > 0) {
      context[template.slug] = { clients: matched };
    }
  }

  return context;
}

module.exports = {
  computeRevenueAtRisk,
  computePendingAdoption,
  computeUrgencyScore,
  generateProposedAction,
  estimateEffort,
  buildPriorityQueue,
  buildTemplateRevenueContext,
};
