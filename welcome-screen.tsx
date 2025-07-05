import { useEffect } from "react";
import { motion } from "framer-motion";
import { useMotivationalQuotes } from "@/hooks/use-motivational-quotes";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const { getRandomQuote } = useMotivationalQuotes();
  const welcomeQuote = getRandomQuote("wellness");

  useEffect(() => {
    // Auto-navigate after 4 seconds (increased to allow reading quote)
    const timer = setTimeout(() => {
      onGetStarted();
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [onGetStarted]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[var(--dark-bg)] via-[var(--dark-surface)] to-[var(--dark-elevated)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-6"
      >
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-[var(--primary)] mb-2">BREAKLOOP</h1>
          <div className="w-24 h-1 bg-[var(--secondary)] mx-auto rounded-full"></div>
        </div>
        <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-md">
          Take control of your digital wellness.<br />
          Track, analyze, and reduce your screen time.
        </p>
        
        {/* Motivational Quote */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8 max-w-sm"
        >
          <p className="text-[var(--text-primary)] italic text-center mb-2">
            "{welcomeQuote.text}"
          </p>
          <p className="text-[var(--text-secondary)] text-sm">
            — {welcomeQuote.author}
          </p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGetStarted}
          className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg"
        >
          Get Started
        </motion.button>
      </motion.div>
    </div>
  );
}
