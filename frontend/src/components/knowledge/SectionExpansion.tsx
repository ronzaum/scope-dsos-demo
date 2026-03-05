import { InspectionCycleSection } from "./sections/InspectionCycleSection";
import { StakeholderMapSection } from "./sections/StakeholderMapSection";
import { RegulatoryStandardsSection } from "./sections/RegulatoryStandardsSection";
import { ReportStructureSection } from "./sections/ReportStructureSection";
import { SuccessQuestionsSection } from "./sections/SuccessQuestionsSection";
import { ScopeProductSection } from "./sections/ScopeProductSection";
import { ClientSegmentationSection } from "./sections/ClientSegmentationSection";

interface SectionExpansionProps {
  sectionId: string;
  data: any;
  searchQuery?: string;
}

/**
 * Routes to the correct section-specific component based on sectionId.
 * Each section handles its own list/detail layout, search filtering, and selection state.
 */
export function SectionExpansion({ sectionId, data, searchQuery }: SectionExpansionProps) {
  if (!data) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        No data available for this section.
      </div>
    );
  }

  const sectionContent = (() => {
    switch (sectionId) {
      case "inspection-cycle":
        return <InspectionCycleSection data={data} searchQuery={searchQuery} />;
      case "stakeholders":
        return <StakeholderMapSection data={data} searchQuery={searchQuery} />;
      case "regulatory-standards":
        return <RegulatoryStandardsSection data={data} searchQuery={searchQuery} />;
      case "report-structure":
        return <ReportStructureSection data={data} searchQuery={searchQuery} />;
      case "success-questions":
        return <SuccessQuestionsSection data={data} searchQuery={searchQuery} />;
      case "scope-product":
        return <ScopeProductSection data={data} searchQuery={searchQuery} />;
      case "client-types":
        return <ClientSegmentationSection data={data} searchQuery={searchQuery} />;
      default:
        return (
          <div className="p-6 text-sm text-muted-foreground">
            Unknown section: {sectionId}
          </div>
        );
    }
  })();

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {sectionContent}
    </div>
  );
}
