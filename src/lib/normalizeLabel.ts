/**
 * normalizeLabel — maps verbose extracted signal phrases to clean,
 * product-friendly concept names for display in the Patterns graph.
 *
 * The original raw label is preserved internally (e.g. in GraphNode.id);
 * only the display label is normalized.
 */

const normalizationMap: Record<string, string> = {
  // Activities & coping
  "writing things down": "journaling",
  "writing it out": "journaling",
  "putting thoughts on paper": "journaling",
  "journaling about feelings": "journaling",
  "journal writing": "journaling",
  "quiet reading time": "reading",
  "reading before bed": "reading",
  "reading a book": "reading",
  "going for a walk": "walking",
  "taking a walk": "walking",
  "walking outside": "walking",
  "physical exercise": "exercise",
  "working out": "exercise",
  "going to the gym": "exercise",
  "deep breathing": "breathwork",
  "breathing exercises": "breathwork",
  "breath work": "breathwork",
  "meditation practice": "meditation",
  "guided meditation": "meditation",
  "sitting quietly": "stillness",
  "listening to music": "music",
  "playing music": "music",
  "talking to a friend": "connection",
  "reaching out to someone": "connection",
  "calling a friend": "connection",
  "spending time with family": "family time",
  "cooking a meal": "cooking",
  "preparing food": "cooking",
  "creative expression": "creativity",
  "making art": "creativity",

  // Emotional processes
  "acknowledging the discomfort": "acceptance",
  "accepting the feeling": "acceptance",
  "sitting with the feeling": "acceptance",
  "letting it be": "acceptance",
  "social overthinking": "rumination",
  "overthinking things": "rumination",
  "going over things in my head": "rumination",
  "replaying conversations": "rumination",
  "thinking about the past": "reflection",
  "looking back on things": "reflection",
  "self reflection": "reflection",
  "feeling overwhelmed by tasks": "overwhelm",
  "too much to do": "overwhelm",
  "not knowing what to do": "uncertainty",
  "feeling uncertain": "uncertainty",
  "feeling unsure": "uncertainty",
  "second guessing myself": "self-doubt",
  "doubting myself": "self-doubt",
  "comparing myself to others": "comparison",
  "comparing myself": "comparison",
  "avoiding things": "avoidance",
  "putting things off": "avoidance",
  "procrastinating": "avoidance",
  "feeling disconnected": "disconnection",
  "feeling numb": "numbness",
  "trouble sleeping": "restlessness",
  "can't sleep": "restlessness",
  "difficulty sleeping": "restlessness",
  "sleep disruption": "restlessness",
  "feeling grateful": "gratitude",
  "counting blessings": "gratitude",
  "feeling hopeful": "hope",
  "seeing a way forward": "hope",

  // Context / triggers
  "work pressure": "work stress",
  "pressure at work": "work stress",
  "busy work week": "work stress",
  "work deadlines": "work stress",
  "relationship issues": "relationships",
  "relationship tension": "relationships",
  "partner conflict": "relationships",
  "family dynamics": "family",
  "family issues": "family",
  "family conflict": "family",
  "financial stress": "finances",
  "money worries": "finances",
  "financial pressure": "finances",
  "health concerns": "health",
  "health anxiety": "health",
  "future uncertainty": "future worry",
  "worrying about the future": "future worry",
  "change in routine": "routine shift",
  "routine disruption": "routine shift",
  "loss of routine": "routine shift",
  "feeling lonely": "loneliness",
  "social isolation": "loneliness",
};

/**
 * Normalize a raw extracted label into a clean display concept.
 * Returns the mapped short form or the original (lowercased, trimmed)
 * if no mapping exists.
 */
export function normalizeLabel(raw: string): string {
  const key = raw.toLowerCase().trim();
  return normalizationMap[key] || key;
}
