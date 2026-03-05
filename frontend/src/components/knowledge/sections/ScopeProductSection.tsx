import { useState } from "react";
import { ChevronRight, Users, TrendingUp, Activity } from "lucide-react";

interface Capability {
  name: string;
  slug: string;
  features: string[];
  maturity?: string;
}

interface HeroMetrics {
  totalActiveUsers: number;
  avgAdoptionRate: number;
  productMaturity: string;
}

interface ScopeProductData {
  description: string;
  capabilities: Capability[];
  metrics: any[];
  revenue: string;
  companyFacts: any[];
  moat: string;
  competitors: any[];
  coreTension: string;
  heroMetrics?: HeroMetrics | null;
}

interface ScopeProductSectionProps {
  data: ScopeProductData;
  searchQuery?: string;
}

const MATURITY_STYLES: Record<string, string> = {
  Live: "bg-green-500/15 text-green-700 dark:text-green-400",
  Beta: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Planned: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400",
};

/**
 * Scope Product section: hero metrics row at top, left panel shows 8 capability names
 * with maturity badges. Right panel shows selected capability's features, competitive context.
 */
export function ScopeProductSection({ data, searchQuery }: ScopeProductSectionProps) {
  const capabilities = data.capabilities || [];
  const [selectedSlug, setSelectedSlug] = useState<string>(capabilities[0]?.slug || "");

  const filteredCapabilities = searchQuery
    ? capabilities.filter((c) => {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.features.some((f) => f.toLowerCase().includes(q))
        );
      })
    : capabilities;

  const selected = capabilities.find((c) => c.slug === selectedSlug);
  const hero = data.heroMetrics;

  return (
    <div className="flex flex-col min-h-[320px]">
      {/* Hero metrics row */}
      {hero && (
        <div className="grid grid-cols-3 gap-3 p-4 border-b border-border">
          <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2.5">
            <TrendingUp className="h-4 w-4 text-primary shrink-0" />
            <div>
              <div className="text-lg font-semibold text-foreground">{hero.avgAdoptionRate}%</div>
              <div className="text-xs text-muted-foreground">Adoption Rate</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2.5">
            <Users className="h-4 w-4 text-primary shrink-0" />
            <div>
              <div className="text-lg font-semibold text-foreground">{hero.totalActiveUsers}</div>
              <div className="text-xs text-muted-foreground">Active Users</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2.5">
            <Activity className="h-4 w-4 text-primary shrink-0" />
            <div>
              <div className="text-lg font-semibold text-foreground">{hero.productMaturity}</div>
              <div className="text-xs text-muted-foreground">Product Stage</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row flex-1">
        {/* Left panel — capabilities list */}
        <div className="w-full md:w-[40%] border-b md:border-b-0 md:border-r border-border">
          <div className="divide-y divide-border">
            {filteredCapabilities.map((cap) => (
              <button
                key={cap.slug}
                onClick={() => setSelectedSlug(cap.slug)}
                className={`w-full text-left px-4 py-3 flex items-center gap-2 transition-colors ${
                  selectedSlug === cap.slug
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                <ChevronRight
                  className={`h-3 w-3 shrink-0 transition-transform ${
                    selectedSlug === cap.slug ? "rotate-90 text-primary" : ""
                  }`}
                />
                <span className="text-sm truncate flex-1">{cap.name}</span>
                {cap.maturity && (
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${
                    MATURITY_STYLES[cap.maturity] || MATURITY_STYLES.Planned
                  }`}>
                    {cap.maturity}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Metrics summary at bottom of left panel */}
          {data.metrics && data.metrics.length > 0 && (
            <div className="border-t border-border p-4 space-y-2">
              <h5 className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Key Metrics</h5>
              <div className="grid grid-cols-2 gap-2">
                {data.metrics.slice(0, 4).map((metric: any, i: number) => {
                  const entries = Object.entries(metric);
                  const label = entries[0] ? String(entries[0][1]) : "";
                  const value = entries[1] ? String(entries[1][1]) : "";
                  return (
                    <div key={i} className="text-xs">
                      <div className="text-muted-foreground/60 truncate">{label}</div>
                      <div className="text-foreground font-medium">{value}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right panel — capability detail */}
        <div className="w-full md:w-[60%] p-5 overflow-y-auto">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-foreground">{selected.name}</h4>
                {selected.maturity && (
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                    MATURITY_STYLES[selected.maturity] || MATURITY_STYLES.Planned
                  }`}>
                    {selected.maturity}
                  </span>
                )}
              </div>

              {selected.features.length > 0 && (
                <div className="space-y-1.5">
                  <h5 className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Features</h5>
                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    {selected.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5 shrink-0">+</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Competitive context */}
              {data.competitors && data.competitors.length > 0 && (
                <div className="space-y-1.5 pt-3 border-t border-border">
                  <h5 className="text-xs font-medium text-foreground/70 uppercase tracking-wide">
                    Competitive Landscape
                  </h5>
                  <div className="text-xs text-muted-foreground space-y-1">
                    {data.competitors.slice(0, 4).map((comp: any, i: number) => {
                      const entries = Object.entries(comp);
                      return (
                        <div key={i} className="flex gap-3 py-1 border-b border-border/30 last:border-0">
                          {entries.map(([key, val]) => (
                            <span key={key}>
                              <span className="text-muted-foreground/50">{key}:</span> {String(val)}
                            </span>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Moat */}
              {data.moat && (
                <div className="space-y-1 pt-3 border-t border-border">
                  <h5 className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Moat</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {data.moat.slice(0, 300)}{data.moat.length > 300 ? "..." : ""}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select a capability to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
}
