import { useIsMobile } from "@/hooks/use-mobile";
import type { ClientApiResponse, ConstraintMapUser, FrictionPoint, ProductMatchEntry } from "@/types/client";

const severityClass: Record<string, string> = { blocking: "badge-blocking", degrading: "badge-degrading", minor: "badge-minor", High: "badge-blocking", Medium: "badge-degrading", Low: "badge-minor" };
const fitClass: Record<string, string> = { Strong: "badge-phase2", Partial: "badge-phase1", Gap: "badge-at-risk", "Gap (roadmap)": "badge-at-risk" };

/** Placeholder shown when a section doesn't have data yet */
function Placeholder({ section }: { section: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-8 text-center">
      <p className="text-sm text-muted-foreground italic">Not yet completed. Run the corresponding slash command to populate {section}.</p>
    </div>
  );
}

export function ClientConstraintMapTab({ client }: { client: ClientApiResponse }) {
  const isMobile = useIsMobile();
  const cm = client.constraintMap;
  if (!cm) return <Placeholder section="Constraint Map" />;

  const userMap = cm.userMap || [];
  const solutionsAudit = cm.solutionsAudit || {};
  const productMatch = cm.productMatch || [];
  const wedge = cm.wedgeUseCase || cm.wedge || "";

  return (
    <div className="space-y-6">
      {/* User Map */}
      <div className="rounded-lg border border-border bg-card">
        <div className="px-5 py-4 border-b border-border"><h3 className="text-sm font-semibold text-foreground">User Map</h3></div>
        {isMobile ? (
          <div className="divide-y divide-border">
            {userMap.map((u: ConstraintMapUser, i: number) => (
              <div key={i} className="p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-foreground">{u.userType || u.type}</h4>
                  <span className="font-mono text-xs text-muted-foreground">{u.count} users</span>
                </div>
                <div className="text-xs"><span className="text-muted-foreground">Pain:</span> <span className="text-foreground">{u.topPainPoint || u.painPoint}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Signal:</span> <span className="text-foreground">{u.adoptionSignal}</span></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">User Type</th>
                <th className="text-center px-3 py-3 font-medium">Count</th>
                <th className="text-left px-3 py-3 font-medium">Top Pain Point</th>
                <th className="text-left px-3 py-3 font-medium">Adoption Signal</th>
              </tr></thead>
              <tbody>{userMap.map((u: ConstraintMapUser, i: number) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 text-foreground font-medium">{u.userType || u.type}</td>
                  <td className="px-3 py-3 text-center font-mono text-muted-foreground">{u.count}</td>
                  <td className="px-3 py-3 text-muted-foreground">{u.topPainPoint || u.painPoint}</td>
                  <td className="px-3 py-3 text-muted-foreground">{u.adoptionSignal}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>

      {/* Solutions Audit */}
      {(solutionsAudit.frictionPoints || solutionsAudit.previousTools) && (
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Solutions Audit</h3>
          {solutionsAudit.previousTools && (
            <div>
              <span className="text-xs text-muted-foreground">Previous Tools:</span>
              <p className="text-sm text-foreground mt-1">{solutionsAudit.previousTools}</p>
            </div>
          )}
          {solutionsAudit.frictionPoints && (
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground">Friction Points:</span>
              {solutionsAudit.frictionPoints.map((fp: FrictionPoint, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded shrink-0 mt-0.5 ${severityClass[fp.severity] || "badge-minor"}`}>{fp.severity}</span>
                  <span className="text-sm text-foreground">{fp.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product Match */}
      {productMatch.length > 0 && (
        <div className="rounded-lg border border-border bg-card">
          <div className="px-5 py-4 border-b border-border"><h3 className="text-sm font-semibold text-foreground">Product Match</h3></div>
          {isMobile ? (
            <div className="divide-y divide-border">
              {productMatch.map((p: ProductMatchEntry, i: number) => (
                <div key={i} className="p-4 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-medium text-foreground">{p.need}</h4>
                    <span className={`text-[11px] font-mono px-2 py-1 rounded shrink-0 ${fitClass[p.fit] || "badge-minor"}`}>{p.fit}</span>
                  </div>
                  <div className="text-xs"><span className="text-muted-foreground">Capability:</span> <span className="text-foreground">{p.scopeCapability || p.capability}</span></div>
                  <div className="text-xs"><span className="text-muted-foreground">Priority:</span> <span className="font-mono text-foreground">{p.priority}</span></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-medium">Need</th>
                  <th className="text-left px-3 py-3 font-medium">Capability</th>
                  <th className="text-left px-3 py-3 font-medium">Fit</th>
                  <th className="text-left px-3 py-3 font-medium">Priority</th>
                </tr></thead>
                <tbody>{productMatch.map((p: ProductMatchEntry, i: number) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 text-foreground">{p.need}</td>
                    <td className="px-3 py-3 text-muted-foreground">{p.scopeCapability || p.capability}</td>
                    <td className="px-3 py-3"><span className={`text-[11px] font-mono px-2 py-1 rounded ${fitClass[p.fit] || "badge-minor"}`}>{p.fit}</span></td>
                    <td className="px-3 py-3 font-mono text-muted-foreground">{p.priority}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Wedge */}
      {wedge && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Wedge Use Case</h3>
          <p className="text-sm text-foreground">{wedge}</p>
        </div>
      )}
    </div>
  );
}
