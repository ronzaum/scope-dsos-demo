import { useState } from "react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Persona {
  id: string;
  name: string;
  icon: string;
  oneLiner: string;
  role: string;
  successCriteria: string;
  talkingPoints: string[];
  frictionPoints: string[];
}

interface StakeholderMapSectionProps {
  data: Persona[];
  searchQuery?: string;
}

function resolveIcon(name: string): LucideIcon {
  const icon = (Icons as Record<string, LucideIcon>)[name];
  return icon || Icons.HelpCircle;
}

/**
 * Stakeholder Map section: left panel shows 8 persona rows with icon + name + one-liner.
 * Right panel shows selected persona's full detail.
 */
export function StakeholderMapSection({ data, searchQuery }: StakeholderMapSectionProps) {
  const [selectedId, setSelectedId] = useState<string>(data[0]?.id || "");

  const filteredData = searchQuery
    ? data.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.oneLiner.toLowerCase().includes(q) ||
          p.role.toLowerCase().includes(q) ||
          p.talkingPoints.some((t) => t.toLowerCase().includes(q)) ||
          p.frictionPoints.some((f) => f.toLowerCase().includes(q))
        );
      })
    : data;

  const selected = data.find((p) => p.id === selectedId);

  return (
    <div className="flex flex-col md:flex-row min-h-[320px]">
      {/* Left panel — persona list */}
      <div className="w-full md:w-[40%] border-b md:border-b-0 md:border-r border-border">
        <div className="divide-y divide-border">
          {filteredData.map((persona) => {
            const Icon = resolveIcon(persona.icon);
            return (
              <button
                key={persona.id}
                onClick={() => setSelectedId(persona.id)}
                className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                  selectedId === persona.id
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                <Icon
                  className={`h-4 w-4 mt-0.5 shrink-0 ${
                    selectedId === persona.id ? "text-primary" : "text-muted-foreground/60"
                  }`}
                  strokeWidth={1.5}
                />
                <div className="min-w-0">
                  <div className={`text-sm truncate ${selectedId === persona.id ? "font-medium" : ""}`}>
                    {persona.name}
                  </div>
                  <div className="text-xs text-muted-foreground/70 truncate">{persona.oneLiner}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right panel — persona detail */}
      <div className="w-full md:w-[60%] p-5 overflow-y-auto">
        {selected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {(() => {
                const Icon = resolveIcon(selected.icon);
                return <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />;
              })()}
              <h4 className="text-sm font-semibold text-foreground">{selected.name}</h4>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{selected.role}</p>

            <div className="space-y-1">
              <h5 className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Success Criteria</h5>
              <p className="text-sm text-muted-foreground">{selected.successCriteria}</p>
            </div>

            <div className="space-y-1.5">
              <h5 className="text-xs font-medium text-foreground/70 uppercase tracking-wide">DS Talking Points</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                {selected.talkingPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5 shrink-0">+</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5">
              <h5 className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Common Friction Points</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                {selected.frictionPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-destructive mt-0.5 shrink-0">-</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Select a persona to view details.</p>
        )}
      </div>
    </div>
  );
}
