import { TrendingUp, Calendar, Target, Clock } from "lucide-react";
import { ScreenTimeSession } from "@shared/schema";
import { useScreenTime } from "@/hooks/use-screen-time";
import { format, subDays, startOfDay } from "date-fns";

interface StatsPanelProps {
  sessions: ScreenTimeSession[];
  dailyGoalMinutes: number;
}

export default function StatsPanel({ sessions, dailyGoalMinutes }: StatsPanelProps) {
  const { formatTime, calculateTotalTime } = useScreenTime();

  // Calculate weekly stats
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), i));
    const dayStr = date.toDateString();
    const daySessions = sessions.filter(session => 
      new Date(session.createdAt).toDateString() === dayStr
    );
    return {
      date,
      dayName: format(date, 'EEE'),
      total: calculateTotalTime(daySessions),
      sessions: daySessions.length
    };
  }).reverse();

  const weeklyTotal = last7Days.reduce((sum, day) => sum + day.total, 0);
  const weeklyAverage = Math.round(weeklyTotal / 7);
  const activeDays = last7Days.filter(day => day.total > 0).length;
  const goalDays = last7Days.filter(day => day.total > 0 && day.total <= dailyGoalMinutes).length;

  const maxDayTotal = Math.max(...last7Days.map(day => day.total), 1);

  return (
    <div className="bg-[var(--dark-surface)] rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Weekly Overview</h3>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[var(--dark-elevated)] rounded-lg p-3">
          <div className="flex items-center mb-1">
            <Clock className="w-4 h-4 text-[var(--primary)] mr-1" />
            <span className="text-xs text-[var(--text-secondary)]">Weekly Total</span>
          </div>
          <div className="font-semibold">{formatTime(weeklyTotal)}</div>
        </div>
        
        <div className="bg-[var(--dark-elevated)] rounded-lg p-3">
          <div className="flex items-center mb-1">
            <TrendingUp className="w-4 h-4 text-[var(--secondary)] mr-1" />
            <span className="text-xs text-[var(--text-secondary)]">Daily Average</span>
          </div>
          <div className="font-semibold">{formatTime(weeklyAverage)}</div>
        </div>
        
        <div className="bg-[var(--dark-elevated)] rounded-lg p-3">
          <div className="flex items-center mb-1">
            <Calendar className="w-4 h-4 text-[var(--warning)] mr-1" />
            <span className="text-xs text-[var(--text-secondary)]">Active Days</span>
          </div>
          <div className="font-semibold">{activeDays}/7</div>
        </div>
        
        <div className="bg-[var(--dark-elevated)] rounded-lg p-3">
          <div className="flex items-center mb-1">
            <Target className="w-4 h-4 text-[var(--success)] mr-1" />
            <span className="text-xs text-[var(--text-secondary)]">Goal Days</span>
          </div>
          <div className="font-semibold">{goalDays}/7</div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-[var(--text-secondary)]">Last 7 Days</h4>
        <div className="flex items-end justify-between h-20 gap-1">
          {last7Days.map((day, index) => {
            const heightPercentage = maxDayTotal > 0 ? (day.total / maxDayTotal) * 100 : 0;
            const isToday = day.date.toDateString() === new Date().toDateString();
            const isGoalMet = day.total > 0 && day.total <= dailyGoalMinutes;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="flex flex-col items-center justify-end h-16 w-full relative">
                  <div 
                    className={`w-full rounded-t transition-all ${
                      isGoalMet ? 'bg-[var(--success)]' : 
                      day.total > dailyGoalMinutes ? 'bg-[var(--warning)]' : 
                      'bg-[var(--dark-elevated)]'
                    } ${isToday ? 'ring-2 ring-[var(--primary)]' : ''}`}
                    style={{ height: `${heightPercentage}%` }}
                  />
                </div>
                <div className={`text-xs mt-1 ${isToday ? 'text-[var(--primary)] font-bold' : 'text-[var(--text-muted)]'}`}>
                  {day.dayName}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-[var(--text-muted)]">
          <span>🟢 Goal Met</span>
          <span>🟡 Over Goal</span>
          <span>⚫ No Data</span>
        </div>
      </div>
    </div>
  );
}