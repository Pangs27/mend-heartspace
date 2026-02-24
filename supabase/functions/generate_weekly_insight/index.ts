import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function getSupabaseAdmin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();
    if (!user_id) throw new Error("user_id required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = getSupabaseAdmin();

    // Calculate week boundaries
    const now = new Date();
    const weekEnd = new Date(now);
    weekEnd.setHours(23, 59, 59, 999);
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekStartStr = weekStart.toISOString().split("T")[0];
    const weekEndStr = weekEnd.toISOString().split("T")[0];

    // Check if we already have a recent insight
    const { data: existingInsight } = await supabase
      .from("mend_weekly_insights")
      .select("id, created_at")
      .eq("user_id", user_id)
      .eq("week_start", weekStartStr)
      .maybeSingle();

    // If insight exists and is less than 1 day old, return it
    if (existingInsight) {
      const age = Date.now() - new Date(existingInsight.created_at).getTime();
      if (age < 24 * 60 * 60 * 1000) {
        return new Response(
          JSON.stringify({ status: "exists", message: "Recent insight already generated" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Fetch last 7 days of signals
    const { data: signals } = await supabase
      .from("mend_signals")
      .select("primary_emotion, secondary_emotion, intensity, context, time_bucket, created_at")
      .eq("user_id", user_id)
      .gte("created_at", weekStart.toISOString())
      .order("created_at", { ascending: true });

    if (!signals || signals.length < 3) {
      return new Response(
        JSON.stringify({ status: "insufficient_data", message: "Need more reflections to generate insights" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Compute distributions
    const emotionFreq: Record<string, number> = {};
    const contextFreq: Record<string, number> = {};
    const timeBucketFreq: Record<string, number> = {};
    const intensityMap: Record<string, number> = { low: 1, moderate: 2, high: 3 };
    const intensityValues: number[] = [];

    for (const s of signals) {
      emotionFreq[s.primary_emotion] = (emotionFreq[s.primary_emotion] || 0) + 1;
      contextFreq[s.context] = (contextFreq[s.context] || 0) + 1;
      timeBucketFreq[s.time_bucket] = (timeBucketFreq[s.time_bucket] || 0) + 1;
      intensityValues.push(intensityMap[s.intensity] || 2);
    }

    const sortByFreq = (obj: Record<string, number>) =>
      Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => ({ label: k, count: v }));

    const dominantEmotions = sortByFreq(emotionFreq);
    const topTriggers = sortByFreq(contextFreq);
    const timeBucketPeaks = sortByFreq(timeBucketFreq);

    // Volatility: standard deviation of intensity scaled 0-100
    const mean = intensityValues.reduce((a, b) => a + b, 0) / intensityValues.length;
    const variance = intensityValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / intensityValues.length;
    const stdDev = Math.sqrt(variance);
    const volatilityScore = Math.round(Math.min(100, (stdDev / 1.0) * 50));

    // Fetch recent messages for narrative context
    const { data: recentMessages } = await supabase
      .from("mend_messages")
      .select("role, content")
      .eq("user_id", user_id)
      .gte("created_at", weekStart.toISOString())
      .order("created_at", { ascending: false })
      .limit(10);

    const messageContext = recentMessages
      ? recentMessages.map(m => `${m.role}: ${m.content.slice(0, 100)}`).join("\n")
      : "";

    // Generate narrative via AI
    const narrativePrompt = `You are writing a weekly emotional insight for a user of MEND, a reflective companion app.

Data from this week:
- Dominant emotions: ${dominantEmotions.map(e => e.label).join(", ")}
- Top contexts: ${topTriggers.map(t => t.label).join(", ")}
- Most active times: ${timeBucketPeaks.map(t => t.label).join(", ")}
- Emotional volatility: ${volatilityScore}/100
- Number of reflections: ${signals.length}

Recent conversation excerpts:
${messageContext}

Write a 100-150 word weekly reflection. Rules:
- Observational, not prescriptive
- Calm, warm tone
- Non-clinical language
- No dashes of any kind
- No robotic phrasing
- No exclamation marks
- Do not address the user as "you" repeatedly
- Write as gentle narrative observation
- End with a grounding, forward-looking sentence

Output only the narrative text, nothing else.`;

    const narrativeResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: narrativePrompt }],
      }),
    });

    if (!narrativeResp.ok) {
      const t = await narrativeResp.text();
      throw new Error(`AI call failed: ${narrativeResp.status} ${t}`);
    }

    const narrativeData = await narrativeResp.json();
    const narrative = narrativeData.choices?.[0]?.message?.content || "";

    // Upsert weekly insight
    const { error: upsertError } = await supabase
      .from("mend_weekly_insights")
      .upsert({
        user_id,
        week_start: weekStartStr,
        week_end: weekEndStr,
        dominant_emotions: dominantEmotions,
        top_triggers: topTriggers,
        time_bucket_peaks: timeBucketPeaks,
        volatility_score: volatilityScore,
        narrative,
      }, { onConflict: "user_id,week_start" });

    if (upsertError) throw upsertError;

    console.log("[generate_weekly_insight] Insight generated for user:", user_id);

    return new Response(
      JSON.stringify({ status: "generated", volatility_score: volatilityScore }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate_weekly_insight error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
