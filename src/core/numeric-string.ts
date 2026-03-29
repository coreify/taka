import { toEnglishDigits } from "./locale";

const MAX_SAFE_INTEGER_STRING = String(Number.MAX_SAFE_INTEGER);
const PLAIN_NUMBER_PATTERN = /^-?(?:\d+\.?\d*|\.\d+)$/;
const SCIENTIFIC_NOTATION_PATTERN =
  /^-?(?:\d+(?:\.\d+)?|\.\d+)[eE][+-]?\d+$/;

export interface NormalizePlainNumericOptions {
  allowParentheses?: boolean;
  allowLooseCommaGrouping?: boolean;
}

export function normalizePlainNumericString(
  raw: string,
  options: NormalizePlainNumericOptions = {}
): string {
  let normalized = toEnglishDigits(raw)
    .replace(/\u00a0/g, " ")
    .replace(/[−–—]/g, "-")
    .trim();

  if ((options.allowParentheses ?? true) && /^\(.*\)$/.test(normalized)) {
    normalized = `-${normalized.slice(1, -1)}`;
  }

  normalized = normalized.replace(/\s+/g, "");
  normalized = normalized.replace(/^\+/, "");
  normalized = normalizeNumericSeparators(normalized, options);

  return normalized.trim();
}

export function normalizeNumericSeparators(
  value: string,
  options: Pick<NormalizePlainNumericOptions, "allowLooseCommaGrouping"> = {}
): string {
  const hasDot = value.includes(".");
  const hasComma = value.includes(",");

  if (hasDot && hasComma) {
    return normalizeMixedSeparators(value);
  }

  if (hasComma) {
    return normalizeCommaOnlySeparators(value, options);
  }

  if (hasDot && hasThousandsDotGrouping(value)) {
    return value.replace(/\./g, "");
  }

  return value;
}

function normalizeMixedSeparators(value: string): string {
  const lastDotIndex = value.lastIndexOf(".");
  const lastCommaIndex = value.lastIndexOf(",");

  if (lastCommaIndex > lastDotIndex) {
    return value.replace(/\./g, "").replace(",", ".");
  }

  return value.replace(/,/g, "");
}

function normalizeCommaOnlySeparators(
  value: string,
  options: Pick<NormalizePlainNumericOptions, "allowLooseCommaGrouping">
): string {
  const commaCount = countOccurrences(value, ",");

  if (hasThousandsCommaGrouping(value)) {
    return value.replace(/,/g, "");
  }

  if (hasIndianCommaGrouping(value)) {
    return value.replace(/,/g, "");
  }

  if (commaCount > 1) {
    if (options.allowLooseCommaGrouping) {
      const stripped = value.replace(/,/g, "");
      if (
        isStrictPlainNumericString(stripped) &&
        isSafeNumberString(stripped)
      ) {
        return stripped;
      }
    }

    return value;
  }

  const [integerPart = "", fractionPart = ""] = value.split(",");
  const normalizedIntegerPart = integerPart.replace(/^-/, "");

  if (
    normalizedIntegerPart &&
    /^\d+$/.test(normalizedIntegerPart) &&
    /^\d{1,2}$/.test(fractionPart)
  ) {
    return `${integerPart}.${fractionPart}`;
  }

  return value;
}

function hasIndianCommaGrouping(value: string): boolean {
  return /^-?\d{1,3}(?:,\d{2})*,\d{3}$/.test(value);
}

function hasThousandsCommaGrouping(value: string): boolean {
  return /^-?\d{1,3}(?:,\d{3})+$/.test(value);
}

function hasThousandsDotGrouping(value: string): boolean {
  return /^-?\d{1,3}(?:\.\d{3})+$/.test(value);
}

function countOccurrences(value: string, needle: string): number {
  return value.split(needle).length - 1;
}

export function isSafeNumberString(value: string): boolean {
  const unsignedValue = value.startsWith("-") ? value.slice(1) : value;
  const [integerPart = "0"] = unsignedValue.split(".");
  const normalizedIntegerPart = integerPart.replace(/^0+(?=\d)/, "");

  if (normalizedIntegerPart.length < MAX_SAFE_INTEGER_STRING.length) {
    return true;
  }

  if (normalizedIntegerPart.length > MAX_SAFE_INTEGER_STRING.length) {
    return false;
  }

  return normalizedIntegerPart <= MAX_SAFE_INTEGER_STRING;
}

export function isStrictPlainNumericString(normalized: string): boolean {
  return normalized.length > 0 && PLAIN_NUMBER_PATTERN.test(normalized);
}

export function isStrictScientificNumericString(normalized: string): boolean {
  return normalized.length > 0 && SCIENTIFIC_NOTATION_PATTERN.test(normalized);
}

export function isSafeCoercedFiniteNumber(n: number): boolean {
  if (!Number.isFinite(n)) {
    return false;
  }

  if (Object.is(n, -0) || n === 0) {
    return true;
  }

  if (Number.isInteger(n)) {
    return Number.isSafeInteger(n);
  }

  return Math.abs(n) <= Number.MAX_SAFE_INTEGER;
}
