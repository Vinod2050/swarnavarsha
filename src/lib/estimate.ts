/*
 * Old gold estimator maths. Kept apart from rates.ts so the browser bundle of the
 * estimator never pulls in the database code.
 */

/** Purity factors used by the old gold estimator (CLAUDE.md Section 10). */
export const PURITY_FACTORS = {
  '24': 0.999,
  '22': 0.916,
  '20': 0.833,
  '18': 0.75,
  '14': 0.585,
} as const

export type Karat = keyof typeof PURITY_FACTORS

export function estimateValue(weightGrams: number, purityFactor: number, rate24k: number) {
  const value = weightGrams * purityFactor * rate24k
  return { low: Math.round(value * 0.97), high: Math.round(value) }
}
