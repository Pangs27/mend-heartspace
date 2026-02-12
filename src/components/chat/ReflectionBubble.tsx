import { useState } from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type ReflectionPatternType = "recurrence" | "escalation" | "stabilization";

interface ReflectionBubbleProps {
  message: string;
  /** Reserved for future use — controls visual tint */
  patternType?: ReflectionPatternType;
  /** Reserved for future use — optional link to patterns page */
  showPatternsLink?: boolean;
  /** Called when user chooses "Don't show this again today" */
  onSuppressToday?: () => void;
}

export function ReflectionBubble({
  message,
  patternType: _patternType = "recurrence",
  showPatternsLink: _showPatternsLink = false,
  onSuppressToday,
}: ReflectionBubbleProps) {
  const [showExplainer, setShowExplainer] = useState(false);

  return (
    <>
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
          <button
            onClick={() => setShowExplainer(true)}
            className="mt-1.5 ml-4 text-[11px] text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors underline decoration-dotted underline-offset-2"
          >
            Why am I seeing this?
          </button>
        </div>
      </motion.div>

      <Dialog open={showExplainer} onOpenChange={setShowExplainer}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-base">About this reflection</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              This is based on patterns across your recent reflections. You're always in control.
            </DialogDescription>
          </DialogHeader>
          {onSuppressToday && (
            <div className="pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => {
                  onSuppressToday();
                  setShowExplainer(false);
                }}
              >
                Don't show this again today
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
