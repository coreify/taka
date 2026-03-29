import {
  TAKA_CODE,
  TAKA_NAME_BN,
  TAKA_NAME_EN,
  TAKA_SYMBOL
} from "./constants";
import type {
  TakaCompactStyle,
  TakaCurrencyDisplay,
  TakaCurrencyPosition,
  TakaFormatOptions,
  TakaLocale
} from "./types";

interface FractionDigits {
  minimumFractionDigits: number;
  maximumFractionDigits: number;
}

export interface CompactUnit {
  threshold: number;
  suffix: string;
}

const SOUTH_ASIAN_UNITS: CompactUnit[] = [
  { threshold: 10_000_000, suffix: "Cr" },
  { threshold: 100_000, suffix: "L" },
  { threshold: 1_000, suffix: "K" }
];

const INTERNATIONAL_UNITS: CompactUnit[] = [
  { threshold: 1_000_000_000, suffix: "B" },
  { threshold: 1_000_000, suffix: "M" },
  { threshold: 1_000, suffix: "K" }
];

export function assertFiniteAmount(value: number): void {
  if (!Number.isFinite(value)) {
    throw new TypeError("Expected a finite number.");
  }
}

export function resolveLocale(locale?: TakaLocale): TakaLocale {
  return locale ?? "en-BD";
}

export function resolveCurrencyDisplay(
  options?: Pick<TakaFormatOptions, "currency" | "style">
): TakaCurrencyDisplay {
  return options?.style ?? options?.currency ?? "symbol";
}

export function resolveCurrencyPosition(
  display: TakaCurrencyDisplay,
  position?: TakaCurrencyPosition
): TakaCurrencyPosition {
  if (position) {
    return position;
  }

  return display === "name" ? "after" : "before";
}

export function resolveCurrencySpacing(
  display: TakaCurrencyDisplay,
  space?: boolean
): boolean {
  if (typeof space === "boolean") {
    return space;
  }

  return display !== "symbol";
}

export function resolveFractionDigits(
  value: number,
  decimals: number | undefined,
  trailingZeros: boolean | undefined,
  fallbackMaximum = 2
): FractionDigits {
  if (decimals === undefined) {
    return {
      minimumFractionDigits: 0,
      maximumFractionDigits: Number.isInteger(value) ? 0 : fallbackMaximum
    };
  }

  const safeDecimals = normalizeDecimalPlaces(decimals);

  return {
    minimumFractionDigits: trailingZeros === false ? 0 : safeDecimals,
    maximumFractionDigits: safeDecimals
  };
}

export function formatNumber(
  value: number,
  locale: TakaLocale,
  fractionDigits: FractionDigits,
  useGrouping: boolean
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits.minimumFractionDigits,
    maximumFractionDigits: fractionDigits.maximumFractionDigits,
    useGrouping
  }).format(value);
}

export function getCurrencyLabel(
  display: TakaCurrencyDisplay,
  locale: TakaLocale
): string {
  if (display === "code") {
    return TAKA_CODE;
  }

  if (display === "name") {
    return locale === "bn-BD" ? TAKA_NAME_BN : TAKA_NAME_EN;
  }

  return TAKA_SYMBOL;
}

export function combineCurrencyAndValue(
  currencyLabel: string,
  valueText: string,
  position: TakaCurrencyPosition,
  spaced: boolean
): string {
  const separator = spaced ? " " : "";
  return position === "after"
    ? `${valueText}${separator}${currencyLabel}`
    : `${currencyLabel}${separator}${valueText}`;
}

export function applyNegativeStyle(
  valueText: string,
  value: number,
  negativeStyle: TakaFormatOptions["negativeStyle"]
): string {
  if (Object.is(value, -0) || value >= 0) {
    return valueText;
  }

  return negativeStyle === "accounting" ? `(${valueText})` : `-${valueText}`;
}

export function getCompactUnits(style: TakaCompactStyle): CompactUnit[] {
  return style === "international" ? INTERNATIONAL_UNITS : SOUTH_ASIAN_UNITS;
}

function normalizeDecimalPlaces(decimals: number): number {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 20) {
    throw new RangeError(
      "Expected decimals to be an integer between 0 and 20."
    );
  }

  return decimals;
}
