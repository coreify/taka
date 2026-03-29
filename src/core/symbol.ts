import {
  TAKA_CODE,
  TAKA_NAME_BN,
  TAKA_NAME_EN,
  TAKA_SYMBOL
} from "./constants";
import type { TakaLanguage, TakaLocale } from "../types";

export function getTakaSymbol(): string {
  return TAKA_SYMBOL;
}

export function getTakaCode(): string {
  return TAKA_CODE;
}

export function getTakaName(
  language: TakaLanguage | TakaLocale = "en"
): string {
  const code = String(language);

  if (code === "bn" || code === "bn-BD" || code.startsWith("bn-")) {
    return TAKA_NAME_BN;
  }

  if (code === "en" || code === "en-BD" || code.startsWith("en-")) {
    return TAKA_NAME_EN;
  }

  return TAKA_NAME_EN;
}
