const adjectives = [
  "Quiet", "Soft", "Calm", "Gentle", "Still", "Warm", "Kind", "Bright",
  "Deep", "Slow", "Mild", "Clear", "Light", "Open", "True", "Steady",
];

const nouns = [
  "River", "Pine", "Sky", "Stone", "Meadow", "Cloud", "Leaf", "Wave",
  "Rain", "Moon", "Star", "Shore", "Field", "Bloom", "Wind", "Dawn",
];

export function generateAlias(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}${noun}`;
}
