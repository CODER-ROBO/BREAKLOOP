import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X } from "lucide-react";
import { Achievement } from "@/components/achievement-badge";

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export default function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  if (!achievement) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.9 }}
        transition={{ duration: 0.5, type: "spring", damping: 20 }}
        className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-sm"
      >
        <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] p-1 rounded-xl shadow-2xl">
          <div className="bg-[var(--dark-bg)] rounded-lg p-4 relative">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-[var(--dark-surface)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-center space-x-3">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-[var(--primary)]"
              >
                <Trophy className="w-8 h-8" />
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-bold text-[var(--text-primary)]">Achievement Unlocked!</h3>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    🎉
                  </motion.div>
                </div>
                <p className="font-semibold text-[var(--primary)]">{achievement.title}</p>
                <p className="text-sm text-[var(--text-secondary)]">{achievement.description}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}