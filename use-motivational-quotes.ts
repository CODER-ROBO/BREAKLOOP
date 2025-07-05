import { useState, useEffect } from "react";

export interface MotivationalQuote {
  text: string;
  author: string;
  category: "focus" | "balance" | "mindfulness" | "productivity" | "wellness";
}

const motivationalQuotes: MotivationalQuote[] = [
  {
    text: "The key to digital wellness is not avoiding technology, but using it intentionally.",
    author: "Digital Wellness Expert",
    category: "wellness"
  },
  {
    text: "Every moment of mindful screen time is a victory over mindless scrolling.",
    author: "Mindfulness Coach",
    category: "mindfulness"
  },
  {
    text: "Your attention is your most valuable asset - invest it wisely.",
    author: "Productivity Guru",
    category: "focus"
  },
  {
    text: "Balance is not about perfect restriction, but conscious choice.",
    author: "Life Balance Coach",
    category: "balance"
  },
  {
    text: "Small breaks create big breakthroughs in productivity and well-being.",
    author: "Wellness Advocate",
    category: "productivity"
  },
  {
    text: "The goal isn't to eliminate screen time, but to make every minute count.",
    author: "Digital Minimalist",
    category: "focus"
  },
  {
    text: "True freedom comes from choosing when and how to engage with technology.",
    author: "Tech Philosophy Writer",
    category: "wellness"
  },
  {
    text: "Mindful usage today creates healthier habits tomorrow.",
    author: "Behavioral Expert",
    category: "mindfulness"
  },
  {
    text: "Your digital habits shape your real-world experiences.",
    author: "Digital Wellness Researcher",
    category: "balance"
  },
  {
    text: "Progress, not perfection, is the path to digital wellness.",
    author: "Wellness Coach",
    category: "wellness"
  },
  {
    text: "Every conscious choice to step away from screens is an act of self-care.",
    author: "Self-Care Advocate",
    category: "mindfulness"
  },
  {
    text: "The most productive people know when to disconnect to reconnect.",
    author: "Productivity Expert",
    category: "productivity"
  },
  {
    text: "Your goals are closer than your next notification - stay focused.",
    author: "Focus Coach",
    category: "focus"
  },
  {
    text: "Digital boundaries create space for real-world connections.",
    author: "Relationship Expert",
    category: "balance"
  },
  {
    text: "Awareness is the first step toward intentional technology use.",
    author: "Digital Awareness Expert",
    category: "mindfulness"
  },
  {
    text: "Your screen time goals are investments in your future self.",
    author: "Personal Development Coach",
    category: "wellness"
  },
  {
    text: "Quality screen time over quantity - make every interaction meaningful.",
    author: "Digital Quality Advocate",
    category: "focus"
  },
  {
    text: "The power to change your digital habits lies within you.",
    author: "Change Management Expert",
    category: "productivity"
  },
  {
    text: "Celebrating small wins builds momentum for bigger changes.",
    author: "Success Coach",
    category: "wellness"
  },
  {
    text: "Your attention is precious - guard it like the treasure it is.",
    author: "Mindful Living Expert",
    category: "mindfulness"
  }
];

export function useMotivationalQuotes() {
  const [dailyQuote, setDailyQuote] = useState<MotivationalQuote | null>(null);

  useEffect(() => {
    // Get a consistent daily quote based on the current date
    const today = new Date().toDateString();
    const hash = today.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(hash) % motivationalQuotes.length;
    setDailyQuote(motivationalQuotes[index]);
  }, []);

  const getRandomQuote = (category?: MotivationalQuote['category']): MotivationalQuote => {
    const filteredQuotes = category 
      ? motivationalQuotes.filter(q => q.category === category)
      : motivationalQuotes;
    
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    return filteredQuotes[randomIndex];
  };

  const getQuoteByCategory = (category: MotivationalQuote['category']): MotivationalQuote[] => {
    return motivationalQuotes.filter(q => q.category === category);
  };

  return {
    dailyQuote,
    getRandomQuote,
    getQuoteByCategory,
    allQuotes: motivationalQuotes
  };
}