import { IssueResolution } from "@/components/charts/IssueResolution";
import { TrendingUp, TrendingDown, Activity, AlertTriangle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ClientApiResponse, ClientIssue, ClientInteraction } from "@/types/client";

/** Parse "X active daily" or user count from deployment state strings */
function parseActiveUsers(users?: string): { active: number; total: number } | null {
  if (!users) return null;
  const activeMatch = users.match(/(\d+)\s*active\s*daily/i);
  const totalMatch = users.match(/^(\d+)/);
  if (!activeMatch && !totalMatch) return null;
  const total = totalMatch ? parseInt(totalMatch[1]) : 0;
  const active = activeMatch ? parseInt(activeMatch[1]) : total;
  return { active, total };
}

/** Parse "X% reduction" from baseline improvement string */
function parseImprovement(s?: string): number | null {
  if (!s) return null;
  const m = s.match(/(\d+)%/);
  return m ? parseInt(m[1]) : null;
}

/** Derive intervention triggers from interaction history */
function deriveInterventionTriggers(interactions: ClientInteraction[], issues: ClientIssue[]): { date: string; metric: string; action: string; outcome: string }[] {
  const triggers: { date: string; metric: string; action: string; outcome: string }[] = [];

  // Find issue→resolve pairs as intervention triggers
  for (const issue of issues) {
    if (issue.resolutionDate) {
      triggers.push({
        date: issue.logged,
        metric: `${issue.category || "Issue"}: ${issue.severity || "unknown"} severity`,
        action: issue.resolution?.slice(0, 80) || "See issue log",
        outcome: issue.status,
      });
    }
  }

  // Find milestone entries as positive triggers
  for (const entry of interactions) {
    if (entry.source === "Milestone") {
      triggers.push({
        date: entry.date,
        metric: "Milestone reached",
        action: entry.summary?.slice(0, 80) || "",
        outcome: "Achieved",
      });
    }
  }

  return triggers.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
}

/** Renders Profile, Commercial, Deployment State, Quick Metrics, KPIs */
export function ClientOverviewTab({ client }: { client: ClientApiResponse }) {
  const isMobile = useIsMobile();
  const profile = client.profile || {};
  const commercial = client.commercial || {};
  const ds = client.deploymentState || {};
  const issues = client.issueLog || [];
  const interactions = client.interactionHistory || [];
  const adoption = ds.adoptionPercent ?? null;

  // Derive KPI data
  const userMetrics = parseActiveUsers(ds.users);
  const improvement = parseImprovement(ds.baselineImprovement);
  const openIssues = issues.filter((i) => i.status?.toLowerCase().includes("open")).length;
  const resolvedIssues = issues.filter((i) => i.status?.toLowerCase().includes("resolved")).length;
  const resolutionRate = issues.length > 0 ? Math.round((resolvedIssues / issues.length) * 100) : null;
  const interventionTriggers = deriveInterventionTriggers(interactions, issues);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Profile */}
        <InfoCard title="Profile" rows={[
          ["Sector", profile.sector],
          ["Size", profile.size],
          ["Inspection Types", profile.inspectionTypes],
          ["Geography", profile.geography],
          ["Source", profile.source],
          ["Date Created", profile.dateCreated],
        ]} />

        {/* Commercial */}
        <InfoCard title="Commercial" rows={[
          ["Status", commercial.contractStatus],
          ["Value", commercial.contractValue],
          ["Term", commercial.term],
          ["Renewal", commercial.renewalDate],
          ["Economic Buyer", commercial.economicBuyer],
          ["Expansion", commercial.expansionPotential],
          ["Success Criteria", commercial.successCriteria],
        ]} />

        {/* Deployment State */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Deployment State</h3>
          <div className="space-y-3 text-sm">
            <KV label="Stage" value={ds.stage} />
            <KV label="Phase" value={ds.phase} />
            {ds.featuresLive && (
              <div>
                <span className="text-muted-foreground text-xs">Features Live</span>
                <p className="text-foreground text-xs mt-1">{ds.featuresLive}</p>
              </div>
            )}
            <KV label="Users" value={ds.users} />
            {adoption !== null && (
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Adoption</span>
                  <span className="font-mono text-foreground">{adoption}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${adoption}%` }} />
                </div>
              </div>
            )}
            <KV label="Improvement" value={ds.baselineImprovement} />
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Quick Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <Metric label="Adoption" value={adoption !== null ? `${adoption}%` : "—"} />
            <Metric label="Open Issues" value={String(openIssues)} />
            <Metric label="Total Issues" value={String(issues.length)} />
            <Metric label="Interactions" value={String(interactions.length)} />
          </div>
          {issues.length > 0 && (
            <div className="mt-4">
              <IssueResolution issues={issues} />
            </div>
          )}
        </div>
      </div>

      {/* KPI Indicators */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">KPI Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Leading Indicators */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Leading</span>
            </div>
            <div className="space-y-2">
              {userMetrics && (
                <KpiRow
                  label="Daily Active Users"
                  value={`${userMetrics.active}/${userMetrics.total}`}
                  status={userMetrics.active / userMetrics.total >= 0.8 ? "good" : userMetrics.active / userMetrics.total >= 0.5 ? "warn" : "bad"}
                />
              )}
              {adoption !== null && (
                <KpiRow
                  label="Feature Adoption"
                  value={`${adoption}%`}
                  status={adoption >= 80 ? "good" : adoption >= 50 ? "warn" : "bad"}
                />
              )}
              {ds.featuresInPhase2 && (
                <KpiRow
                  label="Phase 2 Features"
                  value={ds.featuresInPhase2.split(",").length + " in progress"}
                  status="neutral"
                />
              )}
            </div>
          </div>

          {/* Lagging Indicators */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lagging</span>
            </div>
            <div className="space-y-2">
              {improvement !== null && (
                <KpiRow
                  label="Report Turnaround Reduction"
                  value={`${improvement}%`}
                  status={improvement >= 40 ? "good" : improvement >= 25 ? "warn" : "bad"}
                />
              )}
              {resolutionRate !== null && (
                <KpiRow
                  label="Issue Resolution Rate"
                  value={`${resolutionRate}%`}
                  status={resolutionRate >= 75 ? "good" : resolutionRate >= 50 ? "warn" : "bad"}
                />
              )}
              <KpiRow
                label="Open Issues"
                value={String(openIssues)}
                status={openIssues === 0 ? "good" : openIssues <= 2 ? "warn" : "bad"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Intervention Trigger Log */}
      {interventionTriggers.length > 0 && (
        <div className="rounded-lg border border-border bg-card">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-warning" />
            <h3 className="text-sm font-semibold text-foreground">Intervention Triggers</h3>
          </div>
          {isMobile ? (
            <div className="divide-y divide-border">
              {interventionTriggers.map((t, i) => (
                <div key={i} className="p-4 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{t.date}</span>
                    <span className={`text-[11px] font-mono px-2 py-1 rounded shrink-0 ${
                      t.outcome.includes("Resolved") || t.outcome === "Achieved" ? "badge-phase2" : "badge-minor"
                    }`}>{t.outcome}</span>
                  </div>
                  <div className="text-xs"><span className="text-muted-foreground">Trigger:</span> <span className="text-foreground">{t.metric}</span></div>
                  <div className="text-xs"><span className="text-muted-foreground">Action:</span> <span className="text-foreground">{t.action}</span></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3 font-medium">Date</th>
                    <th className="text-left px-3 py-3 font-medium">Trigger</th>
                    <th className="text-left px-3 py-3 font-medium">Action</th>
                    <th className="text-left px-3 py-3 font-medium">Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {interventionTriggers.map((t, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{t.date}</td>
                      <td className="px-3 py-3 text-foreground text-xs">{t.metric}</td>
                      <td className="px-3 py-3 text-muted-foreground text-xs max-w-[250px] truncate">{t.action}</td>
                      <td className="px-3 py-3">
                        <span className={`text-[11px] font-mono px-2 py-1 rounded ${
                          t.outcome.includes("Resolved") || t.outcome === "Achieved" ? "badge-phase2" : "badge-minor"
                        }`}>{t.outcome}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Simple key-value pair row */
function KV({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="text-foreground text-right">{value}</span>
    </div>
  );
}

/** Card with title and rows of key-value pairs */
function InfoCard({ title, rows }: { title: string; rows: [string, string | undefined][] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">{title}</h3>
      <div className="space-y-3 text-sm">
        {rows.filter(([, v]) => v).map(([label, value]) => (
          <KV key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  );
}

/** Single metric display */
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-semibold font-mono text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

const kpiStatusDot: Record<string, string> = {
  good: "bg-success",
  warn: "bg-warning",
  bad: "bg-destructive",
  neutral: "bg-muted-foreground",
};

/** KPI indicator row with status dot */
function KpiRow({ label, value, status }: { label: string; value: string; status: "good" | "warn" | "bad" | "neutral" }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${kpiStatusDot[status]}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className="text-xs font-mono text-foreground">{value}</span>
    </div>
  );
}
