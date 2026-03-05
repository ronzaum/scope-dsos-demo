import { Layout } from "@/components/Layout";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { ClientOverviewTab } from "@/components/client/ClientOverviewTab";
import { ClientConstraintMapTab } from "@/components/client/ClientConstraintMapTab";
import { ClientDeploymentPlanTab } from "@/components/client/ClientDeploymentPlanTab";
import { ClientIssuesTab } from "@/components/client/ClientIssuesTab";
import { ClientInteractionsTab } from "@/components/client/ClientInteractionsTab";
import { ClientStakeholdersTab } from "@/components/client/ClientStakeholdersTab";
import { useApiData } from "@/hooks/useApiData";
import { FALLBACK_CLIENT } from "@/data/fallbacks";
import type { ClientApiResponse } from "@/types/client";

const tabs = ["Overview", "Constraint Map", "Deployment Plan", "Issues", "Interactions", "Stakeholders"];

const stageClass: Record<string, string> = {
  "Phase 2": "badge-phase2",
  "Phase 1": "badge-phase1",
  "Intake": "badge-intake",
  "At Risk": "badge-at-risk",
  "Active Deployment": "badge-phase2",
};

const healthDot: Record<string, string> = {
  green: "bg-success",
  red: "bg-destructive",
  amber: "bg-warning",
};

export default function ClientDetail() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("Overview");
  const { data: client, loading } = useApiData<ClientApiResponse | null>(`/api/clients/${slug}`, FALLBACK_CLIENT);

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-secondary rounded w-64" />
          <div className="h-10 bg-secondary rounded w-full" />
          <div className="h-96 bg-secondary rounded" />
        </div>
      </Layout>
    );
  }

  if (!client) {
    return (
      <Layout>
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg font-medium">Client not found</p>
          <p className="text-sm mt-2">No data available for this client. Run the corresponding slash command to populate.</p>
        </div>
      </Layout>
    );
  }

  const stage = client.deploymentState?.stage || client.deploymentState?.phase || "—";
  const health = client.health || "green";
  const contract = client.commercial?.contractValue || "—";

  return (
    <Layout>
      {/* Back link */}
      <Link to="/clients" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
        <ChevronLeft className="h-4 w-4" />
        All Clients
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-2xl font-semibold text-foreground">{client.name}</h1>
        <span className={`text-[11px] font-mono font-medium px-2 py-1 rounded ${stageClass[stage] || "badge-intake"}`}>
          {stage}
        </span>
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${healthDot[health]}`} />
        <span className="font-mono text-sm text-muted-foreground ml-auto">{contract}</span>
        <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/30">
          Editing as: Deployment Strategist
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Overview" && <ClientOverviewTab client={client} />}
      {activeTab === "Constraint Map" && <ClientConstraintMapTab client={client} />}
      {activeTab === "Deployment Plan" && <ClientDeploymentPlanTab client={client} />}
      {activeTab === "Issues" && <ClientIssuesTab client={client} />}
      {activeTab === "Interactions" && <ClientInteractionsTab client={client} />}
      {activeTab === "Stakeholders" && <ClientStakeholdersTab client={client} />}
    </Layout>
  );
}
