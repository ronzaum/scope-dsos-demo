import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useApiData } from "@/hooks/useApiData";
import { useIsMobile } from "@/hooks/use-mobile";
import { FALLBACK_PLAYBOOK, FALLBACK_METHODS } from "@/data/fallbacks";

/** Map known client names to their route slugs */
const CLIENT_SLUGS: Record<string, string> = {
  "Bureau Veritas": "bureau_veritas",
  "BV": "bureau_veritas",
  "TÜV SÜD": "tuv_sud",
  "TUV SUD": "tuv_sud",
  "Intertek": "intertek",
};

const confClass: Record<string, string> = {
  High: "confidence-high",
  Medium: "confidence-medium",
  Low: "confidence-low",
};

/**
 * Parses the source string (e.g. "Bureau Veritas | 2025-12-18" or "Bureau Veritas, TÜV SÜD")
 * and renders client names as links with an optional last-updated date.
 */
function SourceLine({ source }: { source: string }) {
  if (!source) return null;

  // Split on "|" to separate client part from date part
  const pipeIdx = source.indexOf("|");
  const clientPart = pipeIdx !== -1 ? source.slice(0, pipeIdx).trim() : source.trim();
  const datePart = pipeIdx !== -1 ? source.slice(pipeIdx + 1).trim() : "";

  // Split client names on commas and render each as a link if known
  const clientNames = clientPart.split(",").map(s => s.trim()).filter(Boolean);
  const clientLinks = clientNames.map((name, i) => {
    // For resolution patterns: "Client ISSUE-XXX" — strip the issue reference
    const issueIdx = name.indexOf("ISSUE-");
    const cleanName = issueIdx !== -1 ? name.slice(0, issueIdx).trim() : name;
    const slug = CLIENT_SLUGS[cleanName];
    return (
      <span key={i}>
        {i > 0 && ", "}
        {slug ? (
          <Link to={`/clients/${slug}`} className="text-primary hover:underline">{cleanName}</Link>
        ) : (
          <span>{name}</span>
        )}
      </span>
    );
  });

  return (
    <div className="mb-1 space-y-0.5">
      <p className="text-xs text-muted-foreground">Source: {clientLinks}</p>
      {datePart && (
        <p className="text-[10px] text-muted-foreground">Last updated: {datePart}</p>
      )}
    </div>
  );
}

function PatternCard({ name, source, confidence, detail, appliesWhen }: {
  name: string; source: string; confidence: string; detail: string; appliesWhen?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  // Data format: "High (Bureau Veritas: evidence text...)" — split level from evidence
  // so the badge only ever contains the short level word and never overflows its container.
  const parenIdx = confidence.indexOf("(");
  const level = parenIdx !== -1 ? confidence.slice(0, parenIdx).trim() : confidence.trim();
  const evidence = parenIdx !== -1 ? confidence.slice(parenIdx + 1, confidence.lastIndexOf(")")).trim() : "";
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold text-foreground">{name}</h4>
        <span className={`text-[10px] font-mono px-2 py-1 rounded shrink-0 ml-2 ${confClass[level] || "confidence-medium"}`}>{level}</span>
      </div>
      {evidence && <p className="text-[10px] text-muted-foreground mb-1 italic">{evidence}</p>}
      <SourceLine source={source} />
      {appliesWhen && <p className="text-xs text-muted-foreground mb-3 italic">Applies when: {appliesWhen}</p>}
      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
        {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        {expanded ? "Collapse" : "View detail"}
      </button>
      {expanded && <p className="text-sm text-muted-foreground mt-3 leading-relaxed whitespace-pre-line">{detail}</p>}
    </div>
  );
}

/** Maps API method status to badge class */
function methodStatusClass(status: string): string {
  if (status.includes("Default") || status.includes("Recommended")) return "badge-phase2";
  if (status.includes("Restricted")) return "badge-at-risk";
  return "badge-minor";
}

export default function Playbook() {
  const { data: playbook, loading: loadingPB } = useApiData<any>("/api/playbook", FALLBACK_PLAYBOOK);
  const { data: methodsData, loading: loadingM } = useApiData<any>("/api/methods", FALLBACK_METHODS);

  if (loadingPB || loadingM) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-secondary rounded w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-secondary rounded-lg" />)}
          </div>
        </div>
      </Layout>
    );
  }

  const isMobile = useIsMobile();
  const deploymentPatterns = playbook.deploymentPatterns || [];
  const resolutionPatterns = playbook.resolutionPatterns || [];
  const methods = methodsData.methods || [];
  const metricsBenchmarks = playbook.metricsBenchmarks || [];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Field Notes</h1>
        <p className="text-sm text-muted-foreground mt-1">Lessons from the field: what worked, what didn't, what to do next</p>
      </div>

      {/* Deployment Patterns */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Deployment Patterns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deploymentPatterns.map((p: any, i: number) => (
            <PatternCard
              key={i}
              name={p.name}
              source={p.source}
              confidence={p.confidence || "Medium"}
              detail={p.pattern || p.recommendedAction || p.detail || ""}
              appliesWhen={p.appliesWhen}
            />
          ))}
        </div>
      </section>

      {/* Resolution Patterns */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Resolution Patterns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resolutionPatterns.map((p: any, i: number) => (
            <PatternCard
              key={i}
              name={p.name}
              source={p.source || p.category || ""}
              confidence={p.confidence || "Medium"}
              detail={[p.rootCause, p.resolutionThatWorks, p.prevention].filter(Boolean).join("\n\n") || p.pattern || ""}
            />
          ))}
        </div>
      </section>

      {/* Metrics Benchmarks */}
      {metricsBenchmarks.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Metrics Benchmarks</h2>
          {isMobile ? (
            <div className="space-y-3">
              {metricsBenchmarks.map((row: any, i: number) => (
                <div key={i} className="rounded-lg border border-border bg-card p-4 space-y-2">
                  <h4 className="text-sm font-medium text-foreground">{row.metric}</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-muted-foreground">BV (Mo 3):</span> <span className="text-foreground">{row.bureauVeritasMonth3 || row["Bureau Veritas (Month 3)"] || "—"}</span></div>
                    <div><span className="text-muted-foreground">TUV (Mo 5):</span> <span className="text-foreground">{row.tuvSudMonth5 || row["TÜV SÜD (Month 5)"] || "—"}</span></div>
                    <div className="col-span-2"><span className="text-muted-foreground">Target:</span> <span className="text-foreground">{row.target}</span></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3 font-medium">Metric</th>
                    <th className="text-left px-3 py-3 font-medium">Bureau Veritas (Month 3)</th>
                    <th className="text-left px-3 py-3 font-medium">TUV SUD (Month 5)</th>
                    <th className="text-left px-3 py-3 font-medium">Target</th>
                  </tr></thead>
                  <tbody>{metricsBenchmarks.map((row: any, i: number) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 text-foreground font-medium">{row.metric}</td>
                      <td className="px-3 py-3 text-muted-foreground">{row.bureauVeritasMonth3 || row["Bureau Veritas (Month 3)"] || ""}</td>
                      <td className="px-3 py-3 text-muted-foreground">{row.tuvSudMonth5 || row["TÜV SÜD (Month 5)"] || ""}</td>
                      <td className="px-3 py-3 text-muted-foreground">{row.target}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Method Registry */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Method Registry</h2>
        {isMobile ? (
          <div className="space-y-3">
            {methods.map((m: any, i: number) => (
              <div key={i} className="rounded-lg border border-border bg-card p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-medium text-foreground">{m.name || m.method}</h4>
                  <span className={`text-[11px] font-mono px-2 py-1 rounded shrink-0 ${methodStatusClass(m.status)}`}>{m.status}</span>
                </div>
                <div className="text-xs space-y-1">
                  <div><span className="text-muted-foreground">Conditions:</span> <span className="text-foreground">{m.conditions}</span></div>
                  <div><span className="text-muted-foreground">Last Validated:</span> <span className="text-foreground">{m.lastValidated}</span></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-medium">Method</th>
                  <th className="text-left px-3 py-3 font-medium">Status</th>
                  <th className="text-left px-3 py-3 font-medium">Conditions</th>
                  <th className="text-left px-3 py-3 font-medium">Last Validated</th>
                </tr></thead>
                <tbody>{methods.map((m: any, i: number) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 text-foreground font-medium">{m.name || m.method}</td>
                    <td className="px-3 py-3"><span className={`text-[11px] font-mono px-2 py-1 rounded ${methodStatusClass(m.status)}`}>{m.status}</span></td>
                    <td className="px-3 py-3 text-muted-foreground">{m.conditions}</td>
                    <td className="px-3 py-3 text-muted-foreground">{m.lastValidated}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}
      </section>

    </Layout>
  );
}
