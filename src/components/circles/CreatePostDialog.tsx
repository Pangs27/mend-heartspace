import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { generateAlias } from "@/lib/aliasGenerator";
import { toast } from "sonner";

const supportTypes = [
  { value: "vent", label: "I need to vent" },
  { value: "perspective", label: "I would like perspective" },
  { value: "ideas", label: "I am looking for ideas that helped others" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  circleId: string;
  onCreated: () => void;
}

export default function CreatePostDialog({ open, onOpenChange, circleId, onCreated }: Props) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [supportType, setSupportType] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim() || !user) return;
    setSubmitting(true);
    const { error } = await supabase.from("circle_posts").insert({
      circle_id: circleId,
      user_id: user.id,
      alias: generateAlias(),
      title: title.trim(),
      body: body.trim(),
      support_type: supportType,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not share your post. Please try again.");
      return;
    }
    setTitle("");
    setBody("");
    setSupportType(null);
    onOpenChange(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Start a conversation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What has been on your mind lately..."
            className="rounded-xl border-border/60 bg-card"
            maxLength={200}
          />

          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share as much or as little as you would like..."
            className="min-h-[140px] rounded-xl border-border/60 bg-card resize-none"
            maxLength={5000}
          />

          {/* Support type */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">What kind of support are you looking for?</p>
            <div className="flex flex-wrap gap-2">
              {supportTypes.map((st) => (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => setSupportType(supportType === st.value ? null : st.value)}
                  className={`text-sm px-3.5 py-2 rounded-full border transition-all duration-200 tap-scale-sm ${
                    supportType === st.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border/60 text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSubmit}
              disabled={!title.trim() || !body.trim() || submitting}
              className="gradient-lilac text-primary-foreground border-0 shadow-soft hover:shadow-hover transition-all"
            >
              {submitting ? "Sharing…" : "Share"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
