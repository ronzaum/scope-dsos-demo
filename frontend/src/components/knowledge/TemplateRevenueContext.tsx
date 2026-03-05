interface RevenueClient {
  name: string;
  contractValue: number;
  userCount: number | null;
  adoptionPercent: number | null;
}

interface RevenueContextProps {
  context: { clients: RevenueClient[] } | null;
}

/** Format a number as "£Xk" or "£X.XM" */
function formatRevenue(value: number): string {
  if (value >= 1_000_000) return `£${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `£${Math.round(value / 1_000)}k`;
  return `£${value}`;
}

/**
 * Subtle revenue context bar displayed above template detail.
 * Shows which clients this template covers, with user count, ARR, and adoption.
 */
export function TemplateRevenueContext({ context }: RevenueContextProps) {
  if (!context || !context.clients || context.clients.length === 0) return null;

  return (
    <div className="rounded border border-primary/20 bg-primary/5 px-4 py-2.5 mb-4">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Covers</span>
      <div className="mt-1 space-y-1">
        {context.clients.map((c) => (
          <div key={c.name} className="flex items-center gap-3 text-xs">
            <span className="font-medium text-foreground">{c.name}</span>
            {c.userCount !== null && (
              <span className="text-muted-foreground">{c.userCount} users</span>
            )}
            {c.contractValue > 0 && (
              <span className="font-mono text-foreground">{formatRevenue(c.contractValue)} ARR</span>
            )}
            {c.adoptionPercent !== null && (
              <span className="text-muted-foreground">{c.adoptionPercent}% adoption</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
