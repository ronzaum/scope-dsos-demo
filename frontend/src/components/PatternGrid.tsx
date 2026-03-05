import { useState, useMemo, useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { BoxSelect } from "lucide-react";

/** Cell data from the API grid response */
interface GridCell {
  section: string;
  template: string;
  matchLevel: "identical" | "near-identical" | "similar" | "unique" | "none";
  matchedFields: string[];
  present: boolean;
}

/** Template column metadata */
interface GridTemplate {
  slug: string;
  name: string;
  inspectionFamily: string;
}

/** Full grid payload from GET /api/templates/patterns */
export interface GridData {
  sections: string[];
  templates: GridTemplate[];
  cells: GridCell[];
}

/** Existing core block (to mark rows) */
interface CoreBlock {
  name: string;
  templates: string[];
  fields: string[];
  reviewFlags: string[];
}

/**
 * Red/blue gradient color scale for match intensity.
 * Red end = high overlap, grey = absent, blue = unique to one template.
 */
const CELL_COLOR: Record<string, string> = {
  identical: "bg-red-600",
  "near-identical": "bg-red-400",
  similar: "bg-red-300",
  unique: "bg-blue-400",
  none: "bg-muted",
};

/** Human-readable label for match level */
const MATCH_LABEL: Record<string, string> = {
  identical: "Identical",
  "near-identical": "Near-Identical",
  similar: "Similar",
  unique: "Unique to template",
  none: "Not present",
};

/** Tooltip badge color per match level */
const BADGE_CLASS: Record<string, string> = {
  identical: "bg-red-600/15 text-red-600 dark:text-red-400",
  "near-identical": "bg-red-400/15 text-red-500 dark:text-red-400",
  similar: "bg-red-300/15 text-red-400 dark:text-red-300",
  unique: "bg-blue-400/15 text-blue-600 dark:text-blue-400",
  none: "bg-muted text-muted-foreground",
};

interface PatternGridProps {
  grid: GridData;
  coreBlocks?: CoreBlock[];
  /** DS role enables row selection for core block extraction */
  isDS?: boolean;
  selectedSections?: string[];
  onSelectionChange?: (sections: string[]) => void;
}

/**
 * Mosaic heatmap: sections (rows) × templates (columns).
 * Small filled squares with gaps between them — background shows through.
 * Cursor-following tooltip on hover shows matched fields.
 * Template columns grouped by inspection family with extra gap separator.
 */
export function PatternGrid({ grid, coreBlocks = [], isDS = false, selectedSections = [], onSelectionChange }: PatternGridProps) {
  const [templateFilter, setTemplateFilter] = useState<Set<string>>(new Set());

  // Hover tooltip state: which cell is hovered and where the cursor is
  const [hoveredCell, setHoveredCell] = useState<GridCell | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Group templates by inspection family, preserving order
  const familyGroups = useMemo(() => {
    const groups: { family: string; templates: GridTemplate[] }[] = [];
    const seen = new Set<string>();
    for (const t of grid.templates) {
      if (!seen.has(t.inspectionFamily)) {
        seen.add(t.inspectionFamily);
        groups.push({ family: t.inspectionFamily, templates: [] });
      }
      groups.find(g => g.family === t.inspectionFamily)!.templates.push(t);
    }
    return groups;
  }, [grid.templates]);

  // Flat list of visible templates (respecting filter), with family group index for separators
  const visibleColumns = useMemo(() => {
    const cols: { template: GridTemplate; isFirstInGroup: boolean; groupIndex: number }[] = [];
    familyGroups.forEach((group, gi) => {
      const filtered = group.templates.filter(t => templateFilter.size === 0 || templateFilter.has(t.slug));
      filtered.forEach((t, ti) => {
        cols.push({ template: t, isFirstInGroup: ti === 0 && gi > 0, groupIndex: gi });
      });
    });
    return cols;
  }, [familyGroups, templateFilter]);

  // Lookup: "section|template" → cell
  const cellMap = useMemo(() => {
    const map = new Map<string, GridCell>();
    for (const c of grid.cells) {
      map.set(`${c.section}|${c.template}`, c);
    }
    return map;
  }, [grid.cells]);

  // Core block section names (normalised lowercase) for marking rows
  const coreBlockSections = useMemo(() => {
    const set = new Set<string>();
    for (const block of coreBlocks) {
      set.add(block.name.toLowerCase());
    }
    return set;
  }, [coreBlocks]);

  const toggleTemplateFilter = (slug: string) => {
    setTemplateFilter(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const toggleSectionSelection = (section: string) => {
    if (!onSelectionChange) return;
    const next = selectedSections.includes(section)
      ? selectedSections.filter(s => s !== section)
      : [...selectedSections, section];
    onSelectionChange(next);
  };

  // Hover handlers for the cursor-following tooltip
  const handleCellEnter = useCallback((cell: GridCell | undefined) => {
    if (cell) setHoveredCell(cell);
  }, []);
  const handleCellMove = useCallback((e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  }, []);
  const handleCellLeave = useCallback(() => {
    setHoveredCell(null);
  }, []);

  return (
    <div className="space-y-3">
      {/* Template filter chips — unchanged */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Filter:</span>
        {familyGroups.map(group => (
          <div key={group.family} className="flex items-center gap-1">
            {group.templates.map(t => (
              <button
                key={t.slug}
                onClick={() => toggleTemplateFilter(t.slug)}
                className={`text-[10px] font-mono px-2 py-1 rounded border transition-colors ${
                  templateFilter.size === 0 || templateFilter.has(t.slug)
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.name}
              </button>
            ))}
            <div className="w-px h-4 bg-border mx-1" />
          </div>
        ))}
        {templateFilter.size > 0 && (
          <button
            onClick={() => setTemplateFilter(new Set())}
            className="text-[10px] font-mono px-2 py-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Mosaic heatmap grid */}
      <div className="overflow-x-auto">
        {/* X-axis labels (template names) */}
        <div className="flex items-end mb-1" style={{ paddingLeft: isDS ? "calc(24px + 180px)" : "180px" }}>
          {visibleColumns.map(({ template: t, isFirstInGroup }) => (
            <div
              key={t.slug}
              className={`flex flex-col items-center ${isFirstInGroup ? "ml-2" : ""}`}
              style={{ width: 28, marginRight: 3 }}
            >
              <span
                className="text-[9px] font-mono text-muted-foreground truncate max-w-[28px] writing-mode-vertical"
                style={{ writingMode: "vertical-lr", transform: "rotate(180deg)", maxHeight: 80 }}
                title={t.name}
              >
                {t.name}
              </span>
            </div>
          ))}
        </div>

        {/* Grid rows: Y-axis label + squares */}
        {grid.sections.map(section => {
          const isCoreBlock = coreBlockSections.has(section.toLowerCase());
          const isSelected = selectedSections.includes(section);

          return (
            <div key={section} className="flex items-center mb-[3px]">
              {/* DS checkbox */}
              {isDS && (
                <div className="w-6 shrink-0 flex items-center justify-center">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleSectionSelection(section)}
                    className="h-3.5 w-3.5"
                  />
                </div>
              )}

              {/* Y-axis section label */}
              <div className="w-[180px] shrink-0 pr-3 flex items-center gap-1.5 min-h-[28px]">
                {isCoreBlock && (
                  <BoxSelect className="h-3 w-3 text-primary shrink-0" title="Part of a core block" />
                )}
                <span className="text-[10px] font-medium text-foreground truncate" title={section}>
                  {section}
                </span>
              </div>

              {/* Cell squares */}
              <div className="flex items-center">
                {visibleColumns.map(({ template: t, isFirstInGroup }) => {
                  const cell = cellMap.get(`${section}|${t.slug}`);
                  const level = cell?.matchLevel || "none";

                  return (
                    <div
                      key={t.slug}
                      className={`w-7 h-7 rounded-sm transition-all cursor-default ${CELL_COLOR[level]} ${
                        isFirstInGroup ? "ml-2" : ""
                      } ${
                        isSelected ? "ring-2 ring-primary" : "hover:ring-2 hover:ring-foreground/20"
                      }`}
                      style={{ marginRight: 3 }}
                      onMouseEnter={() => handleCellEnter(cell)}
                      onMouseMove={handleCellMove}
                      onMouseLeave={handleCellLeave}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend — square swatches */}
      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
        <span className="font-medium uppercase tracking-wider">Legend:</span>
        {(["identical", "near-identical", "similar", "unique", "none"] as const).map(level => (
          <span key={level} className="flex items-center gap-1">
            <span className={`inline-block w-3 h-3 rounded-sm ${CELL_COLOR[level]}`} />
            {MATCH_LABEL[level]}
          </span>
        ))}
      </div>

      {/* Cursor-following tooltip — renders at mouse position when hovering a cell */}
      {hoveredCell && (
        <div
          className="fixed z-50 pointer-events-none rounded-lg border border-border bg-popover p-3 shadow-lg text-xs space-y-2 max-w-[260px]"
          style={{ left: tooltipPos.x + 12, top: tooltipPos.y + 12 }}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium text-foreground truncate">{hoveredCell.section}</span>
            <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${BADGE_CLASS[hoveredCell.matchLevel]}`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-sm ${CELL_COLOR[hoveredCell.matchLevel]}`} />
              {MATCH_LABEL[hoveredCell.matchLevel]}
            </span>
          </div>
          {hoveredCell.matchedFields.length > 0 ? (
            <div>
              <p className="text-muted-foreground mb-1">Matched fields ({hoveredCell.matchedFields.length}):</p>
              <div className="flex flex-wrap gap-1">
                {hoveredCell.matchedFields.map((f, i) => (
                  <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              {hoveredCell.matchLevel === "unique" ? "Section only exists in this template" : "Not present in this template"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
