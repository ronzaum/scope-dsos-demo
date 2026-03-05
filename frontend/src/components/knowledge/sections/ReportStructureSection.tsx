import { useState } from "react";
import { FlowDiagram } from "../FlowDiagram";

interface SkeletonSection {
  id: number;
  label: string;
  detail: string;
  fields?: any[];
  bullets?: string[];
  note?: string;
  goodExample?: string;
  badExample?: string;
}

interface ReportData {
  skeleton: SkeletonSection[];
  classificationSystems?: any[];
  variations?: any[];
  goodVsBad?: { qualities: any[]; failures: any[] } | null;
  digitalTransition?: string;
  aiValue?: any[];
}

interface ReportStructureSectionProps {
  data: ReportData;
  searchQuery?: string;
}

/**
 * Report Structure section: left panel shows a FlowDiagram of the 7 report skeleton sections.
 * Right panel shows selected section's detail, field requirements, good vs bad examples.
 */
export function ReportStructureSection({ data, searchQuery }: ReportStructureSectionProps) {
  const skeleton = data.skeleton || [];
  const [selectedStepId, setSelectedStepId] = useState<string>(
    skeleton.length > 0 ? String(skeleton[0].id) : ""
  );
  const filteredSkeleton = searchQuery
    ? skeleton.filter((s) => {
        const q = searchQuery.toLowerCase();
        return (
          s.label.toLowerCase().includes(q) ||
          s.detail?.toLowerCase().includes(q) ||
          s.bullets?.some((b) => b.toLowerCase().includes(q))
        );
      })
    : skeleton;

  const selected = skeleton.find((s) => String(s.id) === selectedStepId);
  const hasExamples = selected && (selected.goodExample || selected.badExample);

  return (
    <div className="flex flex-col md:flex-row min-h-[320px]">
      {/* Left panel — flow diagram of skeleton */}
      <div className="w-full md:w-[45%] border-b md:border-b-0 md:border-r border-border p-4">
        <FlowDiagram
          steps={filteredSkeleton.map((s) => ({
            id: String(s.id),
            label: s.label,
            detail: s.detail,
          }))}
          selectedStepId={selectedStepId}
          onStepClick={setSelectedStepId}
        />
      </div>

      {/* Right panel — section detail */}
      <div className="w-full md:w-[55%] p-5 overflow-y-auto">
        {selected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                Section {selected.id}
              </span>
              <h4 className="text-sm font-semibold text-foreground">{selected.label}</h4>
            </div>

            {selected.detail && (
              <p className="text-sm text-muted-foreground leading-relaxed">{selected.detail}</p>
            )}

            {/* Field requirements table */}
            {selected.fields && selected.fields.length > 0 && (
              <div className="space-y-1.5">
                <h5 className="text-xs font-medium text-foreground/70 uppercase tracking-wide">
                  Field Requirements
                </h5>
                <div className="text-xs text-muted-foreground space-y-1 border border-border rounded p-3">
                  {selected.fields.map((field: any, i: number) => (
                    <div key={i} className="flex gap-3 py-1 border-b border-border/30 last:border-0">
                      {Object.entries(field).map(([key, val]) => (
                        <span key={key} className="min-w-0">
                          <span className="text-muted-foreground/50">{key}:</span>{" "}
                          <span className="text-foreground/80">{String(val)}</span>
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bullet points */}
            {selected.bullets && selected.bullets.length > 0 && (
              <ul className="text-sm text-muted-foreground space-y-1">
                {selected.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-muted-foreground/60 mt-0.5">·</span>
                    {bullet}
                  </li>
                ))}
              </ul>
            )}

            {/* Note */}
            {selected.note && (
              <div className="text-xs text-muted-foreground/70 bg-secondary/50 rounded p-3 border-l-2 border-primary/30">
                {selected.note}
              </div>
            )}

            {/* Good/bad examples inline */}
            {hasExamples && (
              <div className="space-y-3 pt-2">
                {selected.goodExample && (
                  <div className="bg-green-500/5 border-l-2 border-green-500/40 rounded-r-md px-3 py-2.5">
                    <h6 className="text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wide mb-1">
                      Good Example
                    </h6>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {selected.goodExample}
                    </p>
                  </div>
                )}
                {selected.badExample && (
                  <div className="bg-red-500/5 border-l-2 border-red-500/40 rounded-r-md px-3 py-2.5">
                    <h6 className="text-xs font-medium text-red-700 dark:text-red-400 uppercase tracking-wide mb-1">
                      Bad Example
                    </h6>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {selected.badExample}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Select a section in the flow diagram to view details.
          </p>
        )}
      </div>
    </div>
  );
}
