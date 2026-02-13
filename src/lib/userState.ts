import type { Signal } from "@/hooks/usePatternSignals";
import { getSoftEmotionLabel } from "@/lib/emotionalWeight";

export interface UserState {
  top_emotions: string[];
  top_contexts: string[];
  intensity_trend: "rising" | "steady" | "easing";
  time_bucket_pattern: string;
  recurring_themes: string[];
}

function topN(items: string[], n: number): string[] {
  const freq = new Map<string, number>();
  for (const item of items) freq.set(item, (freq.get(item) || 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k);
}

export function computeUserState(signals: Signal[]): UserState | null {
  if (signals.length < 3) return null;

  const now = new Date();
  const d7 = new Date(now); d7.setDate(d7.getDate() - 7);
  const d14 = new Date(now); d14.setDate(d14.getDate() - 14);

  const last14 = signals.filter(s => s.created_at && new Date(s.created_at) >= d14);
  const last7 = last14.filter(s => s.created_at && new Date(s.created_at) >= d7);
  const prev7 = last14.filter(s => {
    if (!s.created_at) return false;
    const d = new Date(s.created_at);
    return d >= d14 && d < d7;
  });

  const intensityMap: Record<string, number> = { low: 1, moderate: 2, high: 3 };
  const avg = (arr: Signal[]) => {
    if (arr.length === 0) return 0;
    return arr.reduce((sum, s) => sum + (intensityMap[s.intensity] || 2), 0) / arr.length;
  };

  const avgLast7 = avg(last7);
  const avgPrev7 = avg(prev7);
  const diff = avgLast7 - avgPrev7;
  const intensity_trend = diff > 0.5 ? "rising" : diff < -0.5 ? "easing" : "steady";

  const emotions = last14.map(s => getSoftEmotionLabel(s.primary_emotion));
  const contexts = last14.map(s => s.context);
  const timeBuckets = last14.map(s => s.time_bucket);

  // Recurring themes: contexts appearing 3+ times
  const ctxFreq = new Map<string, number>();
  for (const c of contexts) ctxFreq.set(c, (ctxFreq.get(c) || 0) + 1);
  const recurring_themes = [...ctxFreq.entries()].filter(([, c]) => c >= 3).map(([k]) => k);

  return {
    top_emotions: topN(emotions, 3),
    top_contexts: topN(contexts, 3),
    intensity_trend,
    time_bucket_pattern: topN(timeBuckets, 1)[0] || "evening",
    recurring_themes,
  };
}

/** Build dynamic gentle prompt chips from user state */
export function buildDynamicPrompts(state: UserState | null): { label: string; icon: "sparkles" | "cloud" | "moon" | "heart" }[] {
  const prompts: { label: string; icon: "sparkles" | "cloud" | "moon" | "heart" }[] = [];

  if (state) {
    if (state.top_contexts.includes("work")) {
      prompts.push({ label: "Work has been heavy lately", icon: "cloud" });
    }
    if (state.recurring_themes.some(t => ["relationships", "relationship"].includes(t))) {
      prompts.push({ label: "Something in my relationships feels off", icon: "heart" });
    }
    if (state.recurring_themes.some(t => ["self", "self_worth"].includes(t))) {
      prompts.push({ label: "I keep saying yes when I don't want to", icon: "moon" });
    }
    if (state.intensity_trend === "rising") {
      prompts.push({ label: "Things feel like they're building up", icon: "sparkles" });
    }
    if (state.top_emotions.includes("drained") || state.top_emotions.includes("heavy")) {
      prompts.push({ label: "I'm carrying more than I'm letting on", icon: "cloud" });
    }
  }

  // Always include one open prompt
  prompts.push({ label: "Something I haven't said out loud", icon: "heart" });

  // Cap at 4
  return prompts.slice(0, 4);
}
