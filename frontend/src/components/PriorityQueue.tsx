import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export interface PriorityQueueItem {
  slug: string;
  name: string;
  urgency: "high" | "medium" | "low";
  score: number;
  blocking: string;
  proposedAction: string;
  effort: string;
  factors: string[];
}

const urgencyBadge: Record<string, { bg: string; text: string; label: string }> = {
  high:   { bg: "bg-destructive/15", text: "text-destructive", label: "High" },
  medium: { bg: "bg-warning/15", text: "text-warning", label: "Medium" },
  low:    { bg: "bg-success/15", text: "text-success", label: "Low" },
};

const effortColor: Record<string, string> = {
  "none right now": "bg-success/10 text-success",
  "half day": "bg-primary/10 text-primary",
};

export function PriorityQueue({ queue }: { queue: PriorityQueueItem[] }) {
  const navigate = useNavigate();

  if (!queue || queue.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Priority Queue</h2>
        <div className="flex items-center gap-2 text-sm text-success">
          <CheckCircle2 className="h-4 w-4" />
          <span>All clients on track</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Priority Queue</h2>
      </div>

      <div className="divide-y divide-border">
        {queue.map((item) => {
          const badge = urgencyBadge[item.urgency] || urgencyBadge.low;
          const effortStyle = effortColor[item.effort.toLowerCase()] || "bg-secondary text-muted-foreground";

          return (
            <div key={item.slug} className="px-5 py-4 space-y-2">
              {/* Top row: name + urgency badge + effort pill */}
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => navigate(`/clients/${item.slug}`)}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </button>
                <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${badge.bg} ${badge.text}`}>
                  {badge.label}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ml-auto ${effortStyle}`}>
                  {item.effort}
                </span>
              </div>

              {/* Blocking + Proposed Action */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Blocking</span>
                  <p className={`text-xs mt-0.5 ${item.blocking === "None" ? "text-muted-foreground" : "text-destructive"}`}>
                    {item.blocking}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Proposed Action</span>
                  <p className="text-xs text-foreground mt-0.5">{item.proposedAction}</p>
                </div>
              </div>

              {/* Factors sub-text */}
              {item.factors.length > 0 && (
                <p className="text-[10px] text-muted-foreground">
                  {item.factors.join(" · ")}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
