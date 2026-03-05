import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FileText, Footprints, Brain } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { title: "Overview", path: "/", icon: LayoutDashboard },
  { title: "Clients", path: "/clients", icon: Users },
  { title: "Templates", path: "/templates", icon: FileText },
  { title: "Field Notes", path: "/field-notes", icon: Footprints },
  { title: "TIC Playbook", path: "/knowledge", icon: Brain },
];

export function AppSidebar() {
  const { connected } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-border bg-sidebar lg:w-56 md:w-14">
      {/* Logo */}
      <div className="flex flex-col px-4 py-5 border-b border-border">
        <span className="font-mono text-lg font-bold text-foreground tracking-tight md:text-center lg:text-left">
          <span className="hidden md:inline lg:hidden">DS</span>
          <span className="md:hidden lg:inline">DS-OS</span>
        </span>
        <span className="text-xs text-muted-foreground mt-0.5 hidden lg:block">Scope AI</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-l-2 border-primary text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary border-l-2 border-transparent"
              }`
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="hidden lg:inline">{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Connection indicator + User */}
      <div className="border-t border-border px-3 py-4 space-y-3">
        <div className="flex items-center gap-2 px-1">
          <span className={`inline-block h-2 w-2 rounded-full ${connected ? "bg-success" : "bg-muted-foreground"}`} />
          <span className="text-[10px] font-mono text-muted-foreground hidden lg:inline">
            {connected ? "Live" : "Offline"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-mono text-muted-foreground shrink-0">
            DS
          </div>
          <div className="hidden lg:block min-w-0">
            <p className="text-sm font-medium text-foreground truncate">DS</p>
            <span className="inline-block mt-1 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/30">
              Deployment Strategist
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
