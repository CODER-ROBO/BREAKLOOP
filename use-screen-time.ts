import { ScreenTimeSession } from "@shared/schema";

export interface CategoryTotal {
  category: string;
  totalTime: number;
  sessionCount: number;
}

export function useScreenTime() {
  const calculateTotalTime = (sessions: ScreenTimeSession[]): number => {
    return sessions.reduce((total, session) => total + session.duration, 0);
  };

  const calculateCategoryTotals = (sessions: ScreenTimeSession[]): CategoryTotal[] => {
    const categoryMap = new Map<string, CategoryTotal>();
    
    sessions.forEach(session => {
      const existing = categoryMap.get(session.category);
      if (existing) {
        existing.totalTime += session.duration;
        existing.sessionCount += 1;
      } else {
        categoryMap.set(session.category, {
          category: session.category,
          totalTime: session.duration,
          sessionCount: 1
        });
      }
    });

    return Array.from(categoryMap.values())
      .sort((a, b) => b.totalTime - a.totalTime);
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}m`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}m`;
    }
  };

  const getTimeFromSessions = (sessions: ScreenTimeSession[], category?: string): number => {
    const filteredSessions = category 
      ? sessions.filter(session => session.category === category)
      : sessions;
    
    return calculateTotalTime(filteredSessions);
  };

  return {
    calculateTotalTime,
    calculateCategoryTotals,
    formatTime,
    getTimeFromSessions
  };
}
