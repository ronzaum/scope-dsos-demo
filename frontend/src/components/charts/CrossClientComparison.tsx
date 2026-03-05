import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { CHART_COLORS } from "./ChartTheme";

interface Deployment {
  client: string;
  adoption: number | null;
  openIssues: number;
}

interface Props {
  deployments: Deployment[];
}

/** Bar chart comparing adoption and issues across clients */
export function CrossClientComparison({ deployments }: Props) {
  if (!deployments || deployments.length === 0) return null;

  const data = deployments
    .filter(d => d.adoption !== null)
    .map(d => ({
      name: d.client.length > 12 ? d.client.slice(0, 12) + "…" : d.client,
      adoption: d.adoption,
      issues: d.openIssues,
    }));

  if (data.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">Cross-Client Comparison</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <XAxis dataKey="name" tick={{ fill: CHART_COLORS.text, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: CHART_COLORS.text, fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: CHART_COLORS.bg, border: "1px solid hsl(215,20%,25%)", borderRadius: 6, fontSize: 11 }}
            itemStyle={{ color: CHART_COLORS.text }}
          />
          <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 10, color: CHART_COLORS.text }} />
          <Bar dataKey="adoption" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} isAnimationActive={false} name="Adoption %" />
          <Bar dataKey="issues" fill={CHART_COLORS.red} radius={[4, 4, 0, 0]} isAnimationActive={false} name="Open Issues" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
