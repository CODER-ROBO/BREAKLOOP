import { Home, Plus, Target, Settings } from "lucide-react";
import { PanelType } from "@/pages/home";

interface BottomNavProps {
  currentPanel: PanelType;
  onNavigate: (panel: PanelType) => void;
}

export default function BottomNav({ currentPanel, onNavigate }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[var(--dark-surface)] border-t border-[var(--dark-elevated)]">
      <div className="flex items-center justify-around py-3">
        <button 
          onClick={() => onNavigate("dashboard")}
          className={`flex flex-col items-center p-2 transition-colors ${
            currentPanel === "dashboard" ? "text-[var(--primary)]" : "text-[var(--text-secondary)] hover:text-[var(--primary)]"
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">Dashboard</span>
        </button>
        <button 
          onClick={() => onNavigate("log-time")}
          className={`flex flex-col items-center p-2 transition-colors ${
            currentPanel === "log-time" ? "text-[var(--primary)]" : "text-[var(--text-secondary)] hover:text-[var(--primary)]"
          }`}
        >
          <Plus className="w-6 h-6" />
          <span className="text-xs font-medium">Log Time</span>
        </button>
        <button 
          onClick={() => onNavigate("goals")}
          className={`flex flex-col items-center p-2 transition-colors ${
            currentPanel === "goals" ? "text-[var(--primary)]" : "text-[var(--text-secondary)] hover:text-[var(--primary)]"
          }`}
        >
          <Target className="w-6 h-6" />
          <span className="text-xs font-medium">Goals</span>
        </button>
        <button 
          onClick={() => onNavigate("settings")}
          className={`flex flex-col items-center p-2 transition-colors ${
            currentPanel === "settings" ? "text-[var(--primary)]" : "text-[var(--text-secondary)] hover:text-[var(--primary)]"
          }`}
        >
          <Settings className="w-6 h-6" />
          <span className="text-xs font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
}
