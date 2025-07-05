import { useState, useEffect } from "react";
import { Achievement } from "@/components/achievement-badge";
import { ScreenTimeSession } from "@shared/schema";

export function useAchievements(sessions: ScreenTimeSession[], dailyGoalMinutes: number) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (!sessions || sessions.length === 0) {
      setAchievements([
        {
          id: "first_log",
          title: "Getting Started",
          description: "Log your first screen time session",
          icon: "clock",
          color: "#8B5CF6",
          unlocked: false,
          progress: 0,
          maxProgress: 1
        },
        {
          id: "goal_keeper",
          title: "Goal Keeper",
          description: "Stay under your daily goal",
          icon: "target",
          color: "#10B981",
          unlocked: false,
          progress: 0,
          maxProgress: 1
        },
        {
          id: "category_explorer",
          title: "Category Explorer",
          description: "Use all 5 app categories",
          icon: "award",
          color: "#F59E0B",
          unlocked: false,
          progress: 0,
          maxProgress: 5
        },
        {
          id: "consistent_tracker",
          title: "Consistent Tracker",
          description: "Log sessions for 7 days straight",
          icon: "calendar",
          color: "#3B82F6",
          unlocked: false,
          progress: 0,
          maxProgress: 7
        },
        {
          id: "mindful_user",
          title: "Mindful User",
          description: "Log 25 total sessions",
          icon: "trophy",
          color: "#EF4444",
          unlocked: false,
          progress: 0,
          maxProgress: 25
        },
        {
          id: "break_champion",
          title: "Break Champion",
          description: "Keep daily usage under 2 hours",
          icon: "clock",
          color: "#06B6D4",
          unlocked: false,
          progress: 0,
          maxProgress: 1
        }
      ]);
      return;
    }
    const calculateAchievements = () => {
      const todayStr = new Date().toDateString();
      const todaySessions = sessions.filter(session => 
        new Date(session.createdAt).toDateString() === todayStr
      );
      
      const totalToday = todaySessions.reduce((sum, session) => sum + session.duration, 0);
      const totalSessions = sessions.length;
      const categoriesUsed = Array.from(new Set(sessions.map(s => s.category))).length;
      
      // Calculate streak (consecutive days with sessions)
      const dates = sessions.map(s => new Date(s.createdAt).toDateString());
      const uniqueDates = Array.from(new Set(dates)).sort();
      let currentStreak = 0;
      
      for (let i = uniqueDates.length - 1; i >= 0; i--) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - currentStreak);
        if (uniqueDates[i] === checkDate.toDateString()) {
          currentStreak++;
        } else {
          break;
        }
      }

      const newAchievements: Achievement[] = [
        {
          id: "first_log",
          title: "Getting Started",
          description: "Log your first screen time session",
          icon: "clock",
          color: "#8B5CF6",
          unlocked: totalSessions >= 1,
          progress: Math.min(totalSessions, 1),
          maxProgress: 1
        },
        {
          id: "goal_keeper",
          title: "Goal Keeper",
          description: "Stay under your daily goal",
          icon: "target",
          color: "#10B981",
          unlocked: totalToday > 0 && totalToday <= dailyGoalMinutes,
          progress: totalToday <= dailyGoalMinutes ? 1 : 0,
          maxProgress: 1
        },
        {
          id: "category_explorer",
          title: "Category Explorer",
          description: "Use all 5 app categories",
          icon: "award",
          color: "#F59E0B",
          unlocked: categoriesUsed >= 5,
          progress: categoriesUsed,
          maxProgress: 5
        },
        {
          id: "consistent_tracker",
          title: "Consistent Tracker",
          description: "Log sessions for 7 days straight",
          icon: "calendar",
          color: "#3B82F6",
          unlocked: currentStreak >= 7,
          progress: currentStreak,
          maxProgress: 7
        },
        {
          id: "mindful_user",
          title: "Mindful User",
          description: "Log 25 total sessions",
          icon: "trophy",
          color: "#EF4444",
          unlocked: totalSessions >= 25,
          progress: totalSessions,
          maxProgress: 25
        },
        {
          id: "break_champion",
          title: "Break Champion",
          description: "Keep daily usage under 2 hours",
          icon: "clock",
          color: "#06B6D4",
          unlocked: totalToday > 0 && totalToday <= 120,
          progress: totalToday <= 120 ? 1 : 0,
          maxProgress: 1
        }
      ];

      setAchievements(newAchievements);
    };

    calculateAchievements();
  }, [sessions, dailyGoalMinutes]);

  const getUnlockedCount = () => achievements.filter(a => a.unlocked).length;
  const getTotalCount = () => achievements.length;
  const getRecentlyUnlocked = () => achievements.filter(a => a.unlocked).slice(-3);

  return {
    achievements,
    getUnlockedCount,
    getTotalCount,
    getRecentlyUnlocked
  };
}