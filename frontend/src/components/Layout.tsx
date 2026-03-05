import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { KnowledgePanel } from "@/components/knowledge/KnowledgePanel";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, Brain } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <main className="flex-1 ml-0 md:ml-14 lg:ml-56 min-h-screen relative">
        {/* Top-right action buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-1 z-10">
          <button
            onClick={() => setKnowledgeOpen(true)}
            aria-label="Open TIC Playbook"
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Brain size={18} />
          </button>
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        <div className="p-4 md:p-6 lg:p-8 max-w-[1400px]">
          {children}
        </div>
      </main>

      <KnowledgePanel open={knowledgeOpen} onOpenChange={setKnowledgeOpen} />
    </div>
  );
}
