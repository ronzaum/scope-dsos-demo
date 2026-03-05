import { useState } from "react";
import { FlowDiagram } from "../FlowDiagram";
import { ExampleBox } from "../ExampleBox";

interface ProcessStep {
  id: number;
  label: string;
  detail: string;
  examples?: string[];
}

interface InspectionType {
  name: string;
  slug: string;
  processFlow: ProcessStep[];
  description?: string;
  keyFields?: string[];
  instruments?: string[];
  commonDefects?: any[];
  deploymentNotes?: string[];
}

interface InspectionCycleSectionProps {
  data: InspectionType[];
  searchQuery?: string;
}

/**
 * Inspection Cycle section: left panel shows type selector buttons,
 * selecting a type renders its FlowDiagram. Right panel shows
 * the selected step's detail text.
 */
export function InspectionCycleSection({ data, searchQuery }: InspectionCycleSectionProps) {
  const [selectedType, setSelectedType] = useState<string>(data[0]?.slug || "");
  const [selectedStepId, setSelectedStepId] = useState<string>("");

  const filteredTypes = searchQuery
    ? data.filter((t) => {
        const q = searchQuery.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.keyFields?.some((f) => f.toLowerCase().includes(q)) ||
          t.instruments?.some((i) => i.toLowerCase().includes(q)) ||
          t.processFlow.some((s) =>
            s.label.toLowerCase().includes(q) ||
            s.detail.toLowerCase().includes(q)
          )
        );
      })
    : data;

  const currentType = data.find((t) => t.slug === selectedType);
  const currentStep = currentType?.processFlow.find((s) => String(s.id) === selectedStepId);

  // Auto-select first step when type changes
  const handleTypeChange = (slug: string) => {
    setSelectedType(slug);
    const type = data.find((t) => t.slug === slug);
    if (type?.processFlow.length) {
      setSelectedStepId(String(type.processFlow[0].id));
    }
  };

  // Select first type on mount if nothing selected
  if (!selectedType && filteredTypes.length > 0) {
    handleTypeChange(filteredTypes[0].slug);
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[320px]">
      {/* Left panel — type selector + flow diagram */}
      <div className="w-full md:w-[45%] border-b md:border-b-0 md:border-r border-border p-4 space-y-4">
        {/* Type selector buttons */}
        <div className="flex flex-wrap gap-2">
          {filteredTypes.map((type) => (
            <button
              key={type.slug}
              onClick={() => handleTypeChange(type.slug)}
              className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                selectedType === type.slug
                  ? "bg-primary/15 border-primary/40 text-foreground font-medium"
                  : "border-border text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>

        {/* Flow diagram for selected type */}
        {currentType && currentType.processFlow.length > 0 && (
          <FlowDiagram
            steps={currentType.processFlow.map((s) => ({
              id: String(s.id),
              label: s.label,
              detail: s.detail,
            }))}
            selectedStepId={selectedStepId}
            onStepClick={setSelectedStepId}
          />
        )}
      </div>

      {/* Right panel — step detail */}
      <div className="w-full md:w-[55%] p-5 overflow-y-auto">
        {currentStep ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                Step {currentStep.id}
              </span>
              <h4 className="text-sm font-semibold text-foreground">{currentStep.label}</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{currentStep.detail}</p>
            {currentStep.examples && currentStep.examples.length > 0 && (
              <ExampleBox examples={currentStep.examples} title="Examples" />
            )}
            {/* Type metadata (merged from Inspection Types section) */}
            {currentType && (
              <div className="mt-4 pt-3 border-t border-border space-y-3">
                {currentType.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">{currentType.description}</p>
                )}

                {currentType.keyFields && currentType.keyFields.length > 0 && (
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Key Data Fields</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {currentType.keyFields.map((field, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {currentType.instruments && currentType.instruments.length > 0 && (
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Instruments</h5>
                    <ul className="text-sm text-muted-foreground space-y-0.5">
                      {currentType.instruments.map((inst, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-muted-foreground/60 mt-0.5">·</span>
                          {inst}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentType.commonDefects && currentType.commonDefects.length > 0 && (
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Common Defects</h5>
                    <div className="text-xs text-muted-foreground space-y-1">
                      {currentType.commonDefects.slice(0, 5).map((defect: any, i: number) => (
                        <div key={i} className="flex gap-2 py-1 border-b border-border/50 last:border-0">
                          {typeof defect === "string" ? (
                            <span>{defect}</span>
                          ) : (
                            Object.entries(defect).map(([key, val]) => (
                              <span key={key}>
                                <span className="text-muted-foreground/50">{key}:</span> {String(val)}
                              </span>
                            ))
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentType.deploymentNotes && currentType.deploymentNotes.length > 0 && (
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Deployment Notes</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {currentType.deploymentNotes.map((note, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary mt-0.5 shrink-0">+</span>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-xs text-muted-foreground/60 pt-2">
                  {currentType.name} - {currentType.processFlow.length} steps
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Select a step in the flow diagram to view details.
          </p>
        )}
      </div>
    </div>
  );
}
