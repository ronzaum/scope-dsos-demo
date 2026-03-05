import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface ClientType {
  name: string;
  points?: string[];
  [key: string]: any;
}

interface Category {
  name: string;
  types: ClientType[];
}

interface Insight {
  name: string;
  points: string[];
  boldItems?: { label: string; qualifier: string; text: string }[];
}

interface ClientSegmentationData {
  insights: Insight[];
  categories: Category[];
}

interface ClientSegmentationSectionProps {
  data: ClientSegmentationData;
  searchQuery?: string;
}

/**
 * Client Segmentation section: left panel shows categories (By Scale, By Inspection Type, By Geography).
 * Right panel shows the selected category's types with their properties.
 * Insights appear as introductory context above the category detail.
 */
export function ClientSegmentationSection({ data, searchQuery }: ClientSegmentationSectionProps) {
  const categories = data.categories || [];
  const insights = data.insights || [];
  const [selectedIdx, setSelectedIdx] = useState(0);

  const filteredCategories = searchQuery
    ? categories.filter((cat) => {
        const q = searchQuery.toLowerCase();
        return (
          cat.name.toLowerCase().includes(q) ||
          cat.types.some(
            (t) =>
              t.name.toLowerCase().includes(q) ||
              (t.points || []).some((p) => p.toLowerCase().includes(q))
          )
        );
      })
    : categories;

  const selected = filteredCategories[selectedIdx] || filteredCategories[0];

  return (
    <div className="flex flex-col md:flex-row min-h-[320px]">
      {/* Left panel — category list */}
      <div className="w-full md:w-[40%] border-b md:border-b-0 md:border-r border-border">
        <div className="divide-y divide-border">
          {filteredCategories.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setSelectedIdx(i)}
              className={`w-full text-left px-4 py-3 transition-colors ${
                selected?.name === cat.name
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <div className={`text-sm ${selected?.name === cat.name ? "font-medium" : ""}`}>
                {cat.name}
              </div>
              <div className="text-xs text-muted-foreground/70">
                {cat.types.length} type{cat.types.length !== 1 ? "s" : ""}
              </div>
            </button>
          ))}

          {/* Insights as a separate entry */}
          {insights.length > 0 && (
            <button
              onClick={() => setSelectedIdx(-1)}
              className={`w-full text-left px-4 py-3 transition-colors ${
                selectedIdx === -1
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <div className={`text-sm ${selectedIdx === -1 ? "font-medium" : ""}`}>
                Deployment Insights
              </div>
              <div className="text-xs text-muted-foreground/70">
                {insights.length} client type{insights.length !== 1 ? "s" : ""}
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Right panel — detail */}
      <div className="w-full md:w-[60%] p-5 overflow-y-auto">
        {selectedIdx === -1 ? (
          <InsightsDetail insights={insights} />
        ) : selected ? (
          <CategoryDetail category={selected} />
        ) : (
          <p className="text-sm text-muted-foreground">Select a category to view details.</p>
        )}
      </div>
    </div>
  );
}

function CategoryDetail({ category }: { category: Category }) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-foreground">{category.name}</h4>
      {category.types.map((type) => (
        <TypeCard key={type.name} type={type} />
      ))}
    </div>
  );
}

function TypeCard({ type }: { type: ClientType }) {
  const [expanded, setExpanded] = useState(false);

  // Collect key-value fields (everything except name and points)
  const fields = Object.entries(type).filter(
    ([key]) => key !== "name" && key !== "points"
  );

  const hasDetail = (type.points && type.points.length > 0) || fields.length > 0;

  return (
    <div className="rounded-md border border-border bg-card/50 p-4">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-medium text-foreground">{type.name}</h5>
        {hasDetail && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        )}
      </div>
      {expanded && (
        <div className="mt-3 space-y-2">
          {/* Render key-value fields */}
          {fields.map(([key, value]) => (
            <div key={key} className="text-xs">
              <span className="font-medium text-foreground/70 capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}:
              </span>{" "}
              <span className="text-muted-foreground">{String(value)}</span>
            </div>
          ))}
          {/* Render bullet points */}
          {type.points && type.points.length > 0 && (
            <ul className="text-xs text-muted-foreground space-y-1">
              {type.points.map((p, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="mt-0.5 shrink-0">-</span>
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function InsightsDetail({ insights }: { insights: Insight[] }) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-foreground">Deployment Insights by Client Type</h4>
      {insights.map((insight, i) => (
        <div key={i}>
          <h5 className="text-sm font-medium text-foreground mb-2">{insight.name}</h5>
          {insight.boldItems && insight.boldItems.length > 0 ? (
            <ul className="text-xs text-muted-foreground space-y-1.5">
              {insight.boldItems.map((item, j) => (
                <li key={j} className="flex items-start gap-1.5">
                  <span className="mt-0.5 shrink-0">-</span>
                  <span>
                    <span className="font-medium text-foreground/80">{item.label}</span>
                    {item.qualifier && <span className="italic"> ({item.qualifier})</span>}
                    : {item.text}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="text-xs text-muted-foreground space-y-1">
              {(insight.points || []).map((p, j) => (
                <li key={j} className="flex items-start gap-1.5">
                  <span className="mt-0.5 shrink-0">-</span>
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
