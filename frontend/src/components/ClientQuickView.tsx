import { useEffect, useRef, useState, useCallback } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { ClientApiResponse, ClientIssue, ClientInteraction } from "@/types/client";

interface ClientQuickViewProps {
  slug: string;
  onClose: () => void;
  onNavigate: (slug: string) => void;
}

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

export function ClientQuickView({ slug, onClose, onNavigate }: ClientQuickViewProps) {
  const { apiFetch } = useAuth();
  const [client, setClient] = useState<ClientApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch client detail on slug change
  useEffect(() => {
    setLoading(true);
    apiFetch(`/api/clients/${slug}`)
      .then((data) => setClient(data))
      .catch(() => setClient(null))
      .finally(() => setLoading(false));
  }, [slug, apiFetch]);

  // Close on click-outside
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClickOutside, handleKeyDown]);

  // Derive quick-view data from the API client response
  const name = client?.name || slug;
  const stage = client?.deploymentState?.stage || client?.deploymentState?.phase || "—";
  const health = client?.health || "green";
  const adoption = client?.deploymentState?.adoptionPercent ?? client?.deploymentState?.adoption ?? null;
  const users = client?.deploymentState?.users || "—";
  const contract = client?.commercial?.contractValue || "—";

  // Get recent interactions (last 3)
  const interactions = (client?.interactionHistory || []).slice(0, 3);

  // Count open issues
  const issues = client?.issueLog || [];
  const openIssues = issues.filter((i) => i.status?.toLowerCase().includes("open"));
  const hasBlocking = openIssues.some((i) => i.severity === "blocking");

  return (
    <div
      ref={panelRef}
      className="fixed right-0 top-0 z-50 h-screen w-full sm:w-96 max-w-[100vw] border-l border-border bg-card shadow-2xl overflow-y-auto animate-in slide-in-from-right"
    >
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-sm font-semibold text-foreground truncate">{name}</h2>
          <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded shrink-0 ${stageClass[stage] || "badge-intake"}`}>
            {stage}
          </span>
          <span className={`inline-block h-2 w-2 rounded-full shrink-0 ${healthDot[health] || "bg-muted-foreground"}`} />
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="p-5 space-y-4 animate-pulse">
          {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-secondary rounded" />)}
        </div>
      ) : (
        <div className="p-5 space-y-5">
          {/* Key metrics */}
          <section>
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Key Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              <MetricCard label="Adoption" value={adoption !== null ? `${adoption}%` : "—"} />
              <MetricCard label="Users" value={users} />
              <MetricCard label="Contract" value={contract} />
              <MetricCard label="Open Issues" value={String(openIssues.length)} alert={hasBlocking} />
            </div>
          </section>

          {/* Recent interactions */}
          <section>
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Recent Interactions</h3>
            {interactions.length > 0 ? (
              <div className="space-y-2">
                {interactions.map((ix: ClientInteraction, i: number) => (
                  <div key={i} className="rounded border border-border p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-primary">{ix.source}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{ix.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{ix.summary}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No interactions yet.</p>
            )}
          </section>

          {/* Open issues */}
          {openIssues.length > 0 && (
            <section>
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Open Issues</h3>
              <div className="space-y-2">
                {openIssues.map((issue: ClientIssue, i: number) => (
                  <div key={i} className="rounded border border-border p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-muted-foreground">{issue.id}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap ${
                        issue.severity === "blocking" ? "bg-destructive/20 text-destructive" : "bg-warning/20 text-warning"
                      }`}>
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-xs text-foreground">{issue.title}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Navigate to full detail */}
          <button
            onClick={() => onNavigate(slug)}
            className="w-full text-sm text-primary hover:text-primary/80 font-medium py-2 transition-colors text-center"
          >
            View full detail →
          </button>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <div className="rounded border border-border p-3">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground block mb-1">{label}</span>
      <span className={`text-lg font-mono font-semibold ${alert ? "text-destructive" : "text-foreground"}`}>{value}</span>
    </div>
  );
}
