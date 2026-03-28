const GREETING_PATTERNS = [
  /^(hi|hello|hey|hiya|howdy)$/i,
  /^(hi|hello|hey|hiya|howdy)\s+there$/i,
  /^good\s+(morning|afternoon|evening)$/i,
  /^(how are you|how's it going|how are you doing|whats up|what's up|sup|how ya doin)$/i,
];

const CASUAL_CHAT_PATTERNS = [
  /^(tell me a joke|tell me something|what can you do|who are you|what is your name)$/i,
  /^(thanks|thank you|ok thanks|okay thanks|thanks mend|thank you mend)$/i,
  /^(bye|goodbye|see you|see ya|talk later|gn|goodnight|good night)$/i,
  /^(i'm (good|fine|ok|okay|not bad|great|hanging in there|could be better|not too good))$/i,
  /^(good|fine|ok|okay|not bad|great|hanging in there|could be better|not too good)$/i,
  /^(how about you|and you|how are you\?)$/i,
];

export function isGreetingOnly(input: string): boolean {
  const normalized = input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s']/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) return false;

  const words = normalized.split(" ");
  if (words.length <= 8) {
    if (GREETING_PATTERNS.some((p) => p.test(normalized))) return true;
    if (CASUAL_CHAT_PATTERNS.some((p) => p.test(normalized))) return true;
  }

  return false;
}

export function getGreetingReply(): string {
  return "Hi, I’m glad you’re here. How are you doing today?";
}