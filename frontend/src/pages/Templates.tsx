import { Layout } from "@/components/Layout";
import { useState, useCallback, useEffect } from "react";
import { useApiData } from "@/hooks/useApiData";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { FALLBACK_TEMPLATES } from "@/data/fallbacks";
import { ChevronDown, ChevronRight, FileText, Download, FileOutput, Loader2, CheckCircle2, AlertCircle, Pencil, BoxSelect } from "lucide-react";
import { PatternDetection } from "@/components/PatternDetection";
import { CoreBlockManager } from "@/components/CoreBlockManager";
import { TemplateRevenueContext } from "@/components/knowledge/TemplateRevenueContext";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3001";

/** Structured section returned by the API parser */
interface TemplateSection {
  name: string;
  confidence: string;        // emoji: 🟢 🟡 🟠
  confidenceLabel: string;   // "Regulatory" | "Industry Standard" | "Inferred"
  reason: string | null;     // author-written reason from | suffix
  problem: string;           // <=10 word problem summary (derived at parse time)
  recommendedFix: string;    // suggested fix (derived at parse time)
  successCriteria: string;   // what "fixed" looks like (derived at parse time)
}

/** Map confidence emoji → Tailwind dot color */
const confidenceDotColor: Record<string, string> = {
  "🟢": "bg-emerald-500",
  "🟡": "bg-amber-500",
  "🟠": "bg-orange-500",
};

const statusClass: Record<string, string> = {
  Draft: "badge-minor",
  Complete: "badge-phase1",
  "QA'd": "badge-phase2",
  Live: "badge-phase2",
};

type GenerateStatus = "idle" | "generating" | "ready" | "error";

interface OutputFile {
  filename: string;
  format: string;
  path: string;
  size: number;
}

interface OutputData {
  slug: string;
  files: OutputFile[];
  generatedAt: string | null;
}

interface TemplateListItem {
  slug: string;
  name: string;
  inspectionType: string;
  inspectionFamily: string;
  standard: string;
  status: string;
  created: string;
  sections: TemplateSection[];
  fieldCount: number;
  revenueContext: Record<string, unknown> | null;
}

interface TemplatesResponse {
  templates: TemplateListItem[];
  indexEntries: Record<string, unknown>[];
}

interface TemplateFullDetail extends TemplateListItem {
  rawContent?: string;
  revenueContext: Record<string, unknown> | null;
}

export default function Templates() {
  const { data, loading } = useApiData<TemplatesResponse>("/api/templates", FALLBACK_TEMPLATES);
  const { data: coreBlockDataRaw } = useApiData<any>("/api/templates/core-blocks", { coreBlocks: [] });
  const coreBlockData = (coreBlockDataRaw || { coreBlocks: [] }) as { coreBlocks: any[] };
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  // Core block extraction state (DS role — always true in demo)
  const isDS = true;
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [extractDialogOpen, setExtractDialogOpen] = useState(false);
  const [blockName, setBlockName] = useState("");
  const [extracting, setExtracting] = useState(false);
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-secondary rounded w-48" />
          <div className="h-64 bg-secondary rounded-lg" />
        </div>
      </Layout>
    );
  }

  const templates = data.templates || [];
  const statuses = ["all", "Draft", "Complete", "QA'd", "Live"];
  const filtered = filterStatus === "all"
    ? templates
    : templates.filter((t) => t.status === filterStatus);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Templates</h1>
        <p className="text-sm text-muted-foreground mt-1">Template specifications and pattern analysis</p>
      </div>

      {/* Template Index */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Template Library</h2>

        {/* Status filter */}
        <div className="flex gap-2 flex-wrap mb-4">
          {statuses.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`text-xs font-mono px-3 py-1.5 rounded border transition-colors ${filterStatus === s ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>

        {templates.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No templates yet. Run <span className="font-mono text-primary">/Template_Spec</span> to create one.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card divide-y divide-border">
            {/* Table header — hidden on mobile */}
            {!isMobile && (
              <div className="px-5 py-3 grid grid-cols-12 gap-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <div className="col-span-4">Name</div>
                <div className="col-span-2">Inspection Type</div>
                <div className="col-span-2">Standard</div>
                <div className="col-span-1 text-center">Fields</div>
                <div className="col-span-1 text-center">Status</div>
                <div className="col-span-2 text-center">Reports</div>
              </div>
            )}

            {filtered.map((t) => (
              <TemplateRow
                key={t.slug}
                template={t}
                expanded={expandedSlug === t.slug}
                onToggle={() => setExpandedSlug(expandedSlug === t.slug ? null : t.slug)}
                isMobile={isMobile}
              />
            ))}

            {filtered.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">No templates match the selected filter.</div>
            )}
          </div>
        )}
      </section>

      {/* Pattern Detection — heatmap grid hero + collapsible accordions */}
      <PatternDetection
        coreBlocks={coreBlockData.coreBlocks}
        isDS={isDS}
        selectedSections={selectedSections}
        onSelectionChange={setSelectedSections}
      />

      {/* Extract Core Block button — appears when DS has selected rows */}
      {isDS && selectedSections.length > 0 && (
        <div className="flex items-center gap-3 mt-4 mb-6 p-3 rounded-lg border border-primary/30 bg-primary/5">
          <BoxSelect className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm text-foreground">
            {selectedSections.length} section{selectedSections.length > 1 ? "s" : ""} selected
          </span>
          <button
            onClick={() => { setBlockName(""); setExtractDialogOpen(true); }}
            className="ml-auto flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded border border-primary bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <BoxSelect className="h-3 w-3" />
            Extract Core Block
          </button>
          <button
            onClick={() => setSelectedSections([])}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Core Block Extraction Dialog */}
      <Dialog open={extractDialogOpen} onOpenChange={setExtractDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BoxSelect className="h-5 w-5 text-primary" />
              Extract Core Block
            </DialogTitle>
            <DialogDescription>
              Create a shared core block from the selected sections. Updates to this block will flag linked templates for review.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Block name input */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Block Name</label>
              <input
                type="text"
                value={blockName}
                onChange={e => setBlockName(e.target.value)}
                placeholder="e.g. Universal Header, Thickness Survey Engine"
                className="w-full text-sm px-3 py-2 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Selected sections preview */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">
                Sections ({selectedSections.length})
              </label>
              <div className="flex flex-wrap gap-1">
                {selectedSections.map(s => (
                  <span key={s} className="text-[10px] font-mono px-2 py-1 rounded bg-secondary text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => setExtractDialogOpen(false)}
              className="text-xs font-mono px-3 py-1.5 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (!blockName.trim()) {
                  toast.error("Block name is required");
                  return;
                }
                setExtracting(true);
                try {
                  const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: "DS", role: "ds" }),
                  });
                  const { token } = await loginRes.json();
                  const res = await fetch(`${API_BASE}/api/templates/core-blocks`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      name: blockName.trim(),
                      fields: selectedSections,
                      templates: [],
                    }),
                  });
                  if (!res.ok) {
                    const err = await res.json().catch(() => ({ error: "Creation failed" }));
                    throw new Error(err.error || "Creation failed");
                  }
                  toast.success(`Core block "${blockName.trim()}" created`);
                  setExtractDialogOpen(false);
                  setSelectedSections([]);
                  setBlockName("");
                } catch (e: any) {
                  toast.error(e.message || "Failed to create core block");
                } finally {
                  setExtracting(false);
                }
              }}
              disabled={extracting || !blockName.trim()}
              className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded border border-primary bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {extracting ? <Loader2 className="h-3 w-3 animate-spin" /> : <BoxSelect className="h-3 w-3" />}
              {extracting ? "Creating..." : "Create Core Block"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Core Block Manager — lists all blocks with propagation review */}
      <div className="mt-8">
        <CoreBlockManager isDS={isDS} />
      </div>
    </Layout>
  );
}

/** Row for a single template — includes output status indicator */
function TemplateRow({ template: t, expanded, onToggle, isMobile }: { template: TemplateListItem; expanded: boolean; onToggle: () => void; isMobile?: boolean }) {
  const { apiFetch } = useAuth();
  const [outputData, setOutputData] = useState<OutputData | null>(null);

  // Check for existing outputs on mount
  useEffect(() => {
    apiFetch<OutputData>(`/api/templates/${t.slug}/output`).then(data => {
      if (data && data.files && data.files.length > 0) setOutputData(data);
    });
  }, [t.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasOutputs = outputData && outputData.files.length > 0;

  return (
    <div>
      {isMobile ? (
        <button onClick={onToggle} className="w-full p-4 text-left hover:bg-secondary/30 transition-colors space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {expanded ? <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" /> : <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />}
              <span className="text-sm font-medium text-foreground truncate">{t.name}</span>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 ${statusClass[t.status] || "badge-minor"}`}>{t.status}</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs ml-5">
            <div><span className="text-muted-foreground">Type:</span> <span className="text-foreground">{t.inspectionType}</span></div>
            <div><span className="text-muted-foreground">Standard:</span> <span className="text-foreground">{t.standard}</span></div>
            <div><span className="text-muted-foreground">Fields:</span> <span className="font-mono text-foreground">{t.fieldCount}</span></div>
            <div><span className="text-muted-foreground">Reports:</span> {hasOutputs ? <span className="text-emerald-600 dark:text-emerald-400">PPTX + PDF</span> : <span className="text-muted-foreground">—</span>}</div>
          </div>
        </button>
      ) : (
        <button
          onClick={onToggle}
          className="w-full px-5 py-4 grid grid-cols-12 gap-4 items-center text-left hover:bg-secondary/30 transition-colors"
        >
          <div className="col-span-4 flex items-center gap-2">
            {expanded ? <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" /> : <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />}
            <span className="text-sm font-medium text-foreground">{t.name}</span>
          </div>
          <div className="col-span-2 text-xs text-muted-foreground">{t.inspectionType}</div>
          <div className="col-span-2 text-xs text-muted-foreground">{t.standard}</div>
          <div className="col-span-1 text-center text-xs font-mono text-muted-foreground">{t.fieldCount}</div>
          <div className="col-span-1 text-center">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${statusClass[t.status] || "badge-minor"}`}>{t.status}</span>
          </div>
          <div className="col-span-2 text-center">
            {hasOutputs ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">PPTX + PDF</span>
            ) : (
              <span className="text-[10px] text-muted-foreground">—</span>
            )}
          </div>
        </button>
      )}
      {expanded && (
        <TemplateDetail slug={t.slug} onOutputGenerated={setOutputData} />
      )}
    </div>
  );
}

/** Compose a TLDR markdown body from flagged (non-green) template sections */
function generateEditTldr(templateName: string, sections: TemplateSection[]): string {
  const lines: string[] = [
    `Template "${templateName}" has ${sections.length} section${sections.length > 1 ? "s" : ""} requiring review:`,
    "",
  ];

  for (const s of sections) {
    const label = s.confidence === "🟠" ? "Inferred" : "Industry Standard";
    const dot = s.confidence === "🟠" ? "🟠" : "🟡";
    lines.push(`${dot} ${s.name} (${label})`);
    if (s.problem) lines.push(`   Problem: ${s.problem}`);
    if (s.recommendedFix) lines.push(`   Action: ${s.recommendedFix}`);
    if (s.successCriteria) lines.push(`   Success: ${s.successCriteria}`);
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}

/** Inline expanded template detail — fetches full content, shows generate + preview */
function TemplateDetail({ slug, onOutputGenerated }: { slug: string; onOutputGenerated: (data: OutputData) => void }) {
  const { data: template, loading: templateLoading } = useApiData<TemplateFullDetail>(`/api/templates/${slug}`, null);
  const { apiPost, apiFetch, apiDownload } = useAuth();

  const [generateStatus, setGenerateStatus] = useState<GenerateStatus>("idle");
  const [outputData, setOutputData] = useState<OutputData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [warningOpen, setWarningOpen] = useState(false);
  const [editRequested, setEditRequested] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [sendingToLinear, setSendingToLinear] = useState(false);
  // Review modal state — single TLDR body + optional comment
  const [reviewBody, setReviewBody] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  // Load existing outputs on mount
  useEffect(() => {
    apiFetch<OutputData>(`/api/templates/${slug}/output`).then(data => {
      if (data && data.files && data.files.length > 0) {
        setOutputData(data);
        setGenerateStatus("ready");
        onOutputGenerated(data);
        loadPdfPreview(slug, data);
      }
    });
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load PDF blob for iframe preview
  const loadPdfPreview = useCallback(async (templateSlug: string, data: OutputData) => {
    const pdfFile = data.files.find(f => f.format === "pdf");
    if (!pdfFile) return;
    try {
      // Fetch with auth
      const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "DS", role: "ds" }),
      });
      const loginData = await loginRes.json();
      const res = await fetch(`${API_BASE}${pdfFile.path}?inline=true`, {
        headers: { Authorization: `Bearer ${loginData.token}` },
      });
      if (!res.ok) return;
      const blob = await res.blob();
      setPdfBlobUrl(URL.createObjectURL(blob));
    } catch { /* preview not critical */ }
  }, []);

  const handleGenerate = async () => {
    setGenerateStatus("generating");
    setErrorMsg(null);
    setEditRequested(false);
    const result = await apiPost<any>(`/api/templates/${slug}/generate?format=both`);
    if (!result) {
      setGenerateStatus("error");
      setErrorMsg("Generation failed. Check server logs.");
      return;
    }
    // Fetch output listing for file sizes
    const output = await apiFetch<OutputData>(`/api/templates/${slug}/output`);
    if (output) {
      setOutputData(output);
      setGenerateStatus("ready");
      onOutputGenerated(output);
      loadPdfPreview(slug, output);
    } else {
      setGenerateStatus("ready");
    }
  };

  const handleDownload = (file: OutputFile) => {
    apiDownload(file.path, file.filename);
  };

  /** Gate generation behind warning panel when 🟠 Inferred sections exist */
  const inferredSections: TemplateSection[] = (template?.sections || []).filter(
    (s: TemplateSection) => s.confidence === "🟠"
  );

  const handleGenerateClick = () => {
    if (inferredSections.length > 0) {
      setWarningOpen(true);
    } else {
      handleGenerate();
    }
  };

  /** Non-green sections eligible for edit request */
  const flaggedSections: TemplateSection[] = (template?.sections || []).filter(
    (s: TemplateSection) => s.confidence === "🟡" || s.confidence === "🟠"
  );

  /** Open review modal — generate TLDR from flagged sections */
  const openReviewModal = () => {
    setReviewBody(generateEditTldr(template?.name || slug, flaggedSections));
    setReviewComment("");
    setReviewModalOpen(true);
  };

  /** Send batch to Linear via API */
  const handleSendToLinear = async () => {
    setSendingToLinear(true);
    try {
      // Authenticate — network errors here mean the API server is down
      let loginData: { token?: string };
      try {
        const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "DS", role: "ds" }),
        });
        if (!loginRes.ok) throw new Error(`Login failed (${loginRes.status})`);
        loginData = await loginRes.json();
      } catch (err) {
        const isNetwork = err instanceof TypeError;
        throw new Error(isNetwork ? "API server not responding - is it running?" : (err as Error).message);
      }

      const res = await fetch(`${API_BASE}/api/templates/${slug}/request-edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.token}`,
        },
        body: JSON.stringify({
          templateName: template?.name || slug,
          body: reviewBody,
          ...(reviewComment.trim() ? { comment: reviewComment.trim() } : {}),
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error || `Request failed (${res.status})`);
      }

      const data = await res.json();

      if (data.linearUrl) {
        toast.success(`Linear issue created: ${data.linearIssueId}`, {
          description: data.linearUrl,
          duration: 6000,
        });
      } else {
        toast.success(`Edit request ${data.id} saved (Linear unavailable)`);
      }

      setReviewModalOpen(false);
      setEditRequested(true);
    } catch (err) {
      toast.error((err as Error).message || "Failed to create edit request");
    } finally {
      setSendingToLinear(false);
    }
  };

  if (templateLoading || !template) {
    return <div className="px-5 pb-4 animate-pulse"><div className="h-32 bg-secondary rounded" /></div>;
  }

  const pptxFile = outputData?.files.find(f => f.format === "pptx");
  const pdfFile = outputData?.files.find(f => f.format === "pdf");

  return (
    <div className="px-5 pb-5 border-t border-border bg-secondary/10">
      <div className="py-4 space-y-4">
        {/* Revenue context bar — shows which clients this template covers */}
        <TemplateRevenueContext context={template.revenueContext || null} />

        {/* Sections list — colored confidence dots with hover tooltips */}
        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Sections ({template.sections?.length || 0})</h4>
          <div className="flex flex-wrap gap-2">
            {(template.sections || []).map((s: TemplateSection, i: number) => {
              const chip = (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded bg-secondary text-muted-foreground cursor-default">
                  <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${confidenceDotColor[s.confidence] || "bg-gray-400"}`} />
                  {s.name}
                </span>
              );

              // Non-green sections with a reason get a tooltip showing reason + action
              if (s.confidence !== "🟢" && s.reason) {
                const colorClass = s.confidence === "🟠"
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-amber-600 dark:text-amber-400";
                return (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>{chip}</TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-xs space-y-1 p-2.5">
                      <p className={`${colorClass} font-medium`}>{s.reason}</p>
                      {s.recommendedFix && (
                        <p className="text-muted-foreground">→ {s.recommendedFix}</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              // Green sections and sections without reason — no tooltip
              return <span key={i}>{chip}</span>;
            })}
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase">Standard</span>
            <p className="text-xs text-foreground mt-0.5">{template.standard}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase">Status</span>
            <p className="text-xs text-foreground mt-0.5">{template.status}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase">Fields</span>
            <p className="text-xs text-foreground mt-0.5">{template.fieldCount}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase">Created</span>
            <p className="text-xs text-foreground mt-0.5">{template.created || "—"}</p>
          </div>
        </div>

        {/* Report Generation Section */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Report Generation</h4>
            <div className="flex items-center gap-2">
              {generateStatus === "generating" && (
                <span className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                  <Loader2 className="h-3 w-3 animate-spin" /> Generating...
                </span>
              )}
              {generateStatus === "ready" && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Ready
                </span>
              )}
              {generateStatus === "error" && (
                <span className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="h-3 w-3" /> {errorMsg || "Error"}
                </span>
              )}
              {/* Request Edit — only when non-green sections exist */}
              {flaggedSections.length > 0 && (
                <button
                  onClick={openReviewModal}
                  disabled={editRequested}
                  className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded border transition-colors ${
                    editRequested
                      ? "border-border bg-secondary text-muted-foreground cursor-default"
                      : "border-orange-500 bg-orange-500/10 text-orange-600 hover:bg-orange-500/20"
                  }`}
                >
                  <Pencil className="h-3 w-3" />
                  {editRequested ? "Edit Requested" : "Request Edit"}
                </button>
              )}
              <button
                onClick={handleGenerateClick}
                disabled={generateStatus === "generating"}
                className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded border border-primary bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileOutput className="h-3 w-3" />
                {generateStatus === "ready" ? "Regenerate" : "Generate Report"}
              </button>
            </div>
          </div>

          {/* Download buttons */}
          {generateStatus === "ready" && outputData && (
            <div className="flex gap-2 mb-4">
              {pptxFile && (
                <button onClick={() => handleDownload(pptxFile)} className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
                  <Download className="h-3 w-3" />
                  PPTX ({formatBytes(pptxFile.size)})
                </button>
              )}
              {pdfFile && (
                <button onClick={() => handleDownload(pdfFile)} className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
                  <Download className="h-3 w-3" />
                  PDF ({formatBytes(pdfFile.size)})
                </button>
              )}
              {outputData.generatedAt && (
                <span className="text-[10px] text-muted-foreground self-center ml-2">
                  Generated {new Date(outputData.generatedAt).toLocaleString()}
                </span>
              )}
            </div>
          )}

          {/* PDF Preview */}
          {pdfBlobUrl && (
            <div className="rounded-lg border border-border overflow-hidden bg-background">
              <div className="px-3 py-2 border-b border-border bg-secondary/30">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">PDF Preview</span>
              </div>
              <iframe
                src={pdfBlobUrl}
                className="w-full h-[500px]"
                title="PDF Preview"
              />
            </div>
          )}
        </div>
      </div>

      {/* Pre-send warning dialog for 🟠 Inferred sections */}
      <AlertDialog open={warningOpen} onOpenChange={setWarningOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-orange-500" />
              Inferred Sections Detected
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>This template has {inferredSections.length} section{inferredSections.length > 1 ? "s" : ""} based on inferred data. Review before generating:</p>
                <ul className="space-y-2">
                  {inferredSections.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                      <div>
                        <span className="font-medium text-foreground">{s.name}</span>
                        {s.reason && <span className="text-muted-foreground"> - {s.reason}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review Later</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setWarningOpen(false); handleGenerate(); }}>
              Generate Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Review Modal — batch edit request to Linear */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-orange-500" />
              Request Template Edit
            </DialogTitle>
            <DialogDescription>
              Sent to: <span className="font-medium text-foreground">Ron Zaum</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Auto-generated TLDR — editable */}
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Issue Summary</label>
              <textarea
                value={reviewBody}
                onChange={e => setReviewBody(e.target.value)}
                rows={10}
                className="w-full text-xs font-mono px-3 py-2 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
            </div>

            {/* Optional comment */}
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Comment <span className="text-muted-foreground/60">(optional)</span>
              </label>
              <textarea
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                rows={3}
                placeholder="Any additional context..."
                className="w-full text-xs px-3 py-2 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => setReviewModalOpen(false)}
              className="text-xs font-mono px-3 py-1.5 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendToLinear}
              disabled={sendingToLinear}
              className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded border border-orange-500 bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendingToLinear ? <Loader2 className="h-3 w-3 animate-spin" /> : <Pencil className="h-3 w-3" />}
              {sendingToLinear ? "Sending..." : "Send to Linear"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Format bytes to human-readable string */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
