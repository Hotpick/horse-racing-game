// @ai-generated
// Implements: TASK-011 — Implement horse color palette utility
// Spec ref:   SPEC.md §2.1

/**
 * 20 visually distinct hex colors — one per horse.
 * Colors chosen to be distinguishable against both light and dark backgrounds.
 */
export const HORSE_COLORS: readonly string[] = [
  '#e74c3c', // red
  '#3498db', // blue
  '#2ecc71', // green
  '#f39c12', // orange
  '#9b59b6', // purple
  '#1abc9c', // teal
  '#e67e22', // dark orange
  '#34495e', // dark slate
  '#e91e63', // pink
  '#00bcd4', // cyan
  '#8bc34a', // light green
  '#ff5722', // deep orange
  '#607d8b', // blue grey
  '#ffeb3b', // yellow
  '#673ab7', // deep purple
  '#009688', // teal dark
  '#f06292', // light pink
  '#4caf50', // medium green
  '#ff9800', // amber
  '#5c6bc0', // indigo
]

/**
 * Fisher-Yates shuffle — returns a new shuffled copy, does not mutate input.
 */
function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = copy[i]!
    copy[i] = copy[j]!
    copy[j] = temp
  }
  return copy
}

/**
 * Return `count` unique colors from the palette in a random order.
 * @param count - number of colors (max 20)
 */
export function assignColors(count: number): string[] {
  return shuffle(HORSE_COLORS).slice(0, count)
}
