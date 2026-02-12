/**
 * Lightweight heuristic intent classifier for user messages.
 * No ML — pattern-based only.
 */

export type UserIntent = "disclosure" | "pattern_curiosity" | "meta" | "logistics" | "unknown";

const DISCLOSURE_PHRASES = [
  "i feel", "i've been", "i'm struggling", "lately", "can't stop thinking",
  "i am feeling", "been feeling", "it hurts", "i'm afraid", "i'm scared",
  "i'm worried", "i'm anxious", "i'm sad", "i'm angry", "i'm lonely",
  "i miss", "i lost", "i'm overwhelmed", "i'm exhausted", "i'm tired of",
];

const PATTERN_CURIOSITY_PHRASES = [
  "keep", "always", "again", "pattern", "why does this", "this happens",
  "every time", "same thing", "over and over", "recurring",
];

const META_PHRASES = [
  "why do you ask", "what are you", "are you", "how does this work",
  "what do you mean", "stop", "don't ask", "who are you", "what is this",
  "how do you know",
];

const LOGISTICS_PHRASES = [
  "pricing", "plan", "login", "signup", "sign up", "log in",
  "where", "how do i", "bug", "error", "account", "subscription",
  "payment", "billing", "cancel",
];

const DEFLECTION_PHRASES = [
  "why do you ask that", "not sure", "leave it", "idk",
  "doesn't matter", "don't know", "whatever", "nevermind",
  "never mind", "drop it", "forget it", "i guess",
];

function lower(s: string): string {
  return s.toLowerCase().trim();
}

function containsAny(text: string, phrases: string[]): boolean {
  const t = lower(text);
  return phrases.some((p) => t.includes(p));
}

export function classifyIntent(message: string): UserIntent {
  const text = lower(message);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const isShortQuestion = text.endsWith("?") && text.length < 40;

  // Meta takes priority — short questions or meta phrases
  if (containsAny(text, META_PHRASES) || isShortQuestion) {
    return "meta";
  }

  if (containsAny(text, LOGISTICS_PHRASES)) {
    return "logistics";
  }

  if (containsAny(text, PATTERN_CURIOSITY_PHRASES)) {
    return "pattern_curiosity";
  }

  if (containsAny(text, DISCLOSURE_PHRASES) || (text.length > 10 && !text.endsWith("?"))) {
    return "disclosure";
  }

  return "unknown";
}

export function isReceptive(message: string): boolean {
  const wordCount = message.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount < 6) return false;
  if (containsAny(message, DEFLECTION_PHRASES)) return false;
  return true;
}
