// threat_keywords.js
// Simple keyword list grouped by category. You can expand this.

const THREAT_KEYWORDS = {
  death_threats: [
    "kill you",
    "i will kill",
    "i'll kill",
    "murder you",
    "i will murder",
    "i'll murder",
    "die",
    "i'll find you",
    "i will find you",
    "i'll come",
    "i will come"
  ],
  blackmail: [
    "send money",
    "pay me",
    "transfer",
    "or else",
    "leak your pics",
    "i have your pictures",
    "leak your photos",
    "pay up"
  ],
  sexual_threats: [
    "rape you",
    "i will rape",
    "sexual",
    "expose yourself",
    "send nudes or else"
  ],
  harm: [
    "hurt you",
    "stab you",
    "beat you",
    "attack you",
    "burn you"
  ]
};

// Flattened list for quick matching
const FLATTENED_KEYWORDS = Object.values(THREAT_KEYWORDS).flat();
