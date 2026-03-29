import {
  TAKA_CODE,
  TAKA_NAME_BN,
  TAKA_NAME_EN,
  TAKA_SYMBOL
} from "./constants";
import { toEnglishDigits } from "./locale";
import type { ParseTakaOptions } from "../types";

const CURRENCY_TOKENS = [
  TAKA_SYMBOL,
  TAKA_CODE,
  TAKA_NAME_EN,
  TAKA_NAME_BN
] as const;
const CURRENCY_PATTERN = new RegExp(
  `(${escapeForRegExp(TAKA_SYMBOL)}|\\b${TAKA_CODE}\\b|\\b${TAKA_NAME_EN}\\b|${TAKA_NAME_BN})`,
  "gi"
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
  normalized = normalized.replace(/[, ]+/g, "");
  normalized = normalized.replace(/^\+/, "");

  return normalized.trim();
}

export function parseTaka(
  input: string,
  options: ParseTakaOptions = {}
): number | null {
  const normalized = normalizeTakaInput(input, options);

  if (!normalized || !/^-?(?:\d+\.?\d*|\.\d+)$/.test(normalized)) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isTakaString(
  input: string,
  options: ParseTakaOptions = {}
): boolean {
  return hasTakaToken(input) && parseTaka(input, options) !== null;
}

function hasTakaToken(input: string): boolean {
  return CURRENCY_TOKENS.some((token) => {
    if (token === TAKA_SYMBOL || token === TAKA_NAME_BN) {
      return input.includes(token);
    }

    return new RegExp(`\\b${token}\\b`, "i").test(input);
  });
}

function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
