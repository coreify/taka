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
  return language.startsWith("bn") ? TAKA_NAME_BN : TAKA_NAME_EN;
}
