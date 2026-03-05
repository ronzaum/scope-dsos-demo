import { useState } from "react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";

interface QuestionGroup {
  id: string;
  name: string;
  icon: string;
  questions: string[];
}

interface SuccessQuestionsSectionProps {
  data: QuestionGroup[];
  searchQuery?: string;
}

function resolveIcon(name: string): LucideIcon {
  const icon = (Icons as Record<string, LucideIcon>)[name];
  return icon || Icons.HelpCircle;
}

/**
 * Success Questions section: left panel shows 5 question groups as collapsible headers.
 * Right panel shows selected group's questions as a styled list.
 */
export function SuccessQuestionsSection({ data, searchQuery }: SuccessQuestionsSectionProps) {
  const [selectedId, setSelectedId] = useState<string>(data[0]?.id || "");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const filteredData = searchQuery
    ? data.filter((g) => {
        const q = searchQuery.toLowerCase();
        return (
          g.name.toLowerCase().includes(q) ||
          g.questions.some((q2) => q2.toLowerCase().includes(q))
        );
      })
    : data;

  const selected = data.find((g) => g.id === selectedId);

  const toggleExpand = (id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filter questions within selected group by search query
  const filteredQuestions = selected
    ? searchQuery
      ? selected.questions.filter((q) => q.toLowerCase().includes(searchQuery.toLowerCase()))
      : selected.questions
    : [];

  return (
    <div className="flex flex-col md:flex-row min-h-[320px]">
      {/* Left panel — question group headers */}
      <div className="w-full md:w-[40%] border-b md:border-b-0 md:border-r border-border">
        <div className="divide-y divide-border">
          {filteredData.map((group) => {
            const Icon = resolveIcon(group.icon);
            const isExpanded = expandedGroups.has(group.id);
            return (
              <div key={group.id}>
                <button
                  onClick={() => {
                    setSelectedId(group.id);
                    toggleExpand(group.id);
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                    selectedId === group.id
                      ? "bg-secondary text-foreground font-medium"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      selectedId === group.id ? "text-primary" : "text-muted-foreground/60"
                    }`}
                    strokeWidth={1.5}
                  />
                  <span className="text-sm flex-1 truncate">{group.name}</span>
                  <ChevronDown
                    className={`h-3 w-3 shrink-0 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    } ${selectedId === group.id ? "text-primary" : "text-muted-foreground/40"}`}
                  />
                </button>
                {/* Collapsed preview — question count */}
                {isExpanded && (
                  <div className="px-4 pb-2">
                    <span className="text-xs text-muted-foreground/60">
                      {group.questions.length} questions
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right panel — questions list */}
      <div className="w-full md:w-[60%] p-5 overflow-y-auto">
        {selected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {(() => {
                const Icon = resolveIcon(selected.icon);
                return <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />;
              })()}
              <h4 className="text-sm font-semibold text-foreground">{selected.name}</h4>
            </div>

            <ul className="space-y-3">
              {filteredQuestions.map((question, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <span className="font-mono text-xs text-primary shrink-0 mt-0.5 bg-primary/10 rounded w-5 h-5 flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{question}</span>
                </li>
              ))}
            </ul>

            {filteredQuestions.length === 0 && searchQuery && (
              <p className="text-xs text-muted-foreground/60">No questions match your search.</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Select a question group to view questions.</p>
        )}
      </div>
    </div>
  );
}
