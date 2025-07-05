import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SlidePanelProps {
  children: ReactNode;
  isActive: boolean;
  direction?: "left" | "right";
}

export default function SlidePanel({ children, isActive, direction = "right" }: SlidePanelProps) {
  return (
    <motion.div
      initial={{ x: direction === "right" ? "100%" : "-100%" }}
      animate={{ x: isActive ? 0 : direction === "right" ? "100%" : "-100%" }}
      exit={{ x: direction === "right" ? "-100%" : "100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="absolute inset-0 bg-[var(--dark-bg)]"
    >
      {children}
    </motion.div>
  );
}
