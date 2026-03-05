import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useApiData } from "@/hooks/useApiData";
import { FALLBACK_KNOWLEDGE } from "@/data/fallbacks";
import { SectionCard } from "@/components/knowledge/SectionCard";
import { SectionExpansion } from "@/components/knowledge/SectionExpansion";

interface KnowledgeSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  data: Record<string, unknown>;
}

interface KnowledgeResponse {
  sections: KnowledgeSection[];
}

/** Check whether a section has any content matching the search query */
function sectionHasMatch(section: KnowledgeSection, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();

  if (section.title.toLowerCase().includes(q)) return true;
  if (section.description.toLowerCase().includes(q)) return true;

  const { data } = section;
  if (!data) return false;

  return JSON.stringify(data).toLowerCase().includes(q);
}

export default function Knowledge() {
  const { data, loading } = useApiData<KnowledgeResponse>("/api/knowledge", FALLBACK_KNOWLEDGE);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const toggleSection = (id: string) => {
    setExpandedSection((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-secondary rounded w-48" />
          <div className="h-10 bg-secondary rounded w-full max-w-md" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-secondary rounded-xl" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  const sections = data.sections || [];

  // Pre-compute which sections match the search query (for dimming)
  const matchSet = useMemo(() => {
    if (!debouncedQuery) return null;
    const matches = new Set<string>();
    for (const section of sections) {
      if (sectionHasMatch(section, debouncedQuery)) {
        matches.add(section.id);
      }
    }
    return matches;
  }, [sections, debouncedQuery]);

  const expandedSectionData = expandedSection
    ? sections.find((s) => s.id === expandedSection)
    : null;

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">TIC Playbook</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Industry reference: inspection types, standards, stakeholders, and deployment intelligence
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search across all sections..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-colors"
        />
      </div>

      {/* Layout: cards on left, detail panel on right when a section is selected */}
      <div className={`flex gap-4 lg:gap-6 ${expandedSection ? "flex-col lg:flex-row" : ""}`}>
        {/* Card grid */}
        <div className={expandedSection ? "w-full lg:w-[40%] shrink-0" : "w-full"}>
          <div className={`grid gap-4 ${
            expandedSection
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }`}>
            {sections.map((section) => {
              const dimmed = matchSet !== null && !matchSet.has(section.id);
              return (
                <div
                  key={section.id}
                  className={`transition-opacity duration-200 ${dimmed ? "opacity-30 pointer-events-none" : ""}`}
                >
                  <SectionCard
                    id={section.id}
                    title={section.title}
                    icon={section.icon}
                    description={section.description}
                    data={section.data}
                    expanded={expandedSection === section.id}
                    onClick={() => toggleSection(section.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right detail panel — fixed position when a section is selected */}
        {expandedSectionData && (
          <div className="w-full lg:w-[60%] lg:sticky lg:top-4 lg:self-start">
            <SectionExpansion
              sectionId={expandedSectionData.id}
              data={expandedSectionData.data}
              searchQuery={debouncedQuery}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
