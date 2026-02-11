import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface JournalEntryModalProps {
  entry: { id: string; content: string; created_at: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JournalEntryModal({ entry, open, onOpenChange }: JournalEntryModalProps) {
  if (!entry) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl border-border/40 bg-card/95 backdrop-blur-md shadow-card">
        <DialogHeader>
          <DialogDescription className="text-xs text-muted-foreground/50">
            {format(new Date(entry.created_at), "EEEE, MMMM d, yyyy · h:mm a")}
          </DialogDescription>
          <DialogTitle className="sr-only">Journal Entry</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap pr-4">
            {entry.content}
          </p>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
