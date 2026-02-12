import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface JournalEntryTileProps {
  entry: {
    id: string;
    content: string;
    created_at: string;
  };
  index: number;
  onClick: () => void;
}

export function JournalEntryTile({ entry, index, onClick }: JournalEntryTileProps) {
  const preview = entry.content.length > 120
    ? entry.content.slice(0, 120).trimEnd() + "…"
    : entry.content;

  const dateLabel = format(new Date(entry.created_at), "MMM d, yyyy");

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      onClick={onClick}
      className="w-full text-left rounded-[1.125rem] border border-border/40 bg-card/60 backdrop-blur-sm p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-hover hover:border-border/60 tap-scale-sm"
    >
      <p className="text-xs text-muted-foreground/50 mb-2">{dateLabel}</p>
      <p className="text-sm text-foreground/70 leading-relaxed line-clamp-2 min-h-[2.75rem]">

        {preview}
      </p>
      <div className="flex justify-end mt-3">
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30" />
      </div>
    </motion.button>
  );
}
