import {
  TAKA_CODE,
  TAKA_NAME_BN,
  TAKA_NAME_EN,
  TAKA_SYMBOL
} from "./constants";
import { toEnglishDigits } from "./locale";
import { containsHexLiteral } from "./hex-literal";
import {
  isExactZeroPlainNumericString,
  isExactZeroScientificNumericString,
  isSafeNumberString,
  isSafeScientificNumberString,
  isStrictPlainNumericString,
  isStrictScientificNumericString,
  normalizeNumericSeparators
} from "./numeric-string";
import { countTakaSymbols } from "./taka-symbol-scan";
import type { ParseTakaOptions } from "../types";

const CURRENCY_PATTERN = new RegExp(
  `(${escapeForRegExp(TAKA_SYMBOL)}|\\b${TAKA_CODE}\\b|\\b${TAKA_NAME_EN}\\b|(?<![\\p{L}\\p{M}])${escapeForRegExp(TAKA_NAME_BN)}(?![\\p{L}\\p{M}]))`,
  "giu"
);

export function normalizeTakaInput(
  input: string,
  options: ParseTakaOptions = {}
): string {
  let normalized = toEnglishDigits(input)
    .replace(/\u00a0/g, " ")
    .replace(/[−–—]/g, "-")
    .trim();

  if ((options.allowParentheses ?? true) && /^\(.*\)$/.test(normalized)) {
    normalized = `-${normalized.slice(1, -1)}`;
  }

  normalized = normalized.replace(CURRENCY_PATTERN, "");
  normalized = stripGluedCurrencyCodeAndName(normalized);
  normalized = normalized.replace(/\s+/g, "");
  normalized = normalized.replace(/^\+/, "");
  normalized = normalizeNumericSeparators(normalized, {
    allowLooseCommaGrouping: options.allowLooseCommaGrouping === true
  });

  return normalized.trim();
}

export function parseTaka(
  input: string,
  options: ParseTakaOptions = {}
): number | null {
  if (containsHexLiteral(input)) {
    throw new TypeError("Hex numeric strings are not accepted.");
  }

  if (countTakaSymbols(input) > 1) {
    return null;
  }

  const normalized = normalizeTakaInput(input, options);

  if (!normalized) {
    return null;
  }

  if (options.allowScientificNotation && isStrictScientificNumericString(normalized)) {
    if (!hasTakaToken(input)) {
      return null;
    }

    if (!isSafeScientificNumberString(normalized)) {
      return null;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) &&
        !(parsed === 0 && !isExactZeroScientificNumericString(normalized))
      ? parsed
      : null;
  }

  if (!isStrictPlainNumericString(normalized)) {
    return null;
  }

  if (!isSafeNumberString(normalized)) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) &&
      !(parsed === 0 && !isExactZeroPlainNumericString(normalized))
    ? parsed
    : null;
}

export function isTakaString(
  input: string,
  options: ParseTakaOptions = {}
): boolean {
  if (containsHexLiteral(input)) {
    return false;
  }

  if (countTakaSymbols(input) > 1) {
    return false;
  }

  return hasTakaToken(input) && parseTaka(input, options) !== null;
}

function stripGluedCurrencyCodeAndName(normalized: string): string {
  let value = normalized;

  value = value.replace(/^-BDT(?=\d)/gi, "-");
  value = value.replace(/^BDT(?=\d)/gi, "");
  value = value.replace(/(?<=\d)BDT$/gi, "");

  value = value.replace(/^-Taka(?=\d)/gi, "-");
  value = value.replace(/^Taka(?=\d)/gi, "");
  value = value.replace(/(?<=\d)Taka$/gi, "");

  const bn = escapeForRegExp(TAKA_NAME_BN);
  value = value.replace(new RegExp(`^-${bn}(?=\\d)`, "u"), "-");
  value = value.replace(new RegExp(`^${bn}(?=\\d)`, "u"), "");
  value = value.replace(new RegExp(`(?<=\\d)${bn}$`, "u"), "");

  return value;
}

function hasBanglaTakaNameToken(input: string): boolean {
  const bn = escapeForRegExp(TAKA_NAME_BN);
  return new RegExp(`(?<![\\p{L}\\p{M}])${bn}(?![\\p{L}\\p{M}])`, "u").test(
    input
  );
}

function hasBdtOrEnglishNameToken(input: string): boolean {
  const bdt = /\bBDT\b|BDT(?=\d)|(?<=\d)BDT$/i;
  if (bdt.test(input)) {
    return true;
  }

  const taka = /\bTaka\b|Taka(?=\d)|(?<=\d)Taka$/i;
  return taka.test(input);
}

function hasTakaToken(input: string): boolean {
  if (input.includes(TAKA_SYMBOL)) {
    return true;
  }

  if (hasBanglaTakaNameToken(input)) {
    return true;
  }

  return hasBdtOrEnglishNameToken(input);
}

function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
