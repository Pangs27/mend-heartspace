import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

// Crisis keywords — never trigger reflection on these
const CRISIS_KEYWORDS = [
  "suicide", "kill myself", "end it all", "don't want to live",
  "self-harm", "hurt myself", "cutting", "overdose",
  "want to die", "no reason to live", "can't go on",
];

// Gentle curiosity-based prompts keyed by trigger type
const RECURRENCE_PROMPTS = [
  "Does this feel similar to earlier this week?",
  "I'm wondering if this connects to what you shared a few days ago.",
  "Has this been building over the past few days?",
  "This sounds close to something you mentioned recently.",
];

const ESCALATION_PROMPTS = [
  "It sounds like things have been feeling heavier lately.",
  "I notice this has been coming up more — how does that feel?",
];

const CONTEXT_PROMPTS = [
  "This area seems to come up for you often. What feels different today?",
  "You've been reflecting on this a lot recently.",
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

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function containsCrisisContent(messages: { content: string }[]): boolean {
  const recent = messages.slice(-3);
  return recent.some((m) =>
    CRISIS_KEYWORDS.some((kw) => m.content.toLowerCase().includes(kw))
  );
}

export function useReflectionBubble(userId: string | undefined) {
  const [reflectionMessage, setReflectionMessage] = useState<string | null>(null);
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

      // Never on consecutive assistant replies
      if (currentAssistantIndex - lastTriggerIndexRef.current <= 2) {
        lastTriggerIndexRef.current = currentAssistantIndex;
        return;
      }

      // Crisis safety check
      if (containsCrisisContent(messages)) return;

      // Need at least 3 exchanges before considering
      const userMsgCount = messages.filter((m) => m.role === "user").length;
      if (userMsgCount < 2) return;

      try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 14);

        const { data, error } = await supabase
          .from("mend_signals")
          .select("primary_emotion, context, intensity, time_bucket, created_at")
          .eq("user_id", userId)
          .gte("created_at", sevenDaysAgo.toISOString())
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

        let prompt: string | null = null;

        // Check 1: Same primary_emotion ≥ 3 times in last 7 days
        const emotionFreq = new Map<string, number>();
        for (const s of recentSignals) {
          const e = s.primary_emotion.toLowerCase();
          emotionFreq.set(e, (emotionFreq.get(e) || 0) + 1);
        }
        for (const [, count] of emotionFreq) {
          if (count >= 3) {
            prompt = pickRandom(RECURRENCE_PROMPTS);
            break;
          }
        }

        // Check 2: Same context ≥ 3 times in last 7 days
        if (!prompt) {
          const ctxFreq = new Map<string, number>();
          for (const s of recentSignals) {
            const c = s.context.toLowerCase();
            ctxFreq.set(c, (ctxFreq.get(c) || 0) + 1);
          }
          for (const [, count] of ctxFreq) {
            if (count >= 3) {
              prompt = pickRandom(CONTEXT_PROMPTS);
              break;
            }
          }
        }

        // Check 3: Average intensity rising
        if (!prompt && priorSignals.length >= 2) {
          const recentAvg = mean(recentSignals.map((s) => toNum(s.intensity)));
          const priorAvg = mean(priorSignals.map((s) => toNum(s.intensity)));
          if (recentAvg > priorAvg + 0.5) {
            prompt = pickRandom(ESCALATION_PROMPTS);
          }
        }

        // Check 4: Same emotion across multiple time buckets
        if (!prompt) {
          const emotionBuckets = new Map<string, Set<string>>();
          for (const s of recentSignals) {
            const e = s.primary_emotion.toLowerCase();
            if (!emotionBuckets.has(e)) emotionBuckets.set(e, new Set());
            emotionBuckets.get(e)!.add(s.time_bucket.toLowerCase());
          }
          for (const [, buckets] of emotionBuckets) {
            if (buckets.size >= 2) {
              prompt = pickRandom(RECURRENCE_PROMPTS);
              break;
            }
          }
        }

        if (prompt) {
          hasTriggeredRef.current = true;
          lastTriggerIndexRef.current = currentAssistantIndex;
          setReflectionMessage(prompt);
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
    setReflectionMessage(null);
  }, []);

  return { reflectionMessage, evaluate, reset };
}
