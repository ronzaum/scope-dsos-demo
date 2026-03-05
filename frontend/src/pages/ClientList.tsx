import { Layout } from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { Users, AlertTriangle } from "lucide-react";
import { useApiData } from "@/hooks/useApiData";
import { Card, CardContent } from "@/components/ui/card";

/** Shape returned by GET /api/clients */
interface ClientSummary {
  client: string;
  slug: string;
  sector: string;
  stage: string;
  health: string;
  contract: string;
  users: string;
  adoption: number | null;
  openIssues: number;
  hasBlocking: boolean;
  nextAction: string;
}

const stageClass: Record<string, string> = {
  "Phase 2": "badge-phase2",
  "Phase 1": "badge-phase1",
  "Intake": "badge-intake",
  "At Risk": "badge-at-risk",
  "Active Deployment": "badge-phase2",
};

const healthLabel: Record<string, { dot: string; text: string }> = {
  green: { dot: "bg-success", text: "Healthy" },
  red: { dot: "bg-destructive", text: "At Risk" },
  amber: { dot: "bg-warning", text: "Attention" },
};

export default function ClientList() {
  const navigate = useNavigate();
  const { data: clients, loading } = useApiData<ClientSummary[]>("/api/clients", []);

  if (loading) {
    return (
      <Layout>
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">All deployment clients</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-secondary rounded-lg animate-pulse" />
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Clients</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {clients.length} deployment{clients.length !== 1 ? "s" : ""} in pipeline
        </p>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No clients yet</p>
          <p className="text-sm mt-1">Run /Start to create your first client file.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {clients.map((c) => {
            const h = healthLabel[c.health] || healthLabel.green;
            return (
              <Card
                key={c.slug}
                onClick={() => navigate(`/clients/${c.slug}`)}
                className="cursor-pointer hover:border-primary/40 transition-colors"
              >
                <CardContent className="p-5">
                  {/* Name + sector */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-foreground truncate">{c.client}</h3>
                      <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-secondary">
                        {c.sector}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`inline-block h-2.5 w-2.5 rounded-full ${h.dot}`} />
                      <span className="text-[10px] font-mono text-muted-foreground">{h.text}</span>
                    </div>
                  </div>

                  {/* Stage + contract */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[11px] font-mono font-medium px-2 py-1 rounded ${stageClass[c.stage] || "badge-intake"}`}>
                      {c.stage}
                    </span>
                    <span className="font-mono text-sm text-foreground">{c.contract}</span>
                  </div>

                  {/* Metrics row */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                    {/* Users */}
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Users</span>
                      <span className="font-mono text-sm text-foreground">{c.users}</span>
                    </div>

                    {/* Adoption */}
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Adoption</span>
                      {c.adoption !== null ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-10 h-1.5 rounded-full bg-secondary overflow-hidden">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${c.adoption}%` }} />
                          </div>
                          <span className="font-mono text-xs text-foreground">{c.adoption}%</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </div>

                    {/* Issues */}
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Issues</span>
                      <span className={`font-mono text-sm ${c.hasBlocking ? "text-destructive font-medium" : "text-foreground"}`}>
                        {c.openIssues}
                        {c.hasBlocking && <AlertTriangle className="inline h-3 w-3 ml-1 -mt-0.5" />}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
