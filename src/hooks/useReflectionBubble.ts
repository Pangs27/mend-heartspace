import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { classifyIntent, isReceptive, type UserIntent } from "@/lib/intentClassifier";

// Crisis keywords — never trigger reflection on these
const CRISIS_KEYWORDS = [
  "suicide", "kill myself", "end it all", "don't want to live",
  "self-harm", "hurt myself", "cutting", "overdose",
  "want to die", "no reason to live", "can't go on",
];

interface SignalRow {
  primary_emotion: string;
  context: string;
  intensity: string;
  time_bucket: string;
  created_at: string | null;
}

const intensityMap: Record<string, number> = {
  low: 1, mild: 1.5, moderate: 2.5, medium: 2.5,
  high: 3.5, intense: 4, extreme: 5,
};

function toNum(raw: string): number {
  return intensityMap[raw.toLowerCase().trim()] ?? 2.5;
}

function mean(vals: number[]): number {
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

function containsCrisisContent(messages: { content: string }[]): boolean {
  const recent = messages.slice(-3);
  return recent.some((m) =>
    CRISIS_KEYWORDS.some((kw) => m.content.toLowerCase().includes(kw))
  );
}

// Friendly emotion labels for copy
const emotionLabel: Record<string, string> = {
  heavy: "heavy", anxious: "uneasy", sad: "sadness", anger: "frustration",
  lonely: "lonely", overwhelmed: "overwhelmed", guilt: "guilt", shame: "shame",
  fear: "fearful", grief: "grief", content: "at ease", hopeful: "hopeful",
  confused: "confused", restless: "restless", numb: "numb",
};

function friendlyEmotion(raw: string): string {
  return emotionLabel[raw.toLowerCase().trim()] || raw.toLowerCase().trim();
}

function friendlyContext(raw: string): string {
  const map: Record<string, string> = {
    work: "Work", relationships: "Relationships", relationship: "Relationships",
    family: "Family", self: "Self-reflection", health: "Well-being",
    sleep: "Rest", future: "The future", past: "The past",
    loss: "Loss", change: "Change", uncertainty: "Uncertainty",
    routine: "Daily rhythm", daily: "Daily rhythm",
  };
  return map[raw.toLowerCase().trim()] || raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
}

// localStorage helpers for frequency control
const LAST_BUBBLE_KEY = "mend_last_bubble_at";
const SUPPRESS_TODAY_KEY = "mend_suppress_bubble_date";

function canShowByFrequency(): boolean {
  // "Don't show again today" check
  const suppressDate = localStorage.getItem(SUPPRESS_TODAY_KEY);
  if (suppressDate === new Date().toISOString().slice(0, 10)) return false;

  // 10-minute cooldown
  const lastStr = localStorage.getItem(LAST_BUBBLE_KEY);
  if (lastStr) {
    const elapsed = Date.now() - parseInt(lastStr, 10);
    if (elapsed < 10 * 60 * 1000) return false;
  }
  return true;
}

function markBubbleShown() {
  localStorage.setItem(LAST_BUBBLE_KEY, Date.now().toString());
}

export interface ReflectionResult {
  message: string;
  triggerType: "emotion" | "context" | "escalation" | "time_bucket";
}

export function useReflectionBubble(userId: string | undefined) {
  const [reflectionData, setReflectionData] = useState<ReflectionResult | null>(null);
  const hasTriggeredRef = useRef(false);
  const lastTriggerIndexRef = useRef(-1);

  const evaluate = useCallback(
    async (
      messages: { role: string; content: string }[],
      currentAssistantIndex: number
    ) => {
      // Scarcity: max 1 per session
      if (hasTriggeredRef.current) return;
      if (!userId) return;

      // Frequency controls
      if (!canShowByFrequency()) return;

      // Never on consecutive assistant replies
      if (currentAssistantIndex - lastTriggerIndexRef.current <= 2) {
        lastTriggerIndexRef.current = currentAssistantIndex;
        return;
      }

      // Crisis safety check
      if (containsCrisisContent(messages)) return;

      // Need at least 3 user messages in session before considering
      const userMessages = messages.filter((m) => m.role === "user");
      if (userMessages.length < 3) return;

      // Intent & receptivity gate
      const lastUserMsg = userMessages[userMessages.length - 1];
      if (!lastUserMsg) return;

      const intent: UserIntent = classifyIntent(lastUserMsg.content);
      if (intent !== "disclosure" && intent !== "pattern_curiosity") return;
      if (!isReceptive(lastUserMsg.content)) return;

      try {
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

        const { data, error } = await supabase
          .from("mend_signals")
          .select("primary_emotion, context, intensity, time_bucket, created_at")
          .eq("user_id", userId)
          .gte("created_at", fourteenDaysAgo.toISOString())
          .order("created_at", { ascending: false })
          .limit(50);

        if (error || !data || data.length < 3) return;

        const signals = data as SignalRow[];
        const now = new Date();
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const recentSignals = signals.filter(
          (s) => s.created_at && new Date(s.created_at) >= oneWeekAgo
        );
        const priorSignals = signals.filter(
          (s) => s.created_at && new Date(s.created_at) < oneWeekAgo
        );

        if (recentSignals.length < 3) return;

        let result: ReflectionResult | null = null;

        // Check 1: Same primary_emotion ≥ 3 times in last 7 days
        const emotionFreq = new Map<string, number>();
        for (const s of recentSignals) {
          const e = s.primary_emotion.toLowerCase();
          emotionFreq.set(e, (emotionFreq.get(e) || 0) + 1);
        }
        for (const [emotion, count] of emotionFreq) {
          if (count >= 3) {
            const label = friendlyEmotion(emotion);
            result = {
              message: `That ${label} feeling has been returning in a few moments lately. What does it feel like when it shows up?`,
              triggerType: "emotion",
            };
            break;
          }
        }

        // Check 2: Same context ≥ 3 times in last 7 days
        if (!result) {
          const ctxFreq = new Map<string, number>();
          for (const s of recentSignals) {
            const c = s.context.toLowerCase();
            ctxFreq.set(c, (ctxFreq.get(c) || 0) + 1);
          }
          for (const [ctx, count] of ctxFreq) {
            if (count >= 3) {
              const label = friendlyContext(ctx);
              result = {
                message: `${label} has been showing up a lot in your reflections recently. What feels different about it today?`,
                triggerType: "context",
              };
              break;
            }
          }
        }

        // Check 3: Average intensity rising
        if (!result && priorSignals.length >= 2) {
          const recentAvg = mean(recentSignals.map((s) => toNum(s.intensity)));
          const priorAvg = mean(priorSignals.map((s) => toNum(s.intensity)));
          if (recentAvg > priorAvg + 0.5) {
            result = {
              message: "It sounds like things have been feeling heavier lately. How does that land for you?",
              triggerType: "escalation",
            };
          }
        }

        // Check 4: Same emotion across multiple time buckets
        if (!result) {
          const emotionBuckets = new Map<string, Set<string>>();
          for (const s of recentSignals) {
            const e = s.primary_emotion.toLowerCase();
            if (!emotionBuckets.has(e)) emotionBuckets.set(e, new Set());
            emotionBuckets.get(e)!.add(s.time_bucket.toLowerCase());
          }
          for (const [emotion, buckets] of emotionBuckets) {
            if (buckets.size >= 2) {
              const label = friendlyEmotion(emotion);
              result = {
                message: `That ${label} feeling seems to come up at different times of day. Have you noticed that too?`,
                triggerType: "time_bucket",
              };
              break;
            }
          }
        }

        if (result) {
          hasTriggeredRef.current = true;
          lastTriggerIndexRef.current = currentAssistantIndex;
          markBubbleShown();
          setReflectionData(result);
        }
      } catch (err) {
        console.error("Reflection evaluation failed:", err);
      }
    },
    [userId]
  );

  const reset = useCallback(() => {
    hasTriggeredRef.current = false;
    lastTriggerIndexRef.current = -1;
    setReflectionData(null);
  }, []);

  const suppressToday = useCallback(() => {
    localStorage.setItem(SUPPRESS_TODAY_KEY, new Date().toISOString().slice(0, 10));
    setReflectionData(null);
  }, []);

  return {
    reflectionMessage: reflectionData?.message ?? null,
    reflectionTriggerType: reflectionData?.triggerType ?? null,
    evaluate,
    reset,
    suppressToday,
  };
}
