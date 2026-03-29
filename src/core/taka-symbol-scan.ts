import { TAKA_SYMBOL } from "./constants";

/** Counts U+09F3 (৳) occurrences in the string (single-code-unit symbol). */
export function countTakaSymbols(input: string): number {
  let n = 0;

  for (const c of input) {
    if (c === TAKA_SYMBOL) {
      n++;
    }
  }

  return n;
}
