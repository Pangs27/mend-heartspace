/**
 * Journal Experience — AI Behavioral Guardrails
 *
 * These constraints are first-class rules for any feature touching the
 * journal editor. They exist to protect emotional safety, trust, and
 * the non-performative nature of the writing space.
 *
 * RULES:
 *
 * 1. NO AI DURING WRITING
 *    AI must never interrupt, prompt, suggest, or respond while the
 *    user is actively typing. The editor is a silence-first zone.
 *
 * 2. NO SAME-SESSION ANALYSIS
 *    A journal entry must never be analyzed, summarized, labeled, or
 *    interpreted in the same session it was written. No insights,
 *    tags, sentiment scores, or pattern extractions at write time.
 *
 * 3. ACKNOWLEDGMENT ONLY
 *    On completion or blur, the system may show a brief, static
 *    acknowledgment (e.g. "Thank you for putting this down.").
 *    This must not contain feedback, evaluation, or commentary.
 *
 * 4. NO DIAGNOSTIC LANGUAGE
 *    The system must avoid definitive or clinical language about the
 *    user's emotions, intent, or mental state. Phrasing must remain
 *    tentative, observational, and non-prescriptive.
 *
 * 5. RESTRAINT OVER SPECULATION
 *    When uncertain how to respond, the system must choose silence
 *    or minimal acknowledgment. Never speculate about meaning.
 *
 * 6. REFLECTIONS ARE EXTERNAL & OPTIONAL
 *    Any observations derived from journal content (e.g. in Patterns)
 *    must occur outside the writing flow, on a separate surface,
 *    and must be clearly optional and dismissible.
 *
 * 7. NO METRICS OR PERFORMANCE SIGNALS
 *    The journal must never show streaks, word counts, completion
 *    states, scores, or any signal that implies the user should
 *    write more, better, or differently.
 *
 * 8. PROTECTED SPACE
 *    The journal does not require responses, outcomes, or improvement.
 *    It is not a tool. It is a place.
 */

/** Ambient lines shown only after sustained writing — must be non-directive. */
export const AMBIENT_LINES = [
  "You're doing something good by being here.",
  "There's no wrong way to say this.",
  "This is yours. Take your time.",
  "Whatever you're feeling is worth writing down.",
] as const;

/** Post-writing acknowledgment — static, no feedback, no analysis. */
export const ACKNOWLEDGMENT = {
  primary: "Thank you for putting this down.",
  secondary: "It's saved. It's yours.",
  /** Duration in ms before fading back to idle */
  displayDuration: 4000,
} as const;

/** Ambient guidance timing */
export const AMBIENT_TIMING = {
  /** Minimum typing duration (ms) before ambient line may appear */
  delayMs: 17000,
  /** How long the ambient line stays visible (ms) */
  dismissMs: 6000,
} as const;
