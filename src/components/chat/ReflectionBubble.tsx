import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

export type ReflectionPatternType = "recurrence" | "escalation" | "stabilization";

interface ReflectionBubbleProps {
  message: string;
  /** Reserved for future use — controls visual tint */
  patternType?: ReflectionPatternType;
  /** Reserved for future use — optional link to patterns page */
  showPatternsLink?: boolean;
}

export function ReflectionBubble({
  message,
  patternType: _patternType = "recurrence",
  showPatternsLink: _showPatternsLink = false,
}: ReflectionBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex justify-start"
    >
      <div className="max-w-[70%]">
        <Separator className="mb-3 opacity-30" />
        <div className="px-4 py-2.5 rounded-full bg-lilac-50 border border-lilac-100/60">
          <p className="text-[13px] leading-relaxed text-muted-foreground italic">
            {message}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
