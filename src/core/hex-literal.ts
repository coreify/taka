import { toEnglishDigits } from "./locale";

/**
 * Normalizes Bangla digits, whitespace, and common fullwidth characters so that
 * hex literals are detected consistently with {@link containsHexLiteral}.
 */
export function normalizeForHexLiteralScan(input: string): string {
  let s = toEnglishDigits(input)
    .replace(/\u00a0/g, " ")
    .replace(/[−–—]/g, "-")
    .trim();

  s = s.replace(/[\uFF10-\uFF19]/g, (ch) => String(ch.charCodeAt(0) - 0xff10));
  s = s.replace(/\uFF58/g, "x");
  s = s.replace(/\uFF38/g, "X");

  return s;
}

/** True if the string contains an ASCII-style hex numeric literal (e.g. `0x10`, `０x10`). */
export function containsHexLiteral(input: string): boolean {
  return /0[xX][0-9a-fA-F]+/u.test(normalizeForHexLiteralScan(input));
}
