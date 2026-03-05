import { BookOpen, HelpCircle, Zap } from "lucide-react";

interface MiniPreviewProps {
  sectionId: string;
  data: any;
}

/**
 * Small visual preview rendered inside each SectionCard.
 * Mix of simple SVG mini-graphics and stat badges depending on section type.
 *
 * Future upgrade: hand-drawn illustrations per section for a more distinctive look.
 */
export function MiniPreview({ sectionId, data }: MiniPreviewProps) {
  switch (sectionId) {
    case "inspection-cycle":
      return <FlowPreview />;
    case "stakeholders":
      return <OrgPreview />;
    case "regulatory-standards":
      return <StatBadge icon={<BookOpen className="h-3.5 w-3.5" />} label="8 standards" />;
    case "report-structure":
      return <StackPreview />;
    case "success-questions":
      return <StatBadge icon={<HelpCircle className="h-3.5 w-3.5" />} label={getQuestionCount(data)} />;
    case "scope-product":
      return <StatBadge icon={<Zap className="h-3.5 w-3.5" />} label="45% faster" />;
    default:
      return null;
  }
}

/** Tiny 3-node flow line (SVG, ~60px tall) */
function FlowPreview() {
  return (
    <svg width="80" height="60" viewBox="0 0 80 60" className="text-blue-500/40">
      <circle cx="12" cy="10" r="4" fill="currentColor" />
      <line x1="12" y1="14" x2="40" y2="26" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="40" cy="30" r="4" fill="currentColor" />
      <line x1="40" y1="34" x2="68" y2="46" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="68" cy="50" r="4" fill="currentColor" />
    </svg>
  );
}

/** Dots-and-lines mini org graphic (SVG) */
function OrgPreview() {
  return (
    <svg width="80" height="60" viewBox="0 0 80 60" className="text-blue-500/40">
      {/* Top node */}
      <circle cx="40" cy="10" r="4" fill="currentColor" />
      {/* Lines to second row */}
      <line x1="40" y1="14" x2="20" y2="30" stroke="currentColor" strokeWidth="1.5" />
      <line x1="40" y1="14" x2="60" y2="30" stroke="currentColor" strokeWidth="1.5" />
      {/* Second row */}
      <circle cx="20" cy="34" r="3.5" fill="currentColor" />
      <circle cx="60" cy="34" r="3.5" fill="currentColor" />
      {/* Lines to third row */}
      <line x1="20" y1="37.5" x2="10" y2="50" stroke="currentColor" strokeWidth="1" />
      <line x1="20" y1="37.5" x2="30" y2="50" stroke="currentColor" strokeWidth="1" />
      <line x1="60" y1="37.5" x2="50" y2="50" stroke="currentColor" strokeWidth="1" />
      <line x1="60" y1="37.5" x2="70" y2="50" stroke="currentColor" strokeWidth="1" />
      {/* Third row */}
      <circle cx="10" cy="53" r="2.5" fill="currentColor" />
      <circle cx="30" cy="53" r="2.5" fill="currentColor" />
      <circle cx="50" cy="53" r="2.5" fill="currentColor" />
      <circle cx="70" cy="53" r="2.5" fill="currentColor" />
    </svg>
  );
}

/** Tiny vertical section stack (SVG, ~60px tall) */
function StackPreview() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" className="text-blue-500/40">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect
          key={i}
          x="8"
          y={4 + i * 8}
          width={44 - i * 2}
          height="5"
          rx="1.5"
          fill="currentColor"
          opacity={1 - i * 0.1}
        />
      ))}
    </svg>
  );
}

/** Stat badge with icon and label */
function StatBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/60 rounded-full px-3 py-1">
      {icon}
      <span>{label}</span>
    </div>
  );
}

/** Count total questions across all groups */
function getQuestionCount(data: any): string {
  if (!Array.isArray(data)) return "30 questions";
  const total = data.reduce((sum: number, group: any) => sum + (group.questions?.length || 0), 0);
  return `${total} questions`;
}
