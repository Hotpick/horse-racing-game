// @ai-generated
// Implements: TASK-009 — Implement horse name generator utility
// Spec ref:   SPEC.md §2.8

// Word lists defined in SPEC.md §2.8 — exactly 20 entries each
export const ADJECTIVES: readonly string[] = [
  'Swift',
  'Iron',
  'Golden',
  'Dark',
  'Silver',
  'Wild',
  'Noble',
  'Brave',
  'Storm',
  'Royal',
  'Lucky',
  'Mighty',
  'Shadow',
  'Crimson',
  'Fierce',
  'Proud',
  'Silent',
  'Flash',
  'Thunder',
  'Blazing',
]

export const NOUNS: readonly string[] = [
  'Arrow',
  'Duke',
  'Knight',
  'Spirit',
  'Star',
  'Wind',
  'Champion',
  'Legend',
  'Glory',
  'Prince',
  'Fury',
  'Blaze',
  'Crown',
  'Valor',
  'Comet',
  'Titan',
  'Dancer',
  'Phantom',
  'Ranger',
  'Falcon',
]

/**
 * Fisher-Yates shuffle — returns a new shuffled copy, does not mutate input.
 * Pure function, no side effects.
 */
function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    // Safe: j is always a valid index in range [0, i]
    const temp = copy[i]!
    copy[i] = copy[j]!
    copy[j] = temp
  }
  return copy
}

/**
 * Generate `count` unique horse names in "Adjective Noun" format.
 * SPEC.md §2.8: shuffle both lists, pair index-by-index → 20 unique names guaranteed.
 *
 * @param count - number of names to generate (max 20 — limited by word list size)
 */
export function generateHorseNames(count: number): string[] {
  const adjectives = shuffle(ADJECTIVES)
  const nouns = shuffle(NOUNS)
  // Pair index-by-index — uniqueness guaranteed because both lists are shuffled
  // permutations of the same 20 words with no repeats
  return Array.from({ length: count }, (_, i) => `${adjectives[i]} ${nouns[i]}`)
}
