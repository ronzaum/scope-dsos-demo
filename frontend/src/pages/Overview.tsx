import { Layout } from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Clock, AlertTriangle, Users, FileText, ArrowUpRight, Star } from "lucide-react";
import { useApiData } from "@/hooks/useApiData";
import { FALLBACK_OVERVIEW } from "@/data/fallbacks";
import { useState } from "react";
import { ClientQuickView } from "@/components/ClientQuickView";
import { PriorityQueue } from "@/components/PriorityQueue";

/** Map signal icon names from API to emoji for display */
const signalIcons: Record<string, string> = {
  activity: "📊",
  alert: "⚠️",
  email: "📧",
  check: "✅",
  issue: "🔴",
  renewal: "🔄",
  expansion: "📈",
  commercial: "💰",
};

const healthDot: Record<string, string> = {
  green: "bg-success",
  red: "bg-destructive",
  amber: "bg-warning",
};

const stageClass: Record<string, string> = {
  "Phase 2": "badge-phase2",
  "Phase 1": "badge-phase1",
  "Intake": "badge-intake",
  "At Risk": "badge-at-risk",
};

export default function Overview() {
  const navigate = useNavigate();
  const { data, loading } = useApiData<typeof FALLBACK_OVERVIEW>("/api/overview", FALLBACK_OVERVIEW);
  const [quickViewSlug, setQuickViewSlug] = useState<string | null>(null);

  // weekAtAGlance is frontend-only for now — API doesn't serve it yet, so fall back to static data
  const weekAtAGlance = data.weekAtAGlance ?? FALLBACK_OVERVIEW.weekAtAGlance;

  // Format revenue at risk as "£Xk"
  const revenueAtRisk = data.stats.revenueAtRisk || { total: 0, clientCount: 0 };
  const riskDisplay = revenueAtRisk.total >= 1000
    ? `£${Math.round(revenueAtRisk.total / 1000)}k`
    : `£${revenueAtRisk.total}`;

  const pendingAdoption = data.stats.pendingAdoption || { totalUsers: 0, clientCount: 0 };

  const statCards = [
    { title: "Active Deployments", value: String(data.stats.activeDeployments), label: "clients in pipeline", icon: TrendingUp },
    { title: "Avg Onboarding", value: data.stats.avgOnboarding, label: "intake to Phase 1", icon: Clock },
    { title: "Revenue at Risk", value: riskDisplay, label: `ARR with active risk factors`, icon: AlertTriangle },
    { title: "Pending Adoption", value: String(pendingAdoption.totalUsers), label: `across ${pendingAdoption.clientCount} clients`, icon: Users },
    { title: "Templates per Client", value: String(data.stats.templatesPerClient ?? "—"), label: "avg customisation density", icon: FileText },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-secondary rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-secondary rounded-lg" />
            <div className="h-32 bg-secondary rounded-lg" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => <div key={i} className="h-28 bg-secondary rounded-lg" />)}
          </div>
          <div className="h-64 bg-secondary rounded-lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Deployment operations at a glance</p>
      </div>

      {/* Week at a glance — single card, visually distinct from the rest */}
      {weekAtAGlance && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-4 w-4 text-warning" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">This Week at a Glance</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top priorities */}
            <div>
              <h3 className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">Top Priorities</h3>
              <ul className="space-y-2">
                {weekAtAGlance.priorities.map((p: string, i: number) => (
                  <li key={i} className="text-sm text-foreground leading-relaxed">
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Today — notifications + recent changes */}
            <div>
              <h3 className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">Today</h3>
              <div className="space-y-1.5">
                {weekAtAGlance.notifications.map((n: { time: string; text: string }, i: number) => (
                  <div key={`n-${i}`} className="flex items-start gap-2 text-sm">
                    <span className="text-[10px] font-mono text-muted-foreground mt-0.5 shrink-0 w-12">{n.time}</span>
                    <span className="text-foreground">{n.text}</span>
                  </div>
                ))}
                {weekAtAGlance.recentChanges.slice(0, 2).map((c: { time: string; text: string }, i: number) => (
                  <div key={`c-${i}`} className="flex items-start gap-2 text-sm">
                    <span className="text-[10px] font-mono text-muted-foreground mt-0.5 shrink-0 w-12">{c.time}</span>
                    <span className="text-muted-foreground">{c.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stat cards — 5 across */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((s, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.title}</span>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-semibold font-mono text-foreground">{s.value}</div>
            <div className="flex items-center gap-1.5 mt-2">
              <ArrowUpRight className="h-3 w-3 text-success" />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Priority Queue — prominent between stat cards and charts */}
      {data.priorityQueue && (
        <div className="mb-6">
          <PriorityQueue queue={data.priorityQueue} />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Deployments table */}
        <div className="xl:col-span-2 rounded-lg border border-border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Active Deployments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-medium">Client</th>
                  <th className="text-left px-3 py-3 font-medium">Stage</th>
                  <th className="text-center px-3 py-3 font-medium">Health</th>
                  <th className="text-left px-3 py-3 font-medium">Contract</th>
                  <th className="text-left px-3 py-3 font-medium">Users</th>
                  <th className="text-left px-3 py-3 font-medium">Adoption</th>
                  <th className="text-center px-3 py-3 font-medium">Issues</th>
                  <th className="text-left px-3 py-3 font-medium">Next Action</th>
                </tr>
              </thead>
              <tbody>
                {data.deployments.map((d) => (
                  <tr
                    key={d.slug}
                    onClick={(e) => {
                      // Single click → quick view panel
                      e.stopPropagation();
                      setQuickViewSlug(quickViewSlug === d.slug ? null : d.slug);
                    }}
                    onDoubleClick={() => navigate(`/clients/${d.slug}`)}
                    className="border-b border-border last:border-0 hover:bg-secondary/50 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className="font-medium text-foreground">{d.client}</span>
                      <span className="ml-2 text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-secondary">{d.sector}</span>
                    </td>
                    <td className="px-3 py-4">
                      <span className={`text-[11px] font-mono font-medium px-2 py-1 rounded ${stageClass[d.stage] || "badge-intake"}`}>{d.stage}</span>
                    </td>
                    <td className="px-3 py-4 text-center">
                      <span className={`inline-block h-2.5 w-2.5 rounded-full ${healthDot[d.health] || "bg-muted-foreground"}`} />
                    </td>
                    <td className="px-3 py-4 font-mono text-foreground">{d.contract}</td>
                    <td className="px-3 py-4 font-mono text-muted-foreground">{d.users}</td>
                    <td className="px-3 py-4">
                      {d.adoption !== null ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${d.adoption}%` }} />
                          </div>
                          <span className="text-xs font-mono text-muted-foreground">{d.adoption}%</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-center">
                      <span className={`font-mono text-xs ${d.hasBlocking ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                        {d.openIssues}{d.hasBlocking ? " ⚠" : ""}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-xs text-muted-foreground max-w-[200px] truncate">{d.nextAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signal Feed */}
        <div className="rounded-lg border border-border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Signal Feed</h2>
          </div>
          <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
            {(data.signalFeed || []).slice(0, 15).map((s, i) => (
              <div key={i} className="px-5 py-3 flex gap-3">
                <span className="text-base shrink-0 mt-0.5">{signalIcons[s.icon] || "📋"}</span>
                <div className="min-w-0">
                  <p className="text-xs text-foreground leading-relaxed">{s.text}</p>
                  <span className="text-[10px] font-mono text-muted-foreground mt-1 block">{s.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick-view panel */}
      {quickViewSlug && (
        <ClientQuickView
          slug={quickViewSlug}
          onClose={() => setQuickViewSlug(null)}
          onNavigate={(slug) => navigate(`/clients/${slug}`)}
        />
      )}
    </Layout>
  );
}
