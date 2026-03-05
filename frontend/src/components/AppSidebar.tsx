import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FileText, Footprints, Brain, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { title: "Overview", path: "/", icon: LayoutDashboard },
  { title: "Clients", path: "/clients", icon: Users },
  { title: "Templates", path: "/templates", icon: FileText },
  { title: "Field Notes", path: "/field-notes", icon: Footprints },
  { title: "TIC Playbook", path: "/knowledge", icon: Brain },
];

/** Sidebar content shared between desktop aside and mobile overlay */
function SidebarContent({ connected, onNavClick }: { connected: boolean; onNavClick?: () => void }) {
  return (
    <>
      {/* Logo */}
      <div className="flex flex-col px-4 py-5 border-b border-border">
        {/* Collapsed: logo only (md–lg desktop) */}
        <div className="hidden md:flex lg:hidden justify-center">
          <img src="/logo_scope.png" alt="Scope AI" className="h-8 w-8 rounded" />
        </div>
        {/* Expanded: logo + text (mobile overlay + lg desktop) */}
        <div className="flex md:hidden lg:flex items-center gap-2.5">
          <img src="/logo_scope.png" alt="Scope AI" className="h-7 w-7 rounded shrink-0" />
          <span className="font-mono text-lg font-bold text-foreground tracking-tight leading-tight">DS-OS</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            onClick={onNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-l-2 border-primary text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary border-l-2 border-transparent"
              }`
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {/* Always show text in mobile overlay, hide on collapsed desktop */}
            <span className="inline lg:inline md:hidden">{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Connection indicator + User */}
      <div className="border-t border-border px-3 py-4 space-y-3">
        <div className="flex items-center gap-2 px-1">
          <span className={`inline-block h-2 w-2 rounded-full ${connected ? "bg-success" : "bg-muted-foreground"}`} />
          <span className="text-[10px] font-mono text-muted-foreground inline lg:inline md:hidden">
            {connected ? "Live" : "Offline"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-mono text-muted-foreground shrink-0">
            DS
          </div>
          <div className="block lg:block md:hidden min-w-0">
            <p className="text-sm font-medium text-foreground truncate">DS</p>
            <span className="inline-block mt-1 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/30">
              Deployment Strategist
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export function AppSidebar() {
  const { connected } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button — visible below md */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-card border border-border text-foreground md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          {/* Sidebar panel */}
          <aside className="fixed left-0 top-0 z-50 flex h-screen w-56 flex-col bg-sidebar border-r border-border md:hidden animate-in slide-in-from-left">
            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-3 p-1 text-muted-foreground hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent connected={connected} onNavClick={() => setMobileOpen(false)} />
          </aside>
        </>
      )}

      {/* Desktop sidebar — hidden below md */}
      <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-56 flex-col border-r border-border bg-sidebar lg:w-56 md:w-14">
        <SidebarContent connected={connected} />
      </aside>
    </>
  );
}
