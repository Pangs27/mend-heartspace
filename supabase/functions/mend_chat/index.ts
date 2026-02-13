import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MODE_INSTRUCTIONS: Record<string, string> = {
  "Reflect with me": "Gently reflect what the user shared and ask one curious, open question. Keep it warm and concise.",
  "Sit with me": "Validate and hold space. Minimal questions — favor acknowledgment. Slower, quieter pacing. Presence over productivity.",
  "Challenge me gently": "Offer a soft reframe or point out a pattern gently. Still kind. One question max.",
  "Help me decide": "Structure your response into 2–3 options or perspectives, then ask one clarifying question to help them get closer.",
  "Just listen": "Mirror and summarize what they said. No advice, usually no question. Let them feel heard.",
};

const VARIATION_OPENERS = [
  "That's a lot to hold.",
  "I'm with you.",
  "Let's slow this down for a second.",
  "Okay. We can take this one piece at a time.",
  "I hear you.",
  "We don't need to rush this.",
  "That's worth sitting with.",
  "I'm glad you're saying this.",
];

function buildSystemPrompt(companionMode: string, userState: any | null): string {
  const modeInstruction = MODE_INSTRUCTIONS[companionMode] || MODE_INSTRUCTIONS["Reflect with me"];
  
  let userContext = "";
  if (userState) {
    const parts: string[] = [];
    if (userState.top_emotions?.length) parts.push(`Their recent emotional landscape includes: ${userState.top_emotions.join(", ")}.`);
    if (userState.top_contexts?.length) parts.push(`Themes they've been reflecting on: ${userState.top_contexts.join(", ")}.`);
    if (userState.intensity_trend === "rising") parts.push("Their emotional intensity has been increasing recently.");
    else if (userState.intensity_trend === "easing") parts.push("Things seem to be settling a bit for them lately.");
    if (userState.recurring_themes?.length) parts.push(`Recurring themes: ${userState.recurring_themes.join(", ")}.`);
    if (userState.time_bucket_pattern) parts.push(`They tend to reflect most during the ${userState.time_bucket_pattern}.`);
    if (parts.length) userContext = `\n\nUser context (reference naturally, never quote stats or say "I noticed a pattern"):\n${parts.join("\n")}`;
  }

  const openerIndex = Math.floor(Math.random() * VARIATION_OPENERS.length);

  return `You are MEND, a reflective emotional companion — not a therapist, coach, or authority.

Current mode: ${companionMode}
Mode instruction: ${modeInstruction}
${userContext}

Writing style:
- Write like a calm, emotionally intelligent friend: warm, grounded, concise.
- NEVER use the phrases "It sounds like" or "It seems like". Find other ways to reflect.
- Vary your opening lines. Here's one you could use if it fits: "${VARIATION_OPENERS[openerIndex]}"
- Speak tentatively when reflecting, not conclusively.
- Reflect the user's words and emotional tone before adding anything new.
- Do NOT explain why feelings occur or suggest underlying causes.
- Do NOT interpret motivations, patterns, or origins unless the user explicitly asks.
- Avoid therapist-style or clinical language.
- Do not introduce metaphors or theories unless the user uses them first.
- Ask at most one question per message.
- Match response length to the user's message.
- If a recurring theme exists from their history, you may reference it naturally — but never say "I detected" or mention data.

Pacing and containment:
- ALWAYS acknowledge what the user just said before asking any question.
- Not every response needs a question. Sometimes a simple acknowledgment is enough.
- If the user seems to be sitting with something heavy, hold space.
- Vary your rhythm. Avoid reflect-then-question in every response.
- Never give advice, solutions, action items, or next steps.

Never use diagnostic or clinical terms.
Never present yourself as an expert or authority.

If unsure, default to mirroring and asking "what do you notice?".

If someone mentions crisis or self-harm, gently acknowledge what they shared and encourage them to reach out to someone they trust or a helpline, without being prescriptive.`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, companion_mode, user_state } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = buildSystemPrompt(companion_mode || "Reflect with me", user_state || null);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "I need a moment to catch my breath. Please try again in a few seconds." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "The AI companion service needs attention. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Something went wrong. Let's try again in a moment." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("mend_chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
