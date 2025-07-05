import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WelcomeScreen from "@/components/welcome-screen";
import Dashboard from "@/components/dashboard";
import LogTime from "@/components/log-time";
import Goals from "@/components/goals";
import Settings from "@/components/settings";
import BottomNav from "@/components/bottom-nav";

export type PanelType = "welcome" | "dashboard" | "log-time" | "goals" | "settings";

export default function Home() {
  const [currentPanel, setCurrentPanel] = useState<PanelType>("welcome");

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[var(--dark-bg)]">
      <AnimatePresence mode="wait">
        {currentPanel === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <WelcomeScreen onGetStarted={() => setCurrentPanel("dashboard")} />
          </motion.div>
        )}
        
        {currentPanel === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Dashboard onNavigate={setCurrentPanel} />
          </motion.div>
        )}
        
        {currentPanel === "log-time" && (
          <motion.div
            key="log-time"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <LogTime onNavigate={setCurrentPanel} />
          </motion.div>
        )}
        
        {currentPanel === "goals" && (
          <motion.div
            key="goals"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Goals onNavigate={setCurrentPanel} />
          </motion.div>
        )}
        
        {currentPanel === "settings" && (
          <motion.div
            key="settings"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Settings onNavigate={setCurrentPanel} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {currentPanel !== "welcome" && (
        <BottomNav currentPanel={currentPanel} onNavigate={setCurrentPanel} />
      )}
    </div>
  );
}
