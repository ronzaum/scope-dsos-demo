import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { CHART_COLORS } from "./ChartTheme";

interface Phase {
  name: string;
  status: string;
  timeline?: string;
  duration?: string;
}

interface Props {
  phases: Phase[];
}

function normalizeStatus(status: string): string {
  const s = status.toUpperCase();
  if (s.includes("COMPLETE")) return "complete";
  if (s.includes("PROGRESS")) return "in-progress";
  return "planned";
}

const STATUS_COLORS: Record<string, string> = {
  complete: CHART_COLORS.green,
  "in-progress": CHART_COLORS.amber,
  planned: CHART_COLORS.muted,
};

/** Horizontal bar chart showing phase timeline with status colours */
export function PhaseTimeline({ phases }: Props) {
  if (!phases || phases.length === 0) return null;

  const data = phases.map((p) => {
    const ns = normalizeStatus(p.status);
    // Extract weeks number from timeline/duration string for bar width
    const timeStr = p.timeline || p.duration || "";
    const weeksMatch = timeStr.match(/(\d+)/);
    const weeks = weeksMatch ? parseInt(weeksMatch[1]) : 4;
    return {
      name: p.name,
      weeks,
      status: ns,
      label: `${p.name} (${timeStr})`,
    };
  });

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Phase Timeline</h3>
      <ResponsiveContainer width="100%" height={phases.length * 40 + 20}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 60 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" tick={{ fill: CHART_COLORS.text, fontSize: 11 }} width={80} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: CHART_COLORS.bg, border: "1px solid hsl(215,20%,25%)", borderRadius: 6, fontSize: 11 }}
            itemStyle={{ color: CHART_COLORS.text }}
            formatter={(value: number) => [`${value} weeks`, "Duration"]}
          />
          <Bar dataKey="weeks" radius={[0, 4, 4, 0]} isAnimationActive={false}>
            {data.map((entry, i) => (
              <Cell key={i} fill={STATUS_COLORS[entry.status] || CHART_COLORS.muted} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-2">
        <Legend color={CHART_COLORS.green} label="Complete" />
        <Legend color={CHART_COLORS.amber} label="In Progress" />
        <Legend color={CHART_COLORS.muted} label="Planned" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-block h-2 w-2 rounded-sm" style={{ background: color }} />
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}
