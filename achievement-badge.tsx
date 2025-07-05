import { motion } from "framer-motion";
import { Trophy, Target, Calendar, Clock, Award } from "lucide-react";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: "trophy" | "target" | "calendar" | "clock" | "award";
  color: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
}

export default function AchievementBadge({ achievement, size = "md" }: AchievementBadgeProps) {
  const getIcon = () => {
    const iconProps = {
      className: `${size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-8 h-8"}`
    };
    
    switch (achievement.icon) {
      case "trophy": return <Trophy {...iconProps} />;
      case "target": return <Target {...iconProps} />;
      case "calendar": return <Calendar {...iconProps} />;
      case "clock": return <Clock {...iconProps} />;
      case "award": return <Award {...iconProps} />;
      default: return <Trophy {...iconProps} />;
    }
  };

  const sizeClasses = {
    sm: "p-3 min-w-[120px]",
    md: "p-4 min-w-[140px]",
    lg: "p-6 min-w-[160px]"
  };

  const progressPercentage = achievement.maxProgress 
    ? Math.min((achievement.progress || 0) / achievement.maxProgress * 100, 100)
    : 100;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`${sizeClasses[size]} bg-[var(--dark-surface)] rounded-xl border-2 transition-all ${
        achievement.unlocked 
          ? `border-[${achievement.color}] shadow-lg shadow-[${achievement.color}]/20` 
          : "border-[var(--dark-elevated)] opacity-60"
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`mb-2 ${achievement.unlocked ? `text-[${achievement.color}]` : "text-[var(--text-muted)]"}`}>
          {getIcon()}
        </div>
        
        <h4 className={`font-semibold text-sm mb-1 ${
          achievement.unlocked ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
        }`}>
          {achievement.title}
        </h4>
        
        <p className={`text-xs mb-2 ${
          achievement.unlocked ? "text-[var(--text-secondary)]" : "text-[var(--text-muted)]"
        }`}>
          {achievement.description}
        </p>

        {achievement.maxProgress && (
          <div className="w-full">
            <div className="w-full bg-[var(--dark-elevated)] rounded-full h-2 mb-1">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  achievement.unlocked ? `bg-[${achievement.color}]` : "bg-[var(--text-muted)]"
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              {achievement.progress}/{achievement.maxProgress}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}