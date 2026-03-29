import { toEnglishDigits } from "./locale";

const MAX_SAFE_INTEGER_STRING = String(Number.MAX_SAFE_INTEGER);
const MAX_SAFE_INTEGER_LENGTH = MAX_SAFE_INTEGER_STRING.length;
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
  return isDecimalWithinSafeRange(analyzePlainNumericString(value));
}

export function isSafeScientificNumberString(value: string): boolean {
  return isDecimalWithinSafeRange(analyzeScientificNumericString(value));
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

export function isExactZeroPlainNumericString(value: string): boolean {
  return analyzePlainNumericString(value).isZero;
}

export function isExactZeroScientificNumericString(value: string): boolean {
  return analyzeScientificNumericString(value).isZero;
}

interface DecimalMagnitudeAnalysis {
  decimalIndex: bigint;
  isZero: boolean;
  significantDigits: string;
}

function analyzePlainNumericString(value: string): DecimalMagnitudeAnalysis {
  const unsignedValue = value.startsWith("-") ? value.slice(1) : value;
  const [integerPart = "0", fractionPart = ""] = unsignedValue.split(".");

  return analyzeNormalizedDecimalParts(integerPart, fractionPart, 0n);
}

function analyzeScientificNumericString(
  value: string
): DecimalMagnitudeAnalysis {
  const unsignedValue = value.startsWith("-") ? value.slice(1) : value;
  const [coefficient = "0", exponentPart = "0"] = unsignedValue.split(
    /[eE]/,
    2
  );
  const [integerPart = "0", fractionPart = ""] = coefficient.split(".");
  const normalizedExponent =
    exponentPart.startsWith("+") ? exponentPart.slice(1) : exponentPart;

  return analyzeNormalizedDecimalParts(
    integerPart,
    fractionPart,
    BigInt(normalizedExponent)
  );
}

function analyzeNormalizedDecimalParts(
  integerPart: string,
  fractionPart: string,
  exponent: bigint
): DecimalMagnitudeAnalysis {
  const combinedDigits = `${integerPart}${fractionPart}`;

  if (!combinedDigits || !/[1-9]/.test(combinedDigits)) {
    return {
      decimalIndex: 1n,
      isZero: true,
      significantDigits: "0"
    };
  }

  const leadingZerosMatch = combinedDigits.match(/^0+/);
  const leadingZeroCount = leadingZerosMatch?.[0].length ?? 0;

  return {
    decimalIndex:
      BigInt(integerPart.length) + exponent - BigInt(leadingZeroCount),
    isZero: false,
    significantDigits: combinedDigits.slice(leadingZeroCount)
  };
}

function isDecimalWithinSafeRange(
  analysis: DecimalMagnitudeAnalysis
): boolean {
  if (analysis.isZero || analysis.decimalIndex <= 0n) {
    return true;
  }

  const safeLength = BigInt(MAX_SAFE_INTEGER_LENGTH);

  if (analysis.decimalIndex < safeLength) {
    return true;
  }

  if (analysis.decimalIndex > safeLength) {
    return false;
  }

  const integerDigits = takeIntegerDigits(analysis, MAX_SAFE_INTEGER_LENGTH);

  if (integerDigits < MAX_SAFE_INTEGER_STRING) {
    return true;
  }

  if (integerDigits > MAX_SAFE_INTEGER_STRING) {
    return false;
  }

  return !/[1-9]/.test(
    analysis.significantDigits.slice(MAX_SAFE_INTEGER_LENGTH)
  );
}

function takeIntegerDigits(
  analysis: DecimalMagnitudeAnalysis,
  count: number
): string {
  if (analysis.significantDigits.length >= count) {
    return analysis.significantDigits.slice(0, count);
  }

  return analysis.significantDigits.padEnd(count, "0");
}
