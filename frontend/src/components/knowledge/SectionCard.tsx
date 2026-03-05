import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** 6 shades of blue — light-to-deep progression */
const TINTS: Record<string, string> = {
  "inspection-cycle": "bg-blue-400/5 hover:bg-blue-400/10",
  stakeholders: "bg-blue-500/5 hover:bg-blue-500/10",
  "regulatory-standards": "bg-blue-600/5 hover:bg-blue-600/10",
  "report-structure": "bg-blue-700/5 hover:bg-blue-700/10",
  "success-questions": "bg-blue-800/5 hover:bg-blue-800/10",
  "scope-product": "bg-blue-900/5 hover:bg-blue-900/10",
};

import { MiniPreview } from "./MiniPreview";

/** Resolve a Lucide icon name string to the actual component */
function resolveIcon(name: string): LucideIcon {
  const icon = (Icons as Record<string, LucideIcon>)[name];
  return icon || Icons.HelpCircle;
}

interface SectionCardProps {
  id: string;
  title: string;
  icon: string;
  description: string;
  data: any;
  expanded: boolean;
  onClick: () => void;
}

export function SectionCard({ id, title, icon, description, data, expanded, onClick }: SectionCardProps) {
  const Icon = resolveIcon(icon);
  const tint = TINTS[id] || "bg-secondary/50 hover:bg-secondary/80";

  return (
    <button
      onClick={onClick}
      className={`group w-full text-left rounded-xl border transition-all duration-200 p-6 flex flex-col items-center gap-4 h-48 overflow-hidden ${
        expanded
          ? "border-primary/40 ring-1 ring-primary/20 " + tint
          : "border-border " + tint
      }`}
    >
      <Icon className="h-10 w-10 text-foreground group-hover:text-foreground transition-colors" strokeWidth={1.5} />
      <div className="text-center w-full">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-foreground/90 mt-1">{description}</p>
      </div>
      <MiniPreview sectionId={id} data={data} />
    </button>
  );
}
