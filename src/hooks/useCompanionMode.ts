import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const COMPANION_MODES = [
  { value: "Reflect with me", description: "Gentle reflection and one curious question" },
  { value: "Sit with me", description: "Validation and presence, minimal questions" },
  { value: "Challenge me gently", description: "Soft reframes and pattern nudges" },
  { value: "Help me decide", description: "Options and one clarifying question" },
  { value: "Just listen", description: "Mirror and summarize, no advice" },
] as const;

export type CompanionMode = typeof COMPANION_MODES[number]["value"];

export function useCompanionMode(userId: string | undefined) {
  const [mode, setModeState] = useState<CompanionMode>("Reflect with me");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setIsLoading(false); return; }

    (async () => {
      const { data } = await supabase
        .from("mend_user_preferences")
        .select("companion_mode")
        .eq("user_id", userId)
        .maybeSingle();

      if (data?.companion_mode) {
        setModeState(data.companion_mode as CompanionMode);
      }
      setIsLoading(false);
    })();
  }, [userId]);

  const setMode = useCallback(async (newMode: CompanionMode) => {
    setModeState(newMode);
    if (!userId) return;

    const { error } = await supabase
      .from("mend_user_preferences")
      .upsert({ user_id: userId, companion_mode: newMode, updated_at: new Date().toISOString() }, { onConflict: "user_id" });

    if (error) console.error("Failed to save mode:", error);
  }, [userId]);

  return { mode, setMode, isLoading };
}
