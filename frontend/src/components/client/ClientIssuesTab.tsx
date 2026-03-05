import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { ClientApiResponse, ClientIssue } from "@/types/client";

const severityClass: Record<string, string> = { blocking: "badge-blocking", degrading: "badge-degrading", minor: "badge-minor" };

function Placeholder() {
  return (
    <div className="rounded-lg border border-border bg-card p-8 text-center">
      <p className="text-sm text-muted-foreground italic">Not yet completed. Run the corresponding slash command to populate Issues.</p>
    </div>
  );
}

export function ClientIssuesTab({ client }: { client: ClientApiResponse }) {
  const issues = client.issueLog || [];
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  if (!client.issueLog) return <Placeholder />;
  if (issues.length === 0) {
    return <div className="text-sm text-muted-foreground py-8 text-center">No issues recorded yet.</div>;
  }

  const filtered = issues.filter((i: ClientIssue) => {
    if (filterStatus !== "all" && !i.status?.toLowerCase().includes(filterStatus.toLowerCase())) return false;
    if (filterSeverity !== "all" && i.severity !== filterSeverity) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "Open", "Resolved"].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`text-xs font-mono px-3 py-1.5 rounded border transition-colors ${filterStatus === s ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
            {s === "all" ? "All Status" : s}
          </button>
        ))}
        <div className="w-px bg-border mx-1" />
        {["all", "blocking", "degrading", "minor"].map(s => (
          <button key={s} onClick={() => setFilterSeverity(s)} className={`text-xs font-mono px-3 py-1.5 rounded border transition-colors ${filterSeverity === s ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
            {s === "all" ? "All Severity" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Issues */}
      <div className="rounded-lg border border-border bg-card divide-y divide-border">
        {filtered.map((issue: ClientIssue) => (
          <div key={issue.id}>
            <button onClick={() => setExpandedId(expandedId === issue.id ? null : issue.id)} className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-secondary/30 transition-colors">
              {expandedId === issue.id ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
              <span className="font-mono text-xs text-muted-foreground w-20 shrink-0">{issue.id}</span>
              <span className="text-sm text-foreground flex-1">{issue.title}</span>
              <span className={`text-[11px] font-mono px-2 py-1 rounded ${severityClass[issue.severity] || "badge-minor"}`}>{issue.severity}</span>
              <span className={`text-[11px] font-mono px-2 py-1 rounded ${issue.status?.toLowerCase().includes("open") ? "badge-at-risk" : "badge-resolved"}`}>{issue.status}</span>
              <span className="text-xs text-muted-foreground ml-2">{issue.logged || issue.date}</span>
            </button>
            {expandedId === issue.id && (
              <div className="px-5 pb-4 pl-14 space-y-3 text-sm">
                {issue.description && <div><span className="text-muted-foreground">Description:</span> <span className="text-foreground">{issue.description}</span></div>}
                {issue.rootCause && <div><span className="text-muted-foreground">Root Cause:</span> <span className="text-foreground">{issue.rootCause}</span></div>}
                {issue.resolution && <div><span className="text-muted-foreground">Resolution:</span> <span className="text-foreground">{issue.resolution}</span></div>}
                {issue.crossClientScan && <div><span className="text-muted-foreground">Cross-Client Scan:</span> <span className="text-foreground">{issue.crossClientScan}</span></div>}
                {issue.playbookUpdate && <div><span className="text-muted-foreground">Playbook Update:</span> <span className="text-foreground">{issue.playbookUpdate}</span></div>}
                {issue.prevention && <div><span className="text-muted-foreground">Prevention:</span> <span className="text-foreground">{issue.prevention}</span></div>}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div className="px-5 py-8 text-center text-sm text-muted-foreground">No issues match filters.</div>}
      </div>
    </div>
  );
}
