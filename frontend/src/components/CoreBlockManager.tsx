import { useState } from "react";
import { useApiData } from "@/hooks/useApiData";
import { BoxSelect, AlertTriangle, Check, X, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3001";

/** Core block shape from GET /api/templates/core-blocks */
interface CoreBlock {
  name: string;
  templates: string[];
  fields: string[];
  updated: string;
  reviewFlags: string[];
}

interface CoreBlockManagerProps {
  /** Only DS can approve/dismiss propagation and delete blocks */
  isDS?: boolean;
}

/** Authenticated fetch helper — re-authenticates as DS before each call */
async function authFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "DS", role: "ds" }),
  });
  const { token } = await loginRes.json();
  return fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Lists all core blocks with their linked templates and pending review flags.
 * DS can approve/dismiss propagation per template and delete blocks.
 */
export function CoreBlockManager({ isDS = false }: CoreBlockManagerProps) {
  const { data, loading } = useApiData<{ coreBlocks: CoreBlock[] }>("/api/templates/core-blocks", { coreBlocks: [] });
  const [dismissing, setDismissing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const coreBlocks = data.coreBlocks || [];

  if (loading) {
    return (
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Core Blocks</h2>
        <div className="animate-pulse h-24 bg-secondary rounded-lg" />
      </section>
    );
  }

  if (coreBlocks.length === 0) {
    return (
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Core Blocks</h2>
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <BoxSelect className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No core blocks extracted yet. Select rows in the pattern grid to create one.
          </p>
        </div>
      </section>
    );
  }

  /** Dismiss a review flag for a specific template on a block */
  const handleDismissFlag = async (blockName: string, templateSlug: string) => {
    const key = `${blockName}|${templateSlug}`;
    setDismissing(key);
    try {
      const block = coreBlocks.find(b => b.name === blockName);
      if (!block) return;

      // Remove the flag by updating the block with the flag removed
      const updatedFlags = block.reviewFlags.filter(f => f !== templateSlug);
      const res = await authFetch(`/api/templates/core-blocks/${encodeURIComponent(blockName)}`, {
        method: "PUT",
        body: JSON.stringify({ fields: block.fields, templates: block.templates }),
      });

      if (!res.ok) throw new Error("Update failed");
      toast.success(`Review dismissed for ${templateSlug}`);
      // react-query will refetch on interval
    } catch {
      toast.error("Failed to dismiss review flag");
    } finally {
      setDismissing(null);
    }
  };

  /** Delete an entire core block */
  const handleDelete = async (blockName: string) => {
    if (!confirm(`Delete core block "${blockName}"? This cannot be undone.`)) return;
    setDeleting(blockName);
    try {
      const res = await authFetch(`/api/templates/core-blocks/${encodeURIComponent(blockName)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success(`Core block "${blockName}" deleted`);
    } catch {
      toast.error("Failed to delete core block");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Core Blocks</h2>

      <div className="space-y-3">
        {coreBlocks.map(block => {
          const hasReviewFlags = block.reviewFlags.length > 0;

          return (
            <div key={block.name} className="rounded-lg border border-border bg-card p-4 space-y-3">
              {/* Block header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BoxSelect className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{block.name}</span>
                  {hasReviewFlags && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="h-2.5 w-2.5" />
                      {block.reviewFlags.length} review pending
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">
                    Updated {block.updated}
                  </span>
                  {isDS && (
                    <button
                      onClick={() => handleDelete(block.name)}
                      disabled={deleting === block.name}
                      className="p-1 rounded text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
                      title="Delete core block"
                    >
                      {deleting === block.name
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Trash2 className="h-3.5 w-3.5" />
                      }
                    </button>
                  )}
                </div>
              </div>

              {/* Fields */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Fields ({block.fields.length})</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {block.fields.map((f, i) => (
                    <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Linked templates */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Templates</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {block.templates.map(slug => {
                    const hasFlag = block.reviewFlags.includes(slug);
                    const isDismissing = dismissing === `${block.name}|${slug}`;

                    return (
                      <div
                        key={slug}
                        className={`flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded border ${
                          hasFlag
                            ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "border-border bg-secondary text-muted-foreground"
                        }`}
                      >
                        <span>{slug.replace(/_/g, " ")}</span>
                        {hasFlag && (
                          <>
                            <span className="text-[9px]">Core block changed - review</span>
                            {isDS && (
                              <div className="flex items-center gap-0.5 ml-1">
                                <button
                                  onClick={() => handleDismissFlag(block.name, slug)}
                                  disabled={isDismissing}
                                  className="p-0.5 rounded hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                                  title="Approve - dismiss review"
                                >
                                  {isDismissing
                                    ? <Loader2 className="h-2.5 w-2.5 animate-spin" />
                                    : <Check className="h-2.5 w-2.5 text-emerald-500" />
                                  }
                                </button>
                                <button
                                  onClick={() => handleDismissFlag(block.name, slug)}
                                  disabled={isDismissing}
                                  className="p-0.5 rounded hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                  title="Dismiss review"
                                >
                                  <X className="h-2.5 w-2.5 text-red-500" />
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
