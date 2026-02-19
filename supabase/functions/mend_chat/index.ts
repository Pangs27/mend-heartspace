import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Expose-Headers": "X-Communication-Bucket",
};

/* ── Bucket definitions per mode ── */
const MODE_BUCKETS: Record<string, string[]> = {
  "Reflect with me": ["Emotional Processing", "Pattern Reflection", "Seeking Perspective"],
  "Sit with me": ["Venting", "Reassurance", "Emotional Processing"],
  "Challenge me gently": ["Seeking Perspective", "Pattern Reflection", "Decision Making"],
  "Help me decide": ["Decision Making", "Practical Action", "Seeking Perspective"],
  "Just listen": ["Venting", "Reassurance"],
};

const CRISIS_KEYWORDS = [
  "kill myself", "suicide", "end it all", "want to die", "self harm",
  "self-harm", "hurt myself", "not worth living", "better off dead",
];

function detectCrisis(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
}

function classifyBucket(userText: string, mode: string): string {
  if (detectCrisis(userText)) return "Crisis";

  const lower = userText.toLowerCase();
  const allowed = MODE_BUCKETS[mode] || MODE_BUCKETS["Reflect with me"];

  const signals: Record<string, number> = {};
  for (const b of allowed) signals[b] = 0;

  if (allowed.includes("Venting")) {
    if (/i (just )?need to (let|get) (this|it) out|vent|scream|ugh|frustrated|angry|furious|sick of/i.test(lower)) signals["Venting"] += 3;
    if (/can't take|had enough|exhausted|done with/i.test(lower)) signals["Venting"] += 2;
  }
  if (allowed.includes("Reassurance")) {
    if (/am i (wrong|okay|normal|overreacting)|is (this|it) (okay|normal)|tell me|reassure|worried/i.test(lower)) signals["Reassurance"] += 3;
    if (/scared|afraid|anxious|nervous/i.test(lower)) signals["Reassurance"] += 2;
  }
  if (allowed.includes("Emotional Processing")) {
    if (/feel(ing)?|emotion|sad|grief|loss|miss|heart|heavy|numb|confused about (my|how i) feel/i.test(lower)) signals["Emotional Processing"] += 3;
    if (/overwhelm|cry|tears|hurt/i.test(lower)) signals["Emotional Processing"] += 2;
  }
  if (allowed.includes("Pattern Reflection")) {
    if (/always|again|keep doing|pattern|cycle|repeat|every time|same thing/i.test(lower)) signals["Pattern Reflection"] += 3;
    if (/notice|realize|wonder why i/i.test(lower)) signals["Pattern Reflection"] += 2;
  }
  if (allowed.includes("Seeking Perspective")) {
    if (/perspective|different way|another angle|think about this|make sense|understand/i.test(lower)) signals["Seeking Perspective"] += 3;
    if (/what do you think|how (should|would|do)/i.test(lower)) signals["Seeking Perspective"] += 2;
  }
  if (allowed.includes("Decision Making")) {
    if (/decide|decision|choose|option|should i|torn between|dilemma/i.test(lower)) signals["Decision Making"] += 3;
    if (/pros and cons|trade.?off|either.*or/i.test(lower)) signals["Decision Making"] += 2;
  }
  if (allowed.includes("Practical Action")) {
    if (/what (can|should) i do|next step|plan|action|strategy|how to (handle|deal|manage|fix|solve)/i.test(lower)) signals["Practical Action"] += 3;
    if (/advice|suggestion|recommend|tip/i.test(lower)) signals["Practical Action"] += 2;
  }

  let best = allowed[0];
  let bestScore = 0;
  for (const [bucket, score] of Object.entries(signals)) {
    if (score > bestScore) { best = bucket; bestScore = score; }
  }
  return best;
}

/* ── Mode-specific system templates ── */
const MODE_TEMPLATES: Record<string, string> = {
  "Reflect with me": `MODE: Reflect with me
Goal: Insight + emotional layering.
Structure (follow exactly):
1. Formulation: "Because [specific event], you're feeling [surface emotion] on top of [protective emotion], and you need [inferred need]."
2. Emotional deepening: Layer surface emotion with a possible protective emotion underneath. Provide emotional deepening, not advice. Reference light past context if relevant.
3. One precise curiosity question that invites self-exploration.

Rules:
- Start with formulation.
- Layer surface + protective emotion.
- No advice. Emotional deepening only.
- One precise curiosity question.
- May reference light past context if relevant.
Tone: Slow, grounded, insightful.`,

  "Sit with me": `MODE: Sit with me
Goal: Containment + presence.
Structure (follow exactly):
1. Reflection: Mirror their situation plainly using their own words.
2. Validation: Name the dominant emotion clearly and validate it without explaining it.
3. Gentle anchor: At most one gentle grounding question or a brief anchoring statement.

Rules:
- Mirror situation plainly.
- Name dominant emotion clearly.
- No reframes. No pattern linking. No interpretation.
- At most one gentle grounding question.
Tone: Calm, steady, warm. Minimal words. Maximum presence.`,

  "Challenge me gently": `MODE: Challenge me gently
Goal: Expand perspective safely.
Structure (follow exactly):
1. Assumption spotted: Identify one possible assumption in what they shared.
2. Alternate frame: Offer one alternative interpretation that respects their autonomy.
3. Direct question: Ask one direct but respectful question that invites reconsideration.

Rules:
- Identify one possible assumption.
- Offer one alternative interpretation.
- Maintain autonomy support. No shaming language.
- Ask one direct but respectful question.
Tone: Calm, firm, respectful.`,

  "Help me decide": `MODE: Help me decide
Goal: Reduce overwhelm, clarify tradeoffs.
Structure (follow exactly):
1. Define choice: State the real decision in one sentence.
2. Tradeoff contrast: Present 2 options with a clear tradeoff and surface the likely value conflict.
3. Clarifying question: Ask one constraint question that narrows their choice.

Rules:
- Define the real decision in one sentence.
- Present 2 options with a tradeoff.
- Surface likely value conflict.
- Ask one constraint question.
Tone: Structured, clear, empowering.`,

  "Just listen": `MODE: Just listen
Goal: Reflect only. Zero interpretation.
Structure (follow exactly):
1. Mirror: Repeat the core situation using the user's own language.
2. Emotion naming: Name the main emotion you hear, nothing more.
3. Invitation: Ask at most one soft invitation (e.g., "Is there more?" or "What else is there?").

Rules:
- Repeat core situation using user's own language.
- Name main emotion. Nothing more.
- ABSOLUTELY NO advice. NO reframing. NO interpretation. NO pattern references.
- Ask at most one soft invitation.
Tone: Present, simple, non-analytical.`,
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

/* ── Pass A: Draft system prompt ── */
function buildDraftPrompt(mode: string, bucket: string, userState: any | null, conversationSummary: string | null): string {
  const modeTemplate = MODE_TEMPLATES[mode] || MODE_TEMPLATES["Reflect with me"];
  const bucketContext = bucket === "Crisis"
    ? "CRISIS OVERRIDE: Gently acknowledge what they shared. Encourage reaching out to someone they trust or a helpline. Be present, not prescriptive. Keep your response brief and warm."
    : `Communication bucket: ${bucket}`;

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

  let convContext = "";
  if (conversationSummary) {
    convContext = `\n\nConversation so far (use for continuity, do not repeat back): ${conversationSummary}`;
  }

  const openerIndex = Math.floor(Math.random() * VARIATION_OPENERS.length);

  return `You are MEND, a reflective emotional companion. Not a therapist, coach, or authority.

${modeTemplate}

${bucketContext}
${userContext}${convContext}

GLOBAL CRAFT REQUIREMENTS (apply to every response):
- Maximum 120 words. Exactly 3 short parts.
- Include: 1 surface emotion, 1 protective emotion (if applicable), 1 inferred emotional need (safety, clarity, reassurance, autonomy, connection, or rest).
- Reference at least 1 concrete phrase from the user's message.
- Ask exactly 1 targeted question.
- FORBIDDEN phrases: "it sounds like", "it seems like", "maybe", "perhaps", "I wonder if", "It is understandable".
- Vary your opening lines. Here is one you could use if it fits: "${VARIATION_OPENERS[openerIndex]}"
- Speak tentatively when reflecting, not conclusively.
- Reflect the user's words and emotional tone before adding anything new.
- Do NOT explain why feelings occur or suggest underlying causes.
- Avoid therapist-style or clinical language.
- Do not introduce metaphors or theories unless the user uses them first.
- Never give advice, solutions, action items, or next steps.
- Never use diagnostic or clinical terms.
- Never present yourself as an expert or authority.

If unsure, default to mirroring and asking "what do you notice?".`;
}

/* ── Pass B: Premium rewrite prompt ── */
function buildRewritePrompt(mode: string, bucket: string): string {
  const modeTemplate = MODE_TEMPLATES[mode] || MODE_TEMPLATES["Reflect with me"];

  return `You are a premium response editor for MEND, a reflective emotional companion.

Rewrite the draft below into a final response. Output ONLY the rewritten response, nothing else.

${modeTemplate}

PREMIUM CHECKLIST (ALL must be satisfied or the response fails):

1. FORMULATION (required): Include a clean sentence following this pattern:
   "Because [specific event from user message], you're feeling [surface emotion], and you need [inferred need]."
   Weave it naturally into the first part. Do not label it.

2. EMOTIONAL LAYERING (required):
   - Name 1 surface emotion (what they're visibly feeling).
   - Name 1 protective emotion if applicable (what might be underneath, e.g., anger protecting hurt, numbness protecting grief).
   - Identify 1 inferred emotional need: safety, clarity, reassurance, autonomy, connection, or rest.

3. CONCRETE REFERENCE (required): Reference at least 1 specific phrase, event, or situation from the user's message. Use their actual words.

4. QUESTION (required): Ask exactly 1 targeted question that fits the "${mode}" mode.

5. LENGTH: Under 120 words total. Exactly 3 short parts.

6. FORBIDDEN (instant fail if present): "it sounds like", "it seems like", "maybe", "perhaps", "I wonder if", "It is understandable".

7. No clinical language, no metaphors unless the user used them first. No dashes.

${bucket === "Crisis" ? "CRISIS: Gently acknowledge. Encourage reaching out to someone trusted or a helpline. Brief and warm." : ""}

VALIDATION: Before outputting, verify:
- [ ] Formulation sentence present
- [ ] Surface emotion named
- [ ] Protective emotion named (if applicable)
- [ ] Emotional need identified
- [ ] At least 1 concrete user phrase referenced
- [ ] Exactly 1 question asked
- [ ] Under 120 words
- [ ] No forbidden phrases
- [ ] 3 parts structure
If any check fails, rewrite until all pass. Output only the final response.`;
}

/* ── Conversation snapshot prompt ── */
function buildSnapshotPrompt(): string {
  return `Summarize this conversation turn in 1-2 sentences. Focus on the user's core emotional state and what they're working through. Also list 1-3 key themes as a JSON array of short strings. Output valid JSON only: {"summary": "...", "themes": ["...", "..."]}`;
}

/* ── Supabase helper ── */
function getSupabaseAdmin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

/* ── Non-streaming AI call ── */
async function callAI(apiKey: string, systemPrompt: string, messages: any[]): Promise<string> {
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`AI call failed (${resp.status}): ${text}`);
  }

  const data = await resp.json();
  return data.choices?.[0]?.message?.content || "";
}

/* ── Streaming AI call ── */
async function streamAI(apiKey: string, systemPrompt: string, messages: any[]): Promise<Response> {
  return await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: true,
    }),
  });
}

/* ── Premium constraint validation ── */
function validatePremiumConstraints(text: string): { passed: boolean; failures: string[] } {
  const failures: string[] = [];
  const lower = text.toLowerCase();

  const forbidden = ["it sounds like", "it seems like", "maybe", "perhaps", "i wonder if", "it is understandable"];
  for (const phrase of forbidden) {
    if (lower.includes(phrase)) failures.push(`Contains forbidden phrase: "${phrase}"`);
  }

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount > 130) failures.push(`Over word limit: ${wordCount} words`);

  const questionCount = (text.match(/\?/g) || []).length;
  if (questionCount === 0) failures.push("No question found");
  if (questionCount > 2) failures.push(`Too many questions: ${questionCount}`);

  const paragraphs = text.split(/\n\n+/).filter(s => s.trim());
  if (paragraphs.length > 4) failures.push(`Too many parts: ${paragraphs.length}`);

  return { passed: failures.length === 0, failures };
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

    const mode = companion_mode || "Reflect with me";
    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user")?.content || "";
    const bucket = classifyBucket(lastUserMsg, mode);

    // Fetch conversation state for continuity
    let conversationSummary: string | null = null;
    try {
      const authHeader = req.headers.get("authorization");
      if (authHeader) {
        const supabase = getSupabaseAdmin();
        const token = authHeader.replace("Bearer ", "");
        const { data: { user } } = await createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_ANON_KEY")!
        ).auth.getUser(token);

        if (user) {
          const { data: stateData } = await supabase
            .from("conversation_state")
            .select("summary")
            .eq("user_id", user.id)
            .maybeSingle();

          if (stateData?.summary) {
            conversationSummary = stateData.summary;
          }
        }
      }
    } catch (e) {
      console.error("Failed to fetch conversation state:", e);
    }

    // ── Pass A: Generate draft (non-streaming) ──
    const draftPrompt = buildDraftPrompt(mode, bucket, user_state || null, conversationSummary);
    const draftResponse = await callAI(LOVABLE_API_KEY, draftPrompt, messages);

    console.log("[mend_chat] Pass A draft generated, length:", draftResponse.length);

    // ── Pass B: Premium rewrite (streaming) ──
    const rewritePrompt = buildRewritePrompt(mode, bucket);
    const rewriteMessages = [
      ...messages,
      { role: "assistant", content: draftResponse },
      { role: "user", content: "Now rewrite this draft into the final premium response. Output ONLY the rewritten response." },
    ];

    const streamResponse = await streamAI(LOVABLE_API_KEY, rewritePrompt, rewriteMessages);

    if (!streamResponse.ok) {
      if (streamResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "I need a moment to catch my breath. Please try again in a few seconds." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (streamResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "The AI companion service needs attention. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await streamResponse.text();
      console.error("AI gateway error (Pass B):", streamResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "Something went wrong. Let's try again in a moment." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Validate + Debug log ──
    const validation = validatePremiumConstraints(draftResponse);
    console.log("[mend_chat]", JSON.stringify({
      experience_mode: mode,
      communication_bucket: bucket,
      premium_constraints_satisfied: validation.passed,
      ...(validation.failures.length ? { constraint_failures: validation.failures } : {}),
    }));

    // ── Background: update conversation snapshot ──
    (async () => {
      try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) return;

        const token = authHeader.replace("Bearer ", "");
        const { data: { user } } = await createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_ANON_KEY")!
        ).auth.getUser(token);

        if (!user) return;

        const snapshotPrompt = buildSnapshotPrompt();
        const snapshotInput = [
          { role: "user", content: lastUserMsg },
          { role: "assistant", content: draftResponse },
        ];

        const snapshotRaw = await callAI(LOVABLE_API_KEY, snapshotPrompt, snapshotInput);

        const jsonMatch = snapshotRaw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const snapshot = JSON.parse(jsonMatch[0]);
          const supabase = getSupabaseAdmin();

          await supabase
            .from("conversation_state")
            .upsert({
              user_id: user.id,
              summary: snapshot.summary || "",
              themes: snapshot.themes || [],
              last_updated: new Date().toISOString(),
            }, { onConflict: "user_id" });

          console.log("[mend_chat] Conversation snapshot updated");
        }
      } catch (e) {
        console.error("Snapshot update failed:", e);
      }
    })();

    return new Response(streamResponse.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "X-Communication-Bucket": bucket,
      },
    });
  } catch (e) {
    console.error("mend_chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
