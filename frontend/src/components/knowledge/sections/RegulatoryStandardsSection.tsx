import { useState } from "react";
import { ExternalLink, ChevronRight } from "lucide-react";
import { ExampleBox } from "../ExampleBox";

interface StandardDetail {
  heading: string;
  type: "table" | "bullets" | "prose";
  data: any;
}

interface Standard {
  name: string;
  slug: string;
  subtitle: string;
  fullName: string;
  issuedBy: string;
  governs: string;
  details: StandardDetail[];
  reportRequirements: string;
  externalLink: string | null;
  workedExamples?: string[];
  scenarios?: string[];
  reportExcerpts?: string[];
}

interface RegulatoryStandardsSectionProps {
  data: Standard[];
  searchQuery?: string;
}

/**
 * Regulatory Standards section: left panel shows 8 standard names as clickable rows.
 * Right panel shows description, applications, roles, external link.
 */
export function RegulatoryStandardsSection({ data, searchQuery }: RegulatoryStandardsSectionProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>(data[0]?.slug || "");

  const filteredData = searchQuery
    ? data.filter((s) => {
        const q = searchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.fullName.toLowerCase().includes(q) ||
          s.governs.toLowerCase().includes(q) ||
          s.subtitle.toLowerCase().includes(q)
        );
      })
    : data;

  const selected = data.find((s) => s.slug === selectedSlug);

  return (
    <div className="flex flex-col md:flex-row min-h-[320px]">
      {/* Left panel — standards list */}
      <div className="w-full md:w-[40%] border-b md:border-b-0 md:border-r border-border">
        <div className="divide-y divide-border">
          {filteredData.map((standard) => (
            <button
              key={standard.slug}
              onClick={() => setSelectedSlug(standard.slug)}
              className={`w-full text-left px-4 py-3 flex items-center gap-2 transition-colors ${
                selectedSlug === standard.slug
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <ChevronRight
                className={`h-3 w-3 shrink-0 transition-transform ${
                  selectedSlug === standard.slug ? "rotate-90 text-primary" : ""
                }`}
              />
              <div className="min-w-0">
                <div className="text-sm truncate">{standard.name}</div>
                {standard.subtitle && (
                  <div className="text-xs text-muted-foreground/60 truncate">{standard.subtitle}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right panel — standard detail */}
      <div className="w-full md:w-[60%] p-5 overflow-y-auto">
        {selected ? (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground">{selected.name}</h4>
              {selected.fullName !== selected.name && (
                <p className="text-xs text-muted-foreground mt-0.5">{selected.fullName}</p>
              )}
            </div>

            {selected.issuedBy && (
              <div className="flex gap-2 text-xs">
                <span className="text-muted-foreground/60">Issued by:</span>
                <span className="text-muted-foreground">{selected.issuedBy}</span>
              </div>
            )}

            {selected.governs && (
              <div className="flex gap-2 text-xs">
                <span className="text-muted-foreground/60">Governs:</span>
                <span className="text-muted-foreground">{selected.governs}</span>
              </div>
            )}

            {/* Render detail subsections */}
            {selected.details.slice(0, 4).map((detail, i) => (
              <div key={i} className="space-y-1.5">
                <h5 className="text-xs font-medium text-foreground/70 uppercase tracking-wide">
                  {detail.heading}
                </h5>
                {detail.type === "table" && Array.isArray(detail.data) && (
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    {detail.data.slice(0, 6).map((row: any, j: number) => (
                      <div key={j} className="flex gap-2">
                        {Object.entries(row).map(([key, val]) => (
                          <span key={key}>
                            <span className="text-muted-foreground/50">{key}:</span> {String(val)}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                {detail.type === "bullets" && Array.isArray(detail.data) && (
                  <ul className="text-sm text-muted-foreground space-y-0.5">
                    {detail.data.slice(0, 6).map((item: string, j: number) => (
                      <li key={j} className="flex items-start gap-1.5">
                        <span className="text-muted-foreground/60 mt-0.5">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {detail.type === "prose" && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {String(detail.data).slice(0, 300)}
                    {String(detail.data).length > 300 ? "..." : ""}
                  </p>
                )}
              </div>
            ))}

            {selected.reportRequirements && (
              <div className="space-y-1">
                <h5 className="text-xs font-medium text-foreground/70 uppercase tracking-wide">
                  Report Requirements
                </h5>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selected.reportRequirements.slice(0, 200)}
                  {selected.reportRequirements.length > 200 ? "..." : ""}
                </p>
              </div>
            )}

            {selected.workedExamples && selected.workedExamples.length > 0 && (
              <ExampleBox examples={selected.workedExamples} title="Worked Examples" />
            )}

            {selected.scenarios && selected.scenarios.length > 0 && (
              <ExampleBox examples={selected.scenarios} title="Real-World Scenarios" />
            )}

            {selected.reportExcerpts && selected.reportExcerpts.length > 0 && (
              <div className="space-y-1.5">
                <h5 className="text-xs font-medium text-foreground/70 uppercase tracking-wide">
                  Report Excerpt
                </h5>
                {selected.reportExcerpts.map((excerpt, i) => (
                  <pre
                    key={i}
                    className="text-xs text-muted-foreground bg-secondary/50 rounded-md p-3 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed"
                  >
                    {excerpt}
                  </pre>
                ))}
              </div>
            )}

            {selected.externalLink && (
              <a
                href={selected.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors mt-2"
              >
                <ExternalLink className="h-3 w-3" />
                View standard reference
              </a>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Select a standard to view details.</p>
        )}
      </div>
    </div>
  );
}
