import type { ClientApiResponse, ClientStakeholder } from "@/types/client";

const priorityClass: Record<string, string> = {
  Critical: "badge-blocking", High: "badge-phase1", Medium: "badge-minor", Low: "badge-minor",
  "Primary": "badge-blocking", "Secondary": "badge-phase1", "Champion": "badge-phase2",
};

/** Map text trust levels to numeric for the bar display */
function trustToNumber(level: string | number): number {
  if (typeof level === "number") return level;
  const s = String(level).toLowerCase();
  if (s.includes("very high") || s === "5") return 5;
  if (s.includes("high")) return 4;
  if (s.includes("medium-high")) return 4;
  if (s.includes("medium")) return 3;
  if (s.includes("low")) return 2;
  return 3;
}

function Placeholder() {
  return (
    <div className="rounded-lg border border-border bg-card p-8 text-center">
      <p className="text-sm text-muted-foreground italic">Not yet completed. Run the corresponding slash command to populate Stakeholders.</p>
    </div>
  );
}

export function ClientStakeholdersTab({ client }: { client: ClientApiResponse }) {
  const stakeholders = client.stakeholderMap || [];

  if (!client.stakeholderMap) return <Placeholder />;
  if (stakeholders.length === 0) {
    return <div className="text-sm text-muted-foreground py-8 text-center">No stakeholders recorded yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stakeholders.map((s: ClientStakeholder, i: number) => {
        const trust = trustToNumber(s.trustLevel);
        // Extract first word of priority for badge matching
        const priorityKey = s.priority?.split(" ")[0]?.replace("—", "").trim() || "Medium";
        return (
          <div key={i} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-sm font-semibold text-foreground">{s.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{s.role}</p>
              </div>
              {/* Render only the short priority key — full string (e.g. "Primary — exec sponsor") would overflow the flex container */}
              <span className={`text-[10px] font-mono px-2 py-1 rounded shrink-0 ml-2 ${priorityClass[priorityKey] || "badge-minor"}`}>{priorityKey}</span>
            </div>

            {/* Trust Level */}
            <div className="mb-3">
              <span className="text-xs text-muted-foreground">Trust Level: {s.trustLevel}</span>
              <div className="flex gap-1 mt-1.5">
                {[1, 2, 3, 4, 5].map(level => (
                  <div
                    key={level}
                    className={`h-2 flex-1 rounded-sm ${
                      level <= trust
                        ? trust <= 2 ? "bg-destructive" : trust <= 3 ? "bg-warning" : "bg-success"
                        : "bg-secondary"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {s.communicationStyle && <div><span className="text-muted-foreground text-xs">Communication:</span> <span className="text-foreground text-xs">{s.communicationStyle}</span></div>}
              {s.commStyle && <div><span className="text-muted-foreground text-xs">Communication:</span> <span className="text-foreground text-xs">{s.commStyle}</span></div>}
              {s.notes && <div><span className="text-muted-foreground text-xs">Notes:</span> <span className="text-foreground text-xs">{s.notes}</span></div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
