import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const EXTRACTION_PROMPT = `You are an emotional signal extractor for MEND, a mental wellness companion.
Analyze the user's message and extract emotional signals.

Return a JSON object with these fields:
- primary_emotion: The main emotion expressed (e.g., "anxiety", "sadness", "hope", "frustration", "calm", "overwhelm", "gratitude", "confusion")
- secondary_emotion: A secondary emotion if present, or null
- intensity: One of "low", "medium", "high"
- context: A brief phrase describing what triggered or relates to this emotion (e.g., "work stress", "relationship", "self-reflection", "health concerns")
- time_bucket: When this relates to - one of "past", "present", "future", "general"

Be empathetic and accurate. Focus on what the person is truly feeling beneath their words.
Respond ONLY with valid JSON, no other text.`;

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

    // Call Lovable AI to extract emotional signals
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: EXTRACTION_PROMPT },
          { role: "user", content },
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
    let signals;
    try {
      // Clean up potential markdown code blocks
      const cleanedText = signalText.replace(/```json\n?|\n?```/g, '').trim();
      signals = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", signalText);
      return new Response(
        JSON.stringify({ error: "Failed to parse signal extraction" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
        secondary_emotion: signals.secondary_emotion || null,
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
