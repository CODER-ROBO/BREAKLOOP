import { Settings, Plus, Target, Quote, Trophy } from "lucide-react";
import { PanelType } from "@/pages/home";
import { useQuery } from "@tanstack/react-query";
import { useScreenTime } from "@/hooks/use-screen-time";
import { useMotivationalQuotes } from "@/hooks/use-motivational-quotes";
import { useAchievements } from "@/hooks/use-achievements";
import AchievementBadge from "@/components/achievement-badge";
import StatsPanel from "@/components/stats-panel";
import ReminderCard from "@/components/reminder-card";
import { format } from "date-fns";

interface DashboardProps {
  onNavigate: (panel: PanelType) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const today = format(new Date(), "yyyy-MM-dd");
  const { data: todaySessions = [] } = useQuery({
    queryKey: ["/api/screen-time-sessions", today],
  });
  
  const { data: dailyGoal } = useQuery({
    queryKey: ["/api/daily-goal"],
  });

  const { calculateTotalTime, calculateCategoryTotals, formatTime } = useScreenTime();
  const { dailyQuote, getRandomQuote } = useMotivationalQuotes();
  
  const todayTotal = calculateTotalTime(todaySessions || []);
  const categoryTotals = calculateCategoryTotals(todaySessions || []);
  const goalMinutes = dailyGoal?.totalGoal || 360; // Default 6 hours
  const progressPercentage = Math.min((todayTotal / goalMinutes) * 100, 100);
  const strokeDashoffset = 282.6 - (282.6 * progressPercentage) / 100;

  // Get all sessions for achievements
  const { data: allSessions = [] } = useQuery({
    queryKey: ["/api/screen-time-sessions"],
  });
  
  const { achievements, getUnlockedCount, getTotalCount, getRecentlyUnlocked } = useAchievements(
    allSessions as any[] || [], 
    goalMinutes
  );

  // Get motivational quote based on progress
  const getProgressQuote = () => {
    if (progressPercentage <= 60) {
      return getRandomQuote("focus");
    } else if (progressPercentage <= 80) {
      return getRandomQuote("balance");
    } else {
      return getRandomQuote("mindfulness");
    }
  };

  return (
    <div className="bg-[var(--dark-bg)] overflow-y-auto h-full">
      <div className="p-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h2>
            <p className="text-[var(--text-secondary)]">
              {format(new Date(), "EEEE, MMMM d")}
            </p>
          </div>
          <button 
            onClick={() => onNavigate("settings")}
            className="p-2 rounded-lg bg-[var(--dark-surface)] hover:bg-[var(--dark-elevated)] transition-colors"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* Today's Progress */}
        <div className="bg-[var(--dark-surface)] rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Today's Progress</h3>
          <div className="flex items-center justify-between">
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle 
                  cx="64" 
                  cy="64" 
                  r="45" 
                  stroke="var(--dark-elevated)" 
                  strokeWidth="8" 
                  fill="none"
                />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="45" 
                  stroke="var(--primary)" 
                  strokeWidth="8" 
                  fill="none"
                  strokeLinecap="round" 
                  strokeDasharray="282.6" 
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--primary)]">
                    {formatTime(todayTotal)}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    of {formatTime(goalMinutes)} goal
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 ml-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Goal Progress</span>
                  <span className={`font-semibold ${
                    progressPercentage <= 80 ? 'text-[var(--success)]' : 'text-[var(--warning)]'
                  }`}>
                    {progressPercentage <= 80 ? `${(100 - progressPercentage).toFixed(0)}% under` : 'Over goal'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Sessions today</span>
                  <span className="text-[var(--text-primary)] font-semibold">
                    {todaySessions.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Most used</span>
                  <span className="text-[var(--text-primary)] font-semibold">
                    {categoryTotals.length > 0 ? categoryTotals[0].category : 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            onClick={() => onNavigate("log-time")}
            className="bg-[var(--dark-surface)] hover:bg-[var(--dark-elevated)] p-4 rounded-xl transition-colors"
          >
            <Plus className="text-[var(--primary)] w-8 h-8 mb-2 mx-auto" />
            <div className="text-sm font-semibold">Log Time</div>
          </button>
          <button 
            onClick={() => onNavigate("goals")}
            className="bg-[var(--dark-surface)] hover:bg-[var(--dark-elevated)] p-4 rounded-xl transition-colors"
          >
            <Target className="text-[var(--secondary)] w-8 h-8 mb-2 mx-auto" />
            <div className="text-sm font-semibold">Set Goals</div>
          </button>
        </div>

        {/* Smart Reminders */}
        <ReminderCard 
          totalScreenTime={todayTotal} 
          goalMinutes={goalMinutes}
          onTakeBreak={() => console.log('Take break')}
        />

        {/* Daily Quote */}
        {dailyQuote && (
          <div className="bg-[var(--dark-surface)] rounded-2xl p-6 mb-6">
            <div className="flex items-center mb-3">
              <Quote className="w-5 h-5 text-[var(--primary)] mr-2" />
              <h3 className="text-lg font-semibold">Daily Motivation</h3>
            </div>
            <p className="text-[var(--text-primary)] italic mb-2">
              "{dailyQuote.text}"
            </p>
            <p className="text-[var(--text-secondary)] text-sm">
              — {dailyQuote.author}
            </p>
          </div>
        )}

        {/* Achievements */}
        <div className="bg-[var(--dark-surface)] rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Trophy className="w-5 h-5 text-[var(--primary)] mr-2" />
              <h3 className="text-lg font-semibold">Achievements</h3>
            </div>
            <div className="text-sm text-[var(--text-secondary)]">
              {getUnlockedCount()}/{getTotalCount()}
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {getRecentlyUnlocked().map((achievement) => (
              <AchievementBadge 
                key={achievement.id} 
                achievement={achievement} 
                size="sm" 
              />
            ))}
            {getUnlockedCount() === 0 && (
              <div className="text-center py-4 text-[var(--text-secondary)] w-full">
                Start logging screen time to earn achievements!
              </div>
            )}
          </div>
        </div>

        {/* App Categories */}
        <div className="bg-[var(--dark-surface)] rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">App Categories Today</h3>
          <div className="space-y-4">
            {categoryTotals.length > 0 ? (
              categoryTotals.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-semibold ${
                      category.category === 'Social Media' ? 'bg-[var(--primary)]' :
                      category.category === 'Work' ? 'bg-[var(--warning)]' :
                      category.category === 'Games' ? 'bg-[var(--success)]' :
                      category.category === 'Entertainment' ? 'bg-[var(--secondary)]' :
                      'bg-[var(--dark-elevated)]'
                    }`}>
                      {category.category === 'Social Media' ? '📱' :
                       category.category === 'Work' ? '💼' :
                       category.category === 'Games' ? '🎮' :
                       category.category === 'Entertainment' ? '🎬' :
                       '📊'}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">{category.category}</div>
                      <div className="text-sm text-[var(--text-secondary)]">
                        {category.sessionCount} session{category.sessionCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatTime(category.totalTime)}</div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      {todayTotal > 0 ? Math.round((category.totalTime / todayTotal) * 100) : 0}%
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[var(--text-secondary)]">
                No screen time logged today
              </div>
            )}
          </div>
        </div>

        {/* Weekly Stats */}
        <StatsPanel 
          sessions={allSessions as any[] || []} 
          dailyGoalMinutes={goalMinutes} 
        />
      </div>
    </div>
  );
}
