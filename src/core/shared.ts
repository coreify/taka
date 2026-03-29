import {
  TAKA_CODE,
  TAKA_NAME_BN,
  TAKA_NAME_EN,
  TAKA_SYMBOL
} from "./constants";
import { containsHexLiteral } from "./hex-literal";
import {
  isExactZeroPlainNumericString,
  isExactZeroScientificNumericString,
  isSafeNumberString,
  isSafeScientificNumberString,
  isStrictPlainNumericString,
  isStrictScientificNumericString,
  normalizePlainNumericString
} from "./numeric-string";
import type {
  CompactUnit,
  FractionDigits,
  TakaCompactStyle,
  TakaCurrencyDisplay,
  TakaCurrencyPosition,
  TakaFormatOptions,
  TakaLocale,
  TakaNumericInput
} from "../types";

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

export function coerceFiniteAmount(
  value: TakaNumericInput,
  options: Pick<
    TakaFormatOptions,
    "allowScientificNotation" | "allowLooseCommaGrouping"
  > = {}
): number {
  if (typeof value === "bigint") {
    if (
      value > BigInt(Number.MAX_SAFE_INTEGER) ||
      value < BigInt(Number.MIN_SAFE_INTEGER)
    ) {
      throw new RangeError("Amount is outside the safe numeric range.");
    }

    return Number(value);
  }

  const normalizedValue =
    value instanceof Number ? value.valueOf() : typeof value === "string"
      ? value.trim()
      : value;

  if (typeof normalizedValue === "string") {
    if (!normalizedValue) {
      throw new TypeError("Expected a finite number or numeric string.");
    }

    if (containsHexLiteral(normalizedValue)) {
      throw new TypeError("Hex numeric strings are not accepted.");
    }

    const normalized = normalizePlainNumericString(normalizedValue, {
      allowLooseCommaGrouping: options.allowLooseCommaGrouping === true
    });

    if (options.allowScientificNotation && isStrictScientificNumericString(normalized)) {
      if (!isSafeScientificNumberString(normalized)) {
        throw new RangeError("Amount is outside the safe numeric range.");
      }

      const parsed = Number(normalized);

      if (
        !Number.isFinite(parsed) ||
        (parsed === 0 && !isExactZeroScientificNumericString(normalized))
      ) {
        throw new RangeError("Amount is outside the safe numeric range.");
      }

      return parsed;
    }

    if (!isStrictPlainNumericString(normalized)) {
      throw new TypeError(
        "Expected a finite number or plain numeric string (e.g. 1250, 1,250, or 1.234,56). Hex strings are not accepted. Enable allowScientificNotation for values like 1e6."
      );
    }

    if (!isSafeNumberString(normalized)) {
      throw new RangeError("Amount is outside the safe numeric range.");
    }

    const parsed = Number(normalized);

    if (
      !Number.isFinite(parsed) ||
      (parsed === 0 && !isExactZeroPlainNumericString(normalized))
    ) {
      throw new RangeError("Amount is outside the safe numeric range.");
    }

    return parsed;
  }

  if (!Number.isFinite(normalizedValue)) {
    throw new TypeError("Expected a finite number or numeric string.");
  }

  return normalizedValue;
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
