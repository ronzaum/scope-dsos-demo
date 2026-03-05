import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CHART_COLORS } from "./ChartTheme";

interface Props {
  deployments: { health: string }[];
}

const COLOR_MAP: Record<string, string> = {
  green: CHART_COLORS.green,
  amber: CHART_COLORS.amber,
  red: CHART_COLORS.red,
};

/** Small donut chart showing green/amber/red client health distribution */
export function HealthDistribution({ deployments }: Props) {
  const counts: Record<string, number> = { green: 0, amber: 0, red: 0 };
  for (const d of deployments) {
    const h = d.health?.toLowerCase() || "green";
    counts[h] = (counts[h] || 0) + 1;
  }

  const data = Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  if (data.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Health Distribution</h3>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={18} outerRadius={28} strokeWidth={0} isAnimationActive={false}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={COLOR_MAP[entry.name] || CHART_COLORS.muted} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: CHART_COLORS.bg, border: "1px solid hsl(215,20%,25%)", borderRadius: 6, fontSize: 11 }}
                itemStyle={{ color: CHART_COLORS.text }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-3">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: COLOR_MAP[d.name] }} />
              <span className="text-xs font-mono text-muted-foreground">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
