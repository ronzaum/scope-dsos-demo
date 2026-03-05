import { useApiData } from "@/hooks/useApiData";
import { Layers, Puzzle, TrendingUp } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { PatternGrid, type GridData } from "@/components/PatternGrid";

/** Core block shape from GET /api/templates/core-blocks */
interface CoreBlock {
  name: string;
  templates: string[];
  fields: string[];
  reviewFlags: string[];
}

interface PatternDetectionProps {
  /** Core blocks to mark on the grid */
  coreBlocks?: CoreBlock[];
  /** DS role enables row selection for core block extraction */
  isDS?: boolean;
  /** Controlled row selection state */
  selectedSections?: string[];
  onSelectionChange?: (sections: string[]) => void;
}

/** Pattern detection UI — heatmap grid hero + collapsible detail accordions */
export function PatternDetection({ coreBlocks = [], isDS = false, selectedSections = [], onSelectionChange }: PatternDetectionProps) {
  const { data, loading } = useApiData<any>("/api/templates/patterns", null);

  // No pattern data available yet
  if (!data || data.message) {
    return (
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Pattern Detection</h2>
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <Layers className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {data?.message || "No pattern analysis available. Run"} {!data?.message && <span className="font-mono text-primary">/Pattern_Check</span>} {!data?.message && "to generate."}
          </p>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Pattern Detection</h2>
        <div className="animate-pulse h-48 bg-secondary rounded-lg" />
      </section>
    );
  }

  const { overlaps = [], reusableElements = [], scalabilitySignals = [], grid } = data;

  return (
    <section className="space-y-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Pattern Detection</h2>

      {/* Hero: Pattern Grid heatmap */}
      {grid && (
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Pattern Grid</h3>
            <span className="text-[10px] font-mono text-muted-foreground ml-auto">
              {grid.sections.length} sections × {grid.templates.length} templates
            </span>
          </div>
          <PatternGrid
            grid={grid as GridData}
            coreBlocks={coreBlocks}
            isDS={isDS}
            selectedSections={selectedSections}
            onSelectionChange={onSelectionChange}
          />
        </div>
      )}

      {/* Collapsible detail accordions — collapsed by default */}
      <Accordion type="multiple" className="space-y-2">
        {/* Overlap Map */}
        <AccordionItem value="overlaps" className="rounded-lg border border-border bg-card px-5">
          <AccordionTrigger className="py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Overlap Map</span>
              <span className="text-[10px] font-mono text-muted-foreground ml-2">{overlaps.length} patterns</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-xs text-muted-foreground mb-3">Templates that share fields, sections, or standards</p>
            {overlaps.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No overlaps detected yet. More templates needed for comparison.</p>
            ) : (
              <div className="space-y-2">
                {overlaps.map((o: any, i: number) => (
                  <div key={i} className="rounded border border-border p-3 text-sm">
                    {typeof o === "string" ? (
                      <span className="text-foreground">{o}</span>
                    ) : (
                      <div className="flex justify-between">
                        <span className="text-foreground">{o.pattern}</span>
                        <span className="text-xs text-muted-foreground">{o.templates}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Reusable Element Groups */}
        <AccordionItem value="reusable" className="rounded-lg border border-border bg-card px-5">
          <AccordionTrigger className="py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <Puzzle className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Reusable Element Groups</span>
              <span className="text-[10px] font-mono text-muted-foreground ml-2">{reusableElements.length} elements</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-xs text-muted-foreground mb-3">Common field clusters that appear across multiple templates</p>
            {reusableElements.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No reusable elements identified yet.</p>
            ) : (
              <div className="space-y-2">
                {reusableElements.map((r: any, i: number) => (
                  <div key={i} className="rounded border border-border p-3 flex items-center justify-between">
                    {typeof r === "string" ? (
                      <span className="text-sm text-foreground">{r}</span>
                    ) : (
                      <>
                        <span className="text-sm text-foreground">{r.element}</span>
                        <span className="text-xs font-mono text-primary">{r.count} templates</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Scalability Signals */}
        <AccordionItem value="scalability" className="rounded-lg border border-border bg-card px-5">
          <AccordionTrigger className="py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Scalability Signals</span>
              <span className="text-[10px] font-mono text-muted-foreground ml-2">{scalabilitySignals.length} templates</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-xs text-muted-foreground mb-3">How much of a new template can be built from existing elements</p>
            {scalabilitySignals.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Not enough templates to compute scalability signals.</p>
            ) : (
              <div className="space-y-3">
                {scalabilitySignals.map((s: any, i: number) => {
                  if (typeof s === "string") {
                    return <div key={i} className="text-sm text-foreground">{s}</div>;
                  }
                  const pct = parseInt(s.reusable) || 0;
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">{s.template}</span>
                        <span className="font-mono text-primary">{s.reusable}</span>
                      </div>
                      {pct > 0 && (
                        <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
