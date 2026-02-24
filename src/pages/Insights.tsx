import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Waves, Zap, Repeat, Shield, TrendingUp } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface WeeklyInsight {
  id: string;
  week_start: string;
  week_end: string;
  dominant_emotions: { label: string; count: number }[] | null;
  top_triggers: { label: string; count: number }[] | null;
  time_bucket_peaks: { label: string; count: number }[] | null;
  volatility_score: number | null;
  narrative: string | null;
}

interface MemoryItem {
  id: string;
  memory_type: string;
  content: string;
  evidence_count: number;
  confidence: number;
}

const SOFT_EMOTION_LABELS: Record<string, string> = {
  anxious_like: "uneasy",
  sad_like: "heavy",
  angry_like: "frustrated",
  lonely_like: "disconnected",
  confused_like: "foggy",
  hopeful_like: "hopeful",
  calm_like: "settled",
  grateful_like: "grateful",
  numb_like: "numb",
  guilty_like: "weighed down",
  ashamed_like: "carrying something",
  overwhelmed_like: "stretched thin",
  drained_like: "drained",
  restless_like: "restless",
};

function getSoftLabel(raw: string): string {
  return SOFT_EMOTION_LABELS[raw] || raw.replace(/_/g, " ").replace(/_like$/, "");
}

export default function Insights() {
  const { user } = useAuth();
  const [weeklyInsight, setWeeklyInsight] = useState<WeeklyInsight | null>(null);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      setIsLoading(true);

      // Fetch latest weekly insight and top memories in parallel
      const [insightResult, memoriesResult] = await Promise.all([
        supabase
          .from("mend_weekly_insights")
          .select("*")
          .eq("user_id", user.id)
          .order("week_start", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("mend_user_memory")
          .select("id, memory_type, content, evidence_count, confidence")
          .eq("user_id", user.id)
          .eq("status", "active")
          .order("evidence_count", { ascending: false })
          .order("last_seen_at", { ascending: false })
          .limit(10),
      ]);

      if (insightResult.data) {
        setWeeklyInsight(insightResult.data as unknown as WeeklyInsight);
      }

      if (memoriesResult.data) {
        setMemories(memoriesResult.data as MemoryItem[]);
      }

      // Trigger insight generation if none exists or is stale
      if (!insightResult.data) {
        setIsGenerating(true);
        try {
          const { data } = await supabase.functions.invoke("generate_weekly_insight", {
            body: { user_id: user.id },
          });

          if (data?.status === "generated") {
            // Refetch the insight
            const { data: freshInsight } = await supabase
              .from("mend_weekly_insights")
              .select("*")
              .eq("user_id", user.id)
              .order("week_start", { ascending: false })
              .limit(1)
              .maybeSingle();

            if (freshInsight) setWeeklyInsight(freshInsight as unknown as WeeklyInsight);
          }
        } catch (e) {
          console.error("Failed to generate weekly insight:", e);
        } finally {
          setIsGenerating(false);
        }
      }

      setIsLoading(false);
    };

    loadData();
  }, [user?.id]);

  const recurringThemes = useMemo(() =>
    memories.filter(m => m.memory_type === "recurring_theme").slice(0, 3),
    [memories]
  );
  const triggers = useMemo(() =>
    memories.filter(m => m.memory_type === "trigger").slice(0, 2),
    [memories]
  );
  const copingPatterns = useMemo(() =>
    memories.filter(m => m.memory_type === "coping_pattern").slice(0, 1),
    [memories]
  );

  const hasMemoryData = recurringThemes.length > 0 || triggers.length > 0 || copingPatterns.length > 0;
  const hasAnyData = weeklyInsight || hasMemoryData;

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-[720px] mx-auto px-4 py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-serif font-semibold text-foreground mb-2">
              Insights
            </h1>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Patterns and reflections from your recent conversations.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: "300ms" }} />
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                {isGenerating ? "Generating your weekly reflection..." : "Loading your insights..."}
              </p>
            </div>
          ) : !hasAnyData ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Waves className="w-8 h-8 text-primary/50" />
              </div>
              <h2 className="text-xl font-serif font-medium text-foreground mb-3">
                Still gathering
              </h2>
              <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                We need a few more reflections to detect patterns. Keep going.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-10">
              {/* Weekly Reflection Card */}
              {weeklyInsight && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="rounded-2xl bg-card p-6 lg:p-8 shadow-card"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Waves className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <h2 className="text-lg font-serif font-semibold text-foreground">
                      Weekly reflection
                    </h2>
                  </div>

                  {weeklyInsight.narrative && (
                    <p className="text-foreground/80 leading-relaxed mb-6">
                      {weeklyInsight.narrative}
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Volatility */}
                    {weeklyInsight.volatility_score !== null && (
                      <div className="rounded-xl bg-muted/50 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Emotional range</span>
                        </div>
                        <p className="text-2xl font-serif font-semibold text-foreground">
                          {weeklyInsight.volatility_score}
                          <span className="text-sm font-normal text-muted-foreground">/100</span>
                        </p>
                      </div>
                    )}

                    {/* Dominant emotions */}
                    {weeklyInsight.dominant_emotions && weeklyInsight.dominant_emotions.length > 0 && (
                      <div className="rounded-xl bg-muted/50 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Waves className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Dominant feelings</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(weeklyInsight.dominant_emotions as { label: string; count: number }[]).map((e, i) => (
                            <span key={i} className="text-sm text-foreground/70 bg-background rounded-lg px-2.5 py-1">
                              {getSoftLabel(e.label)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Time peaks */}
                    {weeklyInsight.time_bucket_peaks && weeklyInsight.time_bucket_peaks.length > 0 && (
                      <div className="rounded-xl bg-muted/50 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Most active</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(weeklyInsight.time_bucket_peaks as { label: string; count: number }[]).map((t, i) => (
                            <span key={i} className="text-sm text-foreground/70 bg-background rounded-lg px-2.5 py-1 capitalize">
                              {t.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Memory Highlights */}
              {hasMemoryData && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <h2 className="text-lg font-serif font-semibold text-foreground mb-4">
                    Memory highlights
                  </h2>

                  <div className="space-y-4">
                    {/* Recurring themes */}
                    {recurringThemes.length > 0 && (
                      <div className="rounded-2xl bg-card p-5 shadow-card">
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Repeat className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <h3 className="text-[15px] font-serif font-semibold text-foreground">
                            Recurring themes
                          </h3>
                        </div>
                        <ul className="space-y-2">
                          {recurringThemes.map((m) => (
                            <li key={m.id} className="text-sm text-foreground/70 leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/30">
                              {m.content}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Triggers */}
                    {triggers.length > 0 && (
                      <div className="rounded-2xl bg-card p-5 shadow-card">
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
                            <Zap className="w-3.5 h-3.5 text-accent-foreground" />
                          </div>
                          <h3 className="text-[15px] font-serif font-semibold text-foreground">
                            Common triggers
                          </h3>
                        </div>
                        <ul className="space-y-2">
                          {triggers.map((m) => (
                            <li key={m.id} className="text-sm text-foreground/70 leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent/50">
                              {m.content}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Coping patterns */}
                    {copingPatterns.length > 0 && (
                      <div className="rounded-2xl bg-card p-5 shadow-card">
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center">
                            <Shield className="w-3.5 h-3.5 text-secondary-foreground" />
                          </div>
                          <h3 className="text-[15px] font-serif font-semibold text-foreground">
                            What helps
                          </h3>
                        </div>
                        <ul className="space-y-2">
                          {copingPatterns.map((m) => (
                            <li key={m.id} className="text-sm text-foreground/70 leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-secondary/50">
                              {m.content}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
