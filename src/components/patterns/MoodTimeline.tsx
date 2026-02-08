import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmotionalWeight } from "@/lib/emotionalWeight";

export interface MoodTimelineEntry {
  date: string;
  emotion: string;
  timeBucket: string;
  weight: EmotionalWeight;
}

interface MoodTimelineProps {
  entries: MoodTimelineEntry[];
}

// Soft color palettes based on emotional weight - uses design tokens
const weightStyles: Record<EmotionalWeight, { 
  bg: string; 
  glow: string;
  size: string;
}> = {
  light: {
    bg: "bg-mint-200/60",
    glow: "shadow-[0_0_20px_rgba(134,239,172,0.35)]",
    size: "w-8 h-8",
  },
  medium: {
    bg: "bg-muted-foreground/25",
    glow: "shadow-[0_0_16px_rgba(148,163,184,0.2)]",
    size: "w-10 h-10",
  },
  heavy: {
    bg: "bg-lilac-300/70",
    glow: "shadow-[0_0_24px_rgba(167,139,250,0.4)]",
    size: "w-12 h-12",
  },
};

// Generate gentle narrative phrases based on patterns
function getReflectivePhrase(entries: MoodTimelineEntry[], hoveredIndex: number): string {
  const entry = entries[hoveredIndex];
  const timeBucket = entry.timeBucket;
  const weight = entry.weight;
  
  // Count similar time buckets with similar weight
  const similarTimeEntries = entries.filter(e => e.timeBucket === timeBucket);
  const heavyCount = entries.filter(e => e.weight === "heavy").length;
  const lightCount = entries.filter(e => e.weight === "light").length;
  
  // Generate contextual phrases
  if (weight === "heavy" && similarTimeEntries.length >= 2) {
    const timeLabels: Record<string, string> = {
      morning: "Mornings",
      afternoon: "Afternoons", 
      evening: "Evenings",
      night: "Nights",
    };
    return `${timeLabels[timeBucket] || "This time"} have felt heavier lately.`;
  }
  
  if (weight === "light" && lightCount >= 2) {
    return "Some lighter moments are forming.";
  }
  
  if (heavyCount > lightCount && heavyCount >= 3) {
    return "A heavier thread is emerging over time.";
  }
  
  if (lightCount > heavyCount && lightCount >= 3) {
    return "Something gentler is taking shape.";
  }
  
  // Default contextual phrases
  const phrases: Record<EmotionalWeight, string[]> = {
    light: [
      "A softer moment, held here.",
      "Something lighter, forming.",
    ],
    medium: [
      "A quiet in-between.",
      "Neither here nor there.",
    ],
    heavy: [
      "Something weightier, resting.",
      "A heavier moment, acknowledged.",
    ],
  };
  
  const options = phrases[weight];
  return options[hoveredIndex % options.length];
}

function MoodOrb({ 
  entry, 
  index, 
  isHovered,
  onHover,
  onLeave,
}: { 
  entry: MoodTimelineEntry; 
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const styles = weightStyles[entry.weight];
  
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isHovered ? 1.15 : 1, 
        opacity: 1,
      }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.08,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onTouchStart={onHover}
      className={`
        ${styles.size} ${styles.bg} ${styles.glow}
        rounded-full blur-[1px] 
        transition-all duration-300 ease-out
        hover:blur-0 focus:blur-0 focus:outline-none
        cursor-default
      `}
      style={{
        // Slight vertical offset for organic feel
        transform: `translateY(${(index % 3 - 1) * 4}px)`,
      }}
      aria-label={`${entry.emotion} moment`}
    />
  );
}

export function MoodTimeline({ entries }: MoodTimelineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  if (entries.length === 0) return null;

  // Show max 7 entries for a clean horizontal flow
  const visibleEntries = entries.slice(0, 7);
  const reflectivePhrase = hoveredIndex !== null 
    ? getReflectivePhrase(visibleEntries, hoveredIndex) 
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="mt-12"
    >
      {/* Section header - gentle, non-demanding */}
      <p className="text-[11px] text-muted-foreground/50 uppercase tracking-widest mb-6 text-center">
        Forming over time
      </p>
      
      {/* Horizontal orb flow */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 py-6 px-4">
        {visibleEntries.map((entry, i) => (
          <MoodOrb 
            key={`${entry.date}-${i}`} 
            entry={entry} 
            index={i}
            isHovered={hoveredIndex === i}
            onHover={() => setHoveredIndex(i)}
            onLeave={() => setHoveredIndex(null)}
          />
        ))}
      </div>
      
      {/* Reflective phrase on hover - gentle fade */}
      <div className="h-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {reflectivePhrase && (
            <motion.p
              key={reflectivePhrase}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="text-sm text-muted-foreground/70 italic text-center"
            >
              {reflectivePhrase}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      
      {/* Subtle helper text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-[10px] text-muted-foreground/40 text-center mt-2"
      >
        Touch to reflect
      </motion.p>
    </motion.div>
  );
}
