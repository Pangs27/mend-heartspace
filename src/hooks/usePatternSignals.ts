import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Signal {
  id: string;
  user_id: string;
  primary_emotion: string;
  secondary_emotion: string | null;
  intensity: string;
  context: string;
  time_bucket: string;
  created_at: string | null;
  message_id: string | null;
}

export interface PatternCard {
  type: "emotion" | "time" | "context" | "weekly";
  title: string;
  body: string;
}

// Gentle, non-clinical emotion labels
const emotionLabels: Record<string, string> = {
  anxious: "uneasy",
  anxious_like: "uneasy",
  anxiety: "uneasy",
  overwhelmed: "overwhelmed",
  heavy: "heavy",
  sad: "heavy",
  sadness: "heavy",
  angry: "frustrated",
  anger: "frustrated",
  frustrated: "frustrated",
  lonely: "lonely",
  lost: "lost",
  confused: "uncertain",
  hopeful: "hopeful",
  calm: "calm",
  relieved: "relieved",
  grateful: "grateful",
  happy: "lighter",
  joy: "lighter",
  content: "at ease",
  tired: "drained",
  exhausted: "drained",
  numb: "distant",
  disconnected: "distant",
  stressed: "tense",
  worried: "unsettled",
  fearful: "uneasy",
  guilt: "weighed down",
  shame: "weighed down",
  resentful: "holding onto something",
};

// Friendly context labels
const contextLabels: Record<string, string> = {
  relationships: "relationships",
  relationship: "relationships",
  self: "yourself",
  self_worth: "yourself",
  routine: "daily routine",
  daily: "daily routine",
  sleep: "sleep",
  work: "work",
  family: "family",
  health: "health",
  future: "the future",
  past: "the past",
  loss: "loss",
  change: "change",
  uncertainty: "uncertainty",
  safety: "feeling safe",
};

// Time bucket labels
const timeBucketLabels: Record<string, string> = {
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night",
  late_night: "late night",
  present: "now",
};

function getEmotionLabel(emotion: string): string {
  const normalized = emotion.toLowerCase().trim();
  return emotionLabels[normalized] || normalized;
}

function getContextLabel(context: string): string {
  const normalized = context.toLowerCase().trim();
  return contextLabels[normalized] || normalized;
}

function getTimeBucketLabel(bucket: string): string {
  const normalized = bucket.toLowerCase().trim();
  return timeBucketLabels[normalized] || normalized;
}

function countFrequency<T>(items: T[]): Map<T, number> {
  const freq = new Map<T, number>();
  for (const item of items) {
    freq.set(item, (freq.get(item) || 0) + 1);
  }
  return freq;
}

function getTopItem<T>(freq: Map<T, number>): { item: T; count: number } | null {
  let topItem: T | null = null;
  let topCount = 0;
  for (const [item, count] of freq) {
    if (count > topCount) {
      topItem = item;
      topCount = count;
    }
  }
  return topItem !== null ? { item: topItem, count: topCount } : null;
}

function computePatterns(signals: Signal[]): PatternCard[] {
  const patterns: PatternCard[] = [];

  if (signals.length < 3) return patterns;

  // A) Repeating emotion pattern
  const emotionFreq = countFrequency(signals.map((s) => s.primary_emotion));
  const topEmotion = getTopItem(emotionFreq);
  if (topEmotion && topEmotion.count >= 3) {
    patterns.push({
      type: "emotion",
      title: "Emotional patterns",
      body: `You've often been describing ${getEmotionLabel(topEmotion.item)} feelings.`,
    });
  }

  // B) Time-of-day pattern
  const timePairs = signals.map((s) => `${s.time_bucket}|${s.primary_emotion}`);
  const timePairFreq = countFrequency(timePairs);
  const topTimePair = getTopItem(timePairFreq);
  if (topTimePair && topTimePair.count >= 3) {
    const [bucket] = topTimePair.item.split("|");
    patterns.push({
      type: "time",
      title: "When feelings show up",
      body: `That feeling tends to show up more during the ${getTimeBucketLabel(bucket)}.`,
    });
  }

  // C) Context pattern
  const contextFreq = countFrequency(signals.map((s) => s.context));
  const topContext = getTopItem(contextFreq);
  if (topContext && topContext.count >= 3) {
    patterns.push({
      type: "context",
      title: "Themes that repeat",
      body: `A lot of your reflections seem connected to ${getContextLabel(topContext.item)}.`,
    });
  }

  // D) Weekly summary (>= 5 signals in last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const last7 = signals.filter(
    (s) => s.created_at && new Date(s.created_at) >= sevenDaysAgo
  );
  if (last7.length >= 5) {
    patterns.push({
      type: "weekly",
      title: "This week",
      body: "This week has had more emotional check-ins than usual.",
    });
  }

  // Return max 3 patterns
  return patterns.slice(0, 3);
}

export interface TimelineEntry {
  date: string;
  emotion: string;
  timeBucket: string;
}

function computeTimeline(signals: Signal[]): TimelineEntry[] {
  return signals
    .filter((s) => s.created_at)
    .slice(0, 5)
    .map((s) => ({
      date: s.created_at!,
      emotion: getEmotionLabel(s.primary_emotion),
      timeBucket: getTimeBucketLabel(s.time_bucket),
    }));
}

export function usePatternSignals() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["pattern-signals", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("mend_signals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      const signals = (data || []) as Signal[];
      const patterns = computePatterns(signals);
      const timeline = signals.length >= 5 ? computeTimeline(signals) : [];

      return {
        signals,
        patterns,
        timeline,
        hasEnoughData: signals.length >= 3,
      };
    },
    enabled: !!user,
  });
}
