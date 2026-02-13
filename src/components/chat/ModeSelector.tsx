import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { COMPANION_MODES, type CompanionMode } from "@/hooks/useCompanionMode";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ModeSelectorProps {
  mode: CompanionMode;
  onModeChange: (mode: CompanionMode) => void;
}

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-end gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted/60 hover:bg-muted rounded-full border border-border/50 transition-colors">
            <span className="max-w-[140px] truncate">{mode}</span>
            <ChevronDown className="w-3 h-3 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72 p-2" sideOffset={8}>
          <div className="space-y-0.5">
            {COMPANION_MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => { onModeChange(m.value); setOpen(false); }}
                className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  mode === m.value ? "bg-primary/10" : "hover:bg-muted/60"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${mode === m.value ? "text-primary" : "text-foreground"}`}>
                    {m.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>
                </div>
                {mode === m.value && <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <span className="text-[10px] text-muted-foreground/60 hidden sm:inline">You can change this anytime.</span>
    </div>
  );
}
