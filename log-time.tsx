import { useState } from "react";
import { ArrowLeft, Trash2, Quote } from "lucide-react";
import { PanelType } from "@/pages/home";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useMotivationalQuotes } from "@/hooks/use-motivational-quotes";
import { format } from "date-fns";
import { useScreenTime } from "@/hooks/use-screen-time";

interface LogTimeProps {
  onNavigate: (panel: PanelType) => void;
}

export default function LogTime({ onNavigate }: LogTimeProps) {
  const [category, setCategory] = useState("Social Media");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const { formatTime } = useScreenTime();
  const { getRandomQuote } = useMotivationalQuotes();

  const { data: recentSessions = [] } = useQuery({
    queryKey: ["/api/screen-time-sessions"],
  });

  const createSessionMutation = useMutation({
    mutationFn: async (data: { category: string; duration: number; notes?: string }) => {
      const response = await apiRequest("POST", "/api/screen-time-sessions", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/screen-time-sessions"] });
      toast({ title: "Session logged successfully!" });
      setHours("");
      setMinutes("");
      setNotes("");
    },
    onError: () => {
      toast({ title: "Failed to log session", variant: "destructive" });
    },
  });

  const deleteSessionMutation = useMutation({
    mutationFn: async (sessionId: number) => {
      await apiRequest("DELETE", `/api/screen-time-sessions/${sessionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/screen-time-sessions"] });
      toast({ title: "Session deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to delete session", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
    
    if (totalMinutes === 0) {
      toast({ title: "Please enter a valid time", variant: "destructive" });
      return;
    }

    createSessionMutation.mutate({
      category,
      duration: totalMinutes,
      notes: notes || undefined,
    });
  };

  const handleDelete = (sessionId: number) => {
    deleteSessionMutation.mutate(sessionId);
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
          <h2 className="text-2xl font-bold">Log Screen Time</h2>
          <div className="w-10"></div>
        </div>

        {/* Manual Time Entry */}
        <div className="bg-[var(--dark-surface)] rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add Session</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                App/Category
              </label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[var(--dark-elevated)] border border-[var(--dark-elevated)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="Social Media">Social Media</option>
                <option value="Work">Work</option>
                <option value="Games">Games</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Hours
                </label>
                <input 
                  type="number" 
                  min="0" 
                  max="24" 
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full bg-[var(--dark-elevated)] border border-[var(--dark-elevated)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" 
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Minutes
                </label>
                <input 
                  type="number" 
                  min="0" 
                  max="59" 
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="w-full bg-[var(--dark-elevated)] border border-[var(--dark-elevated)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" 
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Notes (Optional)
              </label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[var(--dark-elevated)] border border-[var(--dark-elevated)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" 
                rows={3} 
                placeholder="Add any notes about this session..."
              />
            </div>
            <button 
              type="submit" 
              disabled={createSessionMutation.isPending}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {createSessionMutation.isPending ? "Adding..." : "Add Session"}
            </button>
          </form>
        </div>

        {/* Motivational Quote */}
        <div className="bg-[var(--dark-surface)] rounded-2xl p-6 mb-6">
          <div className="flex items-center mb-3">
            <Quote className="w-5 h-5 text-[var(--primary)] mr-2" />
            <h3 className="text-lg font-semibold">Stay Motivated</h3>
          </div>
          <p className="text-[var(--text-primary)] italic mb-2">
            "{getRandomQuote("productivity").text}"
          </p>
          <p className="text-[var(--text-secondary)] text-sm">
            — {getRandomQuote("productivity").author}
          </p>
        </div>

        {/* Recent Sessions */}
        <div className="bg-[var(--dark-surface)] rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Sessions</h3>
          <div className="space-y-4">
            {recentSessions.length > 0 ? (
              recentSessions.slice(0, 10).map((session: any) => (
                <div key={session.id} className="flex items-center justify-between py-3 border-b border-[var(--dark-elevated)] last:border-b-0">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-semibold ${
                      session.category === 'Social Media' ? 'bg-[var(--primary)]' :
                      session.category === 'Work' ? 'bg-[var(--warning)]' :
                      session.category === 'Games' ? 'bg-[var(--success)]' :
                      session.category === 'Entertainment' ? 'bg-[var(--secondary)]' :
                      'bg-[var(--dark-elevated)]'
                    }`}>
                      {session.category === 'Social Media' ? '📱' :
                       session.category === 'Work' ? '💼' :
                       session.category === 'Games' ? '🎮' :
                       session.category === 'Entertainment' ? '🎬' :
                       '📊'}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">{session.category}</div>
                      <div className="text-sm text-[var(--text-secondary)]">
                        {format(new Date(session.createdAt), "MMM d, h:mm a")}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatTime(session.duration)}</div>
                    <button 
                      onClick={() => handleDelete(session.id)}
                      disabled={deleteSessionMutation.isPending}
                      className="text-sm text-[var(--destructive)] hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[var(--text-secondary)]">
                No sessions logged yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
