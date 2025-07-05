import { motion } from "framer-motion";
import { Clock, Coffee, Eye, Brain } from "lucide-react";
import { useMotivationalQuotes } from "@/hooks/use-motivational-quotes";

interface ReminderCardProps {
  totalScreenTime: number;
  goalMinutes: number;
  onTakeBreak?: () => void;
}

export default function ReminderCard({ totalScreenTime, goalMinutes, onTakeBreak }: ReminderCardProps) {
  const { getRandomQuote } = useMotivationalQuotes();
  
  const progressPercentage = Math.min((totalScreenTime / goalMinutes) * 100, 100);
  
  // Different reminders based on usage
  const getReminderContent = () => {
    if (progressPercentage >= 90) {
      return {
        icon: <Brain className="w-6 h-6" />,
        title: "Time for a Mental Break",
        message: "You've reached your daily goal. Consider wrapping up for healthier screen habits.",
        color: "var(--destructive)",
        quote: getRandomQuote("mindfulness"),
        action: "Take Break"
      };
    } else if (progressPercentage >= 70) {
      return {
        icon: <Eye className="w-6 h-6" />,
        title: "Give Your Eyes a Rest",
        message: "You're approaching your daily limit. Try the 20-20-20 rule: look at something 20 feet away for 20 seconds.",
        color: "var(--warning)",
        quote: getRandomQuote("balance"),
        action: "Quick Break"
      };
    } else if (totalScreenTime > 120) { // 2 hours
      return {
        icon: <Coffee className="w-6 h-6" />,
        title: "Time for a Quick Break",
        message: "You've been focused for a while. A short break can boost your productivity.",
        color: "var(--secondary)",
        quote: getRandomQuote("productivity"),
        action: "5 Min Break"
      };
    }
    
    return null;
  };

  const reminderContent = getReminderContent();
  
  if (!reminderContent) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[var(--dark-surface)] border border-[var(--dark-elevated)] rounded-2xl p-6 mb-6"
    >
      <div className="flex items-start space-x-4">
        <div 
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${reminderContent.color}20`, color: reminderContent.color }}
        >
          {reminderContent.icon}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-[var(--text-primary)] mb-2">
            {reminderContent.title}
          </h3>
          <p className="text-[var(--text-secondary)] mb-3">
            {reminderContent.message}
          </p>
          
          <div className="bg-[var(--dark-elevated)] rounded-lg p-3 mb-4">
            <p className="text-sm italic text-[var(--text-primary)]">
              "{reminderContent.quote.text}"
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              — {reminderContent.quote.author}
            </p>
          </div>
          
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onTakeBreak}
              className="px-4 py-2 rounded-lg font-medium transition-colors"
              style={{ 
                backgroundColor: reminderContent.color,
                color: 'white'
              }}
            >
              {reminderContent.action}
            </motion.button>
            <button className="px-4 py-2 bg-[var(--dark-elevated)] hover:bg-[var(--dark-elevated)]/80 rounded-lg font-medium transition-colors">
              Remind Later
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}