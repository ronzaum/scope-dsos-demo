import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { CHART_COLORS } from "./ChartTheme";

interface Props {
  issues: { status: string }[];
}

/** Simple bar chart showing open vs resolved issue counts */
export function IssueResolution({ issues }: Props) {
  if (!issues || issues.length === 0) return null;

  const open = issues.filter(i => i.status?.toLowerCase().includes("open")).length;
  const resolved = issues.filter(i => i.status?.toLowerCase().includes("resolved")).length;

  const data = [{ name: "Issues", open, resolved }];

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Issue Resolution</h3>
      <ResponsiveContainer width="100%" height={60}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip
            contentStyle={{ background: CHART_COLORS.bg, border: "1px solid hsl(215,20%,25%)", borderRadius: 6, fontSize: 11 }}
            itemStyle={{ color: CHART_COLORS.text }}
          />
          <Bar dataKey="resolved" stackId="a" fill={CHART_COLORS.green} radius={[4, 0, 0, 4]} isAnimationActive={false} name="Resolved" />
          <Bar dataKey="open" stackId="a" fill={CHART_COLORS.red} radius={[0, 4, 4, 0]} isAnimationActive={false} name="Open" />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-1">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-sm" style={{ background: CHART_COLORS.green }} />
          <span className="text-[10px] text-muted-foreground">Resolved ({resolved})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-sm" style={{ background: CHART_COLORS.red }} />
          <span className="text-[10px] text-muted-foreground">Open ({open})</span>
        </div>
      </div>
    </div>
  );
}
