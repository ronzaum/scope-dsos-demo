import { Phone, Mail, Wrench, MapPin, FileText, Flag, AlertCircle, GitBranch } from "lucide-react";
import type { ClientApiResponse, ClientInteraction } from "@/types/client";

/** Map interaction source types to icons */
const sourceIcon: Record<string, React.ReactNode> = {
  Call: <Phone className="h-3.5 w-3.5" />,
  Email: <Mail className="h-3.5 w-3.5" />,
  Support: <Wrench className="h-3.5 w-3.5" />,
  "On-site": <MapPin className="h-3.5 w-3.5" />,
  Internal: <FileText className="h-3.5 w-3.5" />,
  Milestone: <Flag className="h-3.5 w-3.5" />,
  Log_Issue: <AlertCircle className="h-3.5 w-3.5" />,
  Resolve: <GitBranch className="h-3.5 w-3.5" />,
  Client_Intel: <FileText className="h-3.5 w-3.5" />,
  Constraint_Map: <FileText className="h-3.5 w-3.5" />,
  Deploy_Plan: <FileText className="h-3.5 w-3.5" />,
  "BD referral": <Mail className="h-3.5 w-3.5" />,
  "Status review": <FileText className="h-3.5 w-3.5" />,
};

function Placeholder() {
  return (
    <div className="rounded-lg border border-border bg-card p-8 text-center">
      <p className="text-sm text-muted-foreground italic">Not yet completed. Run the corresponding slash command to populate Interactions.</p>
    </div>
  );
}

export function ClientInteractionsTab({ client }: { client: ClientApiResponse }) {
  const interactions = client.interactionHistory || [];

  if (!client.interactionHistory) return <Placeholder />;
  if (interactions.length === 0) {
    return <div className="text-sm text-muted-foreground py-8 text-center">No interactions recorded yet.</div>;
  }

  // Show newest first
  const sorted = [...interactions].reverse();

  return (
    <div className="relative pl-6">
      <div className="absolute left-2.5 top-2 bottom-2 w-px bg-border" />
      <div className="space-y-0">
        {sorted.map((int: ClientInteraction, i: number) => (
          <div key={i} className="relative flex gap-4 pb-6">
            <div className="absolute left-[-14px] top-1.5 h-5 w-5 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground">
              {sourceIcon[int.source] || <FileText className="h-3.5 w-3.5" />}
            </div>
            <div className="ml-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-muted-foreground">{int.date}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{int.source}</span>
              </div>
              <p className="text-sm text-foreground">{int.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
