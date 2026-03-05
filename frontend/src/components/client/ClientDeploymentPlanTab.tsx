import { Check, Clock, Circle } from "lucide-react";
import { PhaseTimeline } from "@/components/charts/PhaseTimeline";
import type { ClientApiResponse, DeploymentPhase, DeploymentRisk } from "@/types/client";

/** Maps API phase status strings to normalized keys */
function normalizeStatus(status: string): string {
  const s = status.toUpperCase();
  if (s.includes("COMPLETE")) return "complete";
  if (s.includes("PROGRESS")) return "in-progress";
  return "planned";
}

const statusIcon: Record<string, React.ReactNode> = {
  complete: <Check className="h-4 w-4 text-success" />,
  "in-progress": <Clock className="h-4 w-4 text-warning" />,
  planned: <Circle className="h-4 w-4 text-muted-foreground" />,
};

const statusBg: Record<string, string> = {
  complete: "border-success/30 bg-success/10",
  "in-progress": "border-warning/30 bg-warning/10",
  planned: "border-border bg-card",
};

const riskColor: Record<string, string> = {
  Critical: "badge-blocking", High: "badge-blocking", Medium: "badge-degrading", Low: "badge-minor",
};

const riskStatusColor: Record<string, string> = {
  Active: "badge-at-risk", Mitigated: "badge-phase2", Resolved: "badge-phase2",
  Monitoring: "badge-phase1", Planned: "badge-minor",
};

/** Extracts the first matching status word from a compound status string */
function extractRiskStatus(s: string): string {
  for (const key of Object.keys(riskStatusColor)) {
    if (s.includes(key)) return key;
  }
  return s;
}

function Placeholder({ section }: { section: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-8 text-center">
      <p className="text-sm text-muted-foreground italic">Not yet completed. Run the corresponding slash command to populate {section}.</p>
    </div>
  );
}

export function ClientDeploymentPlanTab({ client }: { client: ClientApiResponse }) {
  const dp = client.deploymentPlan;
  if (!dp) return <Placeholder section="Deployment Plan" />;

  // API returns method as object { name, rationale } or the old string format
  const methodName = typeof dp.method === "object" ? dp.method.name : dp.method;
  const methodRationale = typeof dp.method === "object" ? dp.method.rationale : dp.rationale;
  const phases = dp.phases || [];
  const risks = dp.riskRegister || dp.risks || [];

  return (
    <div className="space-y-6">
      {/* Method */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Deployment Method</h3>
        <p className="text-lg font-semibold text-foreground">{methodName}</p>
        {methodRationale && <p className="text-sm text-muted-foreground mt-2">{methodRationale}</p>}
      </div>

      {/* Phase Timeline Chart */}
      {phases.length > 0 && <PhaseTimeline phases={phases} />}

      {/* Phase Cards */}
      {phases.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Phase Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {phases.map((phase: DeploymentPhase, i: number) => {
              const ns = normalizeStatus(phase.status);
              // API uses `items` array, old format uses `features` array
              const items = phase.items || phase.features || [];
              return (
                <div key={i} className={`rounded-lg border p-4 ${statusBg[ns]}`}>
                  <div className="flex items-center gap-2 mb-3">
                    {statusIcon[ns]}
                    <span className="text-sm font-semibold text-foreground">{phase.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{phase.timeline || phase.duration}</p>
                  <ul className="space-y-1.5">
                    {items.map((f: string, j: number) => (
                      <li key={j} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-muted-foreground mt-1">•</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Risk Register */}
      {risks.length > 0 && (
        <div className="rounded-lg border border-border bg-card">
          <div className="px-5 py-4 border-b border-border"><h3 className="text-sm font-semibold text-foreground">Risk Register</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Risk</th>
                <th className="text-left px-3 py-3 font-medium">Likelihood</th>
                <th className="text-left px-3 py-3 font-medium">Impact</th>
                <th className="text-left px-3 py-3 font-medium">Mitigation</th>
                <th className="text-left px-3 py-3 font-medium">Status</th>
              </tr></thead>
              <tbody>{risks.map((r: DeploymentRisk, i: number) => {
                const st = extractRiskStatus(r.status);
                return (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 text-foreground">{r.risk}</td>
                    <td className="px-3 py-3"><span className={`text-[11px] font-mono px-2 py-1 rounded ${riskColor[r.likelihood] || "badge-minor"}`}>{r.likelihood}</span></td>
                    <td className="px-3 py-3"><span className={`text-[11px] font-mono px-2 py-1 rounded ${riskColor[r.impact] || "badge-minor"}`}>{r.impact}</span></td>
                    <td className="px-3 py-3 text-muted-foreground">{r.mitigation}</td>
                    <td className="px-3 py-3"><span className={`text-[11px] font-mono px-2 py-1 rounded ${riskStatusColor[st] || "badge-minor"}`}>{r.status}</span></td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
