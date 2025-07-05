import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useMotivationalQuotes, MotivationalQuote } from "@/hooks/use-motivational-quotes";

interface QuoteCarouselProps {
  category?: MotivationalQuote['category'];
  autoAdvance?: boolean;
  interval?: number;
}

export default function QuoteCarousel({ 
  category, 
  autoAdvance = true, 
  interval = 8000 
}: QuoteCarouselProps) {
  const { getQuoteByCategory, allQuotes } = useMotivationalQuotes();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const quotes = category ? getQuoteByCategory(category) : allQuotes;

  useEffect(() => {
    if (!autoAdvance) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoAdvance, interval, quotes.length]);

  const nextQuote = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  const prevQuote = () => {
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  if (quotes.length === 0) return null;

  const currentQuote = quotes[currentIndex];

  return (
    <div className="bg-[var(--dark-surface)] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Quote className="w-5 h-5 text-[var(--primary)] mr-2" />
          <h3 className="text-lg font-semibold">Inspiration</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={prevQuote}
            className="p-1 rounded-lg bg-[var(--dark-elevated)] hover:bg-[var(--primary)] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextQuote}
            className="p-1 rounded-lg bg-[var(--dark-elevated)] hover:bg-[var(--primary)] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <p className="text-[var(--text-primary)] italic mb-3 leading-relaxed">
            "{currentQuote.text}"
          </p>
          <p className="text-[var(--text-secondary)] text-sm">
            — {currentQuote.author}
          </p>
        </motion.div>
      </AnimatePresence>

      {quotes.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex 
                  ? 'bg-[var(--primary)]' 
                  : 'bg-[var(--dark-elevated)] hover:bg-[var(--primary)]/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}