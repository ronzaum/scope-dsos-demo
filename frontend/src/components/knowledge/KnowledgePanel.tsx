import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Search, ExternalLink } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useApiData } from "@/hooks/useApiData";
import { FALLBACK_KNOWLEDGE } from "@/data/fallbacks";

interface KnowledgePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface KnowledgeSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  data: Record<string, unknown>;
}

/** Resolve a Lucide icon name string to the actual component */
function resolveIcon(name: string): LucideIcon {
  const icon = (Icons as Record<string, LucideIcon>)[name];
  return icon || Icons.HelpCircle;
}

/** Extract displayable item names from section data for the compact list */
function getItems(section: KnowledgeSection): { id: string; name: string; detail?: string }[] {
  const { data } = section;
  if (!data) return [];

  // Array sections (stakeholders, standards, inspection types, inspection cycle)
  if (Array.isArray(data)) {
    return data.map((item: any, i: number) => ({
      id: item.id || item.slug || `item-${i}`,
      name: item.name || item.title || `Item ${i + 1}`,
      detail: item.oneLiner || item.description || item.governs || item.subtitle || "",
    }));
  }

  // Scope Product — capabilities array
  if (data.capabilities && Array.isArray(data.capabilities)) {
    return data.capabilities.map((c: any, i: number) => ({
      id: c.slug || `cap-${i}`,
      name: c.name,
      detail: c.features?.[0] || "",
    }));
  }

  // Report anatomy — skeleton array
  if (data.skeleton && Array.isArray(data.skeleton)) {
    return data.skeleton.map((s: any) => ({
      id: `section-${s.id}`,
      name: s.label,
      detail: s.detail || "",
    }));
  }

  return [];
}

/** Check if a section or its items match a search query */
function filterItems(
  items: { id: string; name: string; detail?: string }[],
  query: string
): { id: string; name: string; detail?: string }[] {
  if (!query) return items;
  const q = query.toLowerCase();
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      (item.detail && item.detail.toLowerCase().includes(q))
  );
}

export function KnowledgePanel({ open, onOpenChange }: KnowledgePanelProps) {
  const navigate = useNavigate();
  const { data } = useApiData<{ sections: KnowledgeSection[] }>("/api/knowledge", FALLBACK_KNOWLEDGE);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Debounce search by 300ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset state when panel closes
  useEffect(() => {
    if (!open) {
      setSearchInput("");
      setDebouncedQuery("");
      setSelectedItem(null);
    }
  }, [open]);

  const sections = data.sections || [];

  // Pre-compute filtered items per section
  const filteredSections = useMemo(() => {
    return sections.map((section) => ({
      section,
      items: filterItems(getItems(section), debouncedQuery),
    }));
  }, [sections, debouncedQuery]);

  const handleOpenFullPage = () => {
    onOpenChange(false);
    navigate("/knowledge");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[400px] sm:max-w-[400px] flex flex-col p-0">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between pr-6">
            <SheetTitle className="text-base">TIC Playbook</SheetTitle>
            <button
              onClick={handleOpenFullPage}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              Open full page
              <ExternalLink size={12} />
            </button>
          </div>

          {/* Search */}
          <div className="relative mt-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-md border border-border bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-colors"
            />
          </div>
        </SheetHeader>

        {/* Accordion sections */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <Accordion type="multiple" className="w-full">
            {filteredSections.map(({ section, items }) => {
              const Icon = resolveIcon(section.icon);
              const hasResults = !debouncedQuery || items.length > 0;

              return (
                <AccordionItem
                  key={section.id}
                  value={section.id}
                  className={`border-b border-border/50 ${!hasResults ? "opacity-30" : ""}`}
                >
                  <AccordionTrigger className="py-3 text-xs hover:no-underline gap-2">
                    <div className="flex items-center gap-2 text-left">
                      <Icon size={14} className="shrink-0 text-muted-foreground" />
                      <span className="font-medium text-foreground">{section.title}</span>
                      <span className="text-muted-foreground font-normal">({items.length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-2 pt-0">
                    <ul className="space-y-0.5">
                      {items.map((item) => {
                        const isSelected = selectedItem === `${section.id}:${item.id}`;
                        return (
                          <li key={item.id}>
                            <button
                              onClick={() =>
                                setSelectedItem(
                                  isSelected ? null : `${section.id}:${item.id}`
                                )
                              }
                              className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                                isSelected
                                  ? "bg-primary/10 text-foreground"
                                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                              }`}
                            >
                              {item.name}
                            </button>
                            {/* Inline detail when selected */}
                            {isSelected && item.detail && (
                              <div className="px-2 py-2 ml-2 mb-1 border-l-2 border-primary/20 text-xs text-muted-foreground leading-relaxed">
                                {item.detail}
                              </div>
                            )}
                          </li>
                        );
                      })}
                      {items.length === 0 && (
                        <li className="px-2 py-1.5 text-xs text-muted-foreground italic">
                          No matching items
                        </li>
                      )}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}
