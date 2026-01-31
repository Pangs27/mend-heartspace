import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ALLOWED_EMOTIONS = [
  "calm", "content", "hopeful", "grateful", "joyful", "excited",
  "tired", "overwhelmed", "stressed", "uneasy", "anxious_like", "sad", "heavy", "lonely",
  "frustrated", "angry", "guilty", "ashamed", "numb", "confused", "insecure", "hurt",
  "motivated", "relieved", "distressed"
] as const;

const ALLOWED_CONTEXTS = [
  "work", "relationships", "family", "friends", "self", "health", "money", "future",
  "identity", "study", "social", "routine", "sleep", "body", "safety", "other"
] as const;

const ALLOWED_INTENSITIES = ["low", "medium", "high"] as const;
const ALLOWED_TIME_BUCKETS = ["morning", "afternoon", "evening", "night"] as const;

const SYSTEM_PROMPT = `You are an emotion-signal extraction component for MEND, a wellness companion app.

Your role is to analyze user messages and extract emotional signals using everyday language.

STRICT RULES:
1. NEVER use clinical or diagnostic language. Forbidden terms include: depression, anxiety disorder, trauma, PTSD, bipolar, ADHD, OCD, panic disorder, clinical, diagnosis, disorder, syndrome, condition.
2. Use only everyday emotion words from the allowed list provided.
3. If the message contains safety concerns (self-harm, suicidal ideation, crisis), set primary_emotion to "distressed" and context to "safety".
4. Output ONLY valid JSON. No markdown, no code blocks, no explanatory text.
5. Be empathetic but objective in extraction.
6. The safe_summary must be a brief, non-identifying phrase (max 8 words) that captures the emotional essence without personal details.
7. Confidence should reflect how clearly the emotion was expressed (0.0 to 1.0).

Respond with exactly the JSON structure requested, nothing else.`;

function getISTTimeInfo(): { localTime: string; suggestedBucket: string } {
  const now = new Date();
  // IST is UTC+5:30
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  const hours = istDate.getUTCHours();
  
  let suggestedBucket: string;
  if (hours >= 5 && hours < 12) {
    suggestedBucket = "morning";
  } else if (hours >= 12 && hours < 17) {
    suggestedBucket = "afternoon";
  } else if (hours >= 17 && hours < 21) {
    suggestedBucket = "evening";
  } else {
    suggestedBucket = "night";
  }
  
  const localTime = istDate.toISOString().slice(11, 16); // HH:MM format
  return { localTime, suggestedBucket };
}

function buildUserPrompt(content: string, localTime: string, suggestedBucket: string): string {
  return `Analyze the following message and extract emotional signals.

MESSAGE:
"${content}"

CURRENT TIME (IST): ${localTime}
SUGGESTED TIME BUCKET: ${suggestedBucket}

ALLOWED VALUES:
- primary_emotion (required): One of ${JSON.stringify(ALLOWED_EMOTIONS)}
- secondary_emotion (optional): One of the above or null
- intensity (required): One of ${JSON.stringify(ALLOWED_INTENSITIES)}
- context (required): One of ${JSON.stringify(ALLOWED_CONTEXTS)}
- time_bucket (required): One of ${JSON.stringify(ALLOWED_TIME_BUCKETS)} (use suggested bucket if unclear)
- confidence (required): Number between 0.0 and 1.0
- safe_summary (required): Brief non-identifying phrase (max 8 words)

OUTPUT FORMAT (JSON only, no markdown):
{
  "primary_emotion": "...",
  "secondary_emotion": "..." or null,
  "intensity": "...",
  "context": "...",
  "time_bucket": "...",
  "confidence": 0.0-1.0,
  "safe_summary": "..."
}`;
}

function validateAndNormalize(
  signals: Record<string, unknown>,
  fallbackBucket: string
): {
  primary_emotion: string;
  secondary_emotion: string | null;
  intensity: string;
  context: string;
  time_bucket: string;
  confidence: number;
  safe_summary: string;
} {
  const primary = ALLOWED_EMOTIONS.includes(signals.primary_emotion as typeof ALLOWED_EMOTIONS[number])
    ? signals.primary_emotion as string
    : "confused";
    
  const secondary = signals.secondary_emotion && 
    ALLOWED_EMOTIONS.includes(signals.secondary_emotion as typeof ALLOWED_EMOTIONS[number])
    ? signals.secondary_emotion as string
    : null;
    
  const intensity = ALLOWED_INTENSITIES.includes(signals.intensity as typeof ALLOWED_INTENSITIES[number])
    ? signals.intensity as string
    : "medium";
    
  const context = ALLOWED_CONTEXTS.includes(signals.context as typeof ALLOWED_CONTEXTS[number])
    ? signals.context as string
    : "other";
    
  // Use fallback if time_bucket is invalid
  const time_bucket = ALLOWED_TIME_BUCKETS.includes(signals.time_bucket as typeof ALLOWED_TIME_BUCKETS[number])
    ? signals.time_bucket as string
    : fallbackBucket;
    
  const confidence = typeof signals.confidence === "number" && signals.confidence >= 0 && signals.confidence <= 1
    ? signals.confidence
    : 0.5;
    
  const safe_summary = typeof signals.safe_summary === "string" && signals.safe_summary.length <= 60
    ? signals.safe_summary
    : "Emotional reflection shared";

  return {
    primary_emotion: primary,
    secondary_emotion: secondary,
    intensity,
    context,
    time_bucket,
    confidence,
    safe_summary,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, message_id, content } = await req.json();

    if (!user_id || !message_id || !content) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: user_id, message_id, content" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Compute IST time info
    const { localTime, suggestedBucket } = getISTTimeInfo();
    const userPrompt = buildUserPrompt(content, localTime, suggestedBucket);

    // Call Lovable AI with structured prompts
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI extraction error:", aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to extract signals" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const signalText = aiData.choices?.[0]?.message?.content || "";
    
    // Parse the JSON response
    let rawSignals: Record<string, unknown>;
    try {
      // Clean up potential markdown code blocks
      const cleanedText = signalText.replace(/```json\n?|\n?```/g, '').trim();
      rawSignals = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", signalText);
      return new Response(
        JSON.stringify({ error: "Failed to parse signal extraction" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate and normalize with IST fallback
    const signals = validateAndNormalize(rawSignals, suggestedBucket);

    // Insert the signal into the database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from("mend_signals")
      .insert({
        user_id,
        message_id,
        primary_emotion: signals.primary_emotion,
        secondary_emotion: signals.secondary_emotion,
        intensity: signals.intensity,
        context: signals.context,
        time_bucket: signals.time_bucket,
      })
      .select()
      .single();

    if (error) {
      console.error("Database insert error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to save signal" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, signal: data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("extract_signals error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
