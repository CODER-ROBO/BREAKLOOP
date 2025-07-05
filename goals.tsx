import { useState, useEffect } from "react";
import { ArrowLeft, Quote } from "lucide-react";
import { PanelType } from "@/pages/home";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useScreenTime } from "@/hooks/use-screen-time";
import { useMotivationalQuotes } from "@/hooks/use-motivational-quotes";

interface GoalsProps {
  onNavigate: (panel: PanelType) => void;
}

export default function Goals({ onNavigate }: GoalsProps) {
  const [dailyGoalHours, setDailyGoalHours] = useState(6);
  const [categoryLimits, setCategoryLimits] = useState({
    'Social Media': 120,
    'Games': 60,
    'Entertainment': 90,
    'Work': 480,
    'Other': 60
  });
  const [breakReminders, setBreakReminders] = useState(30);
  const [enableReminders, setEnableReminders] = useState(true);
  const { toast } = useToast();
  const { formatTime } = useScreenTime();
  const { getRandomQuote } = useMotivationalQuotes();

  const { data: currentGoal } = useQuery({
    queryKey: ["/api/daily-goal"],
  });

  useEffect(() => {
    if (currentGoal) {
      setDailyGoalHours(Math.floor(currentGoal.totalGoal / 60));
      try {
        const limits = JSON.parse(currentGoal.categoryLimits);
        setCategoryLimits(limits);
      } catch (e) {
        console.error('Failed to parse category limits:', e);
      }
      setBreakReminders(currentGoal.breakReminders);
      setEnableReminders(currentGoal.enableReminders === 'true');
    }
  }, [currentGoal]);

  const updateGoalMutation = useMutation({
    mutationFn: async (data: {
      totalGoal: number;
      categoryLimits: string;
      breakReminders: number;
      enableReminders: string;
    }) => {
      const response = await apiRequest("POST", "/api/daily-goal", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/daily-goal"] });
      toast({ title: "Goals updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update goals", variant: "destructive" });
    },
  });

  const handleUpdateGoal = () => {
    updateGoalMutation.mutate({
      totalGoal: dailyGoalHours * 60,
      categoryLimits: JSON.stringify(categoryLimits),
      breakReminders,
      enableReminders: enableReminders ? 'true' : 'false',
    });
  };

  const handleCategoryLimitChange = (category: string, value: number) => {
    setCategoryLimits(prev => ({
      ...prev,
      [category]: value
    }));
  };

  return (
    <div className="bg-[var(--dark-bg)] overflow-y-auto h-full">
      <div className="p-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => onNavigate("dashboard")}
            className="p-2 rounded-lg bg-[var(--dark-surface)] hover:bg-[var(--dark-elevated)] transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold">Goals & Targets</h2>
          <div className="w-10"></div>
        </div>

        {/* Daily Goal */}
        <div className="bg-[var(--dark-surface)] rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Daily Screen Time Goal</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Current Goal</span>
              <span className="text-2xl font-bold text-[var(--primary)]">
                {formatTime(dailyGoalHours * 60)}
              </span>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">
                Adjust Goal
              </label>
              <input 
                type="range" 
                min="1" 
                max="12" 
                value={dailyGoalHours}
                onChange={(e) => setDailyGoalHours(parseInt(e.target.value))}
                className="w-full h-2 bg-[var(--dark-elevated)] rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-[var(--text-muted)]">
                <span>1h</span>
                <span>12h</span>
              </div>
            </div>
            <button 
              onClick={handleUpdateGoal}
              disabled={updateGoalMutation.isPending}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {updateGoalMutation.isPending ? "Updating..." : "Update Goal"}
            </button>
          </div>
        </div>

        {/* Category Goals */}
        <div className="bg-[var(--dark-surface)] rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Category Limits</h3>
          <div className="space-y-4">
            {Object.entries(categoryLimits).map(([category, limit]) => (
              <div key={category} className="flex items-center justify-between p-4 bg-[var(--dark-elevated)] rounded-lg">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-semibold ${
                    category === 'Social Media' ? 'bg-[var(--primary)]' :
                    category === 'Work' ? 'bg-[var(--warning)]' :
                    category === 'Games' ? 'bg-[var(--success)]' :
                    category === 'Entertainment' ? 'bg-[var(--secondary)]' :
                    'bg-[var(--dark-elevated)]'
                  }`}>
                    {category === 'Social Media' ? '📱' :
                     category === 'Work' ? '💼' :
                     category === 'Games' ? '🎮' :
                     category === 'Entertainment' ? '🎬' :
                     '📊'}
                  </div>
                  <span className="ml-3 font-medium">{category}</span>
                </div>
                <div className="flex items-center">
                  <input 
                    type="number" 
                    value={limit}
                    onChange={(e) => handleCategoryLimitChange(category, parseInt(e.target.value) || 0)}
                    className="w-16 bg-[var(--dark-bg)] border border-[var(--dark-elevated)] rounded px-2 py-1 text-center text-sm"
                  />
                  <span className="ml-2 text-sm text-[var(--text-secondary)]">min</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="bg-[var(--dark-surface)] rounded-2xl p-6 mb-6">
          <div className="flex items-center mb-3">
            <Quote className="w-5 h-5 text-[var(--primary)] mr-2" />
            <h3 className="text-lg font-semibold">Focus on Balance</h3>
          </div>
          <p className="text-[var(--text-primary)] italic mb-2">
            "{getRandomQuote("balance").text}"
          </p>
          <p className="text-[var(--text-secondary)] text-sm">
            — {getRandomQuote("balance").author}
          </p>
        </div>

        {/* Break Reminders */}
        <div className="bg-[var(--dark-surface)] rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Break Reminders</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Enable Reminders</div>
                <div className="text-sm text-[var(--text-secondary)]">
                  Get notified when it's time for a break
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={enableReminders}
                  onChange={(e) => setEnableReminders(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[var(--dark-elevated)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--primary)]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Remind me every</span>
              <select 
                value={breakReminders}
                onChange={(e) => setBreakReminders(parseInt(e.target.value))}
                className="bg-[var(--dark-elevated)] border border-[var(--dark-elevated)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
