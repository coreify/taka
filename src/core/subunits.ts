/** Bangladeshi poisha per one taka (ISO 4217 minor units for BDT). */
export const TAKA_POISHA_PER_TAKA = 100;
const MAX_SAFE_POISHA = BigInt(Number.MAX_SAFE_INTEGER);
const POISHA_SCALE = 2;

export function toPoisha(majorUnits: number): number {
  if (!Number.isFinite(majorUnits)) {
    throw new TypeError("Expected a finite number.");
  }

  const poisha = roundMajorUnitsToPoisha(majorUnits);

  if (poisha > MAX_SAFE_POISHA || poisha < -MAX_SAFE_POISHA) {
    throw new RangeError("Poisha amount is outside the safe integer range.");
  }

  return Number(poisha);
}

export function fromPoisha(minorUnits: number): number {
  if (!Number.isFinite(minorUnits)) {
    throw new TypeError("Expected a finite number.");
  }

  if (!Number.isInteger(minorUnits)) {
    throw new RangeError("Expected an integer poisha amount.");
  }

  if (!Number.isSafeInteger(minorUnits)) {
    throw new RangeError("Poisha amount is outside the safe integer range.");
  }

  return minorUnits / TAKA_POISHA_PER_TAKA;
}

function roundMajorUnitsToPoisha(majorUnits: number): bigint {
  const negative = majorUnits < 0 || Object.is(majorUnits, -0);
  const decimalString = expandFiniteNumberString(
    Math.abs(majorUnits).toString()
  );
  const [integerPart = "0", fractionPart = ""] = decimalString.split(".");
  const leadingFractionDigits = fractionPart
    .padEnd(POISHA_SCALE, "0")
    .slice(0, POISHA_SCALE);
  const integerDigits =
    `${integerPart}${leadingFractionDigits}`.replace(/^0+(?=\d)/, "") || "0";
  const roundingDigit = fractionPart[POISHA_SCALE] ?? "0";
  const trailingDigits = fractionPart.slice(POISHA_SCALE + 1);
  let rounded = BigInt(integerDigits);

  if (shouldRoundMagnitudeUp(roundingDigit, trailingDigits, negative)) {
    rounded += 1n;
  }

  return negative ? -rounded : rounded;
}

function shouldRoundMagnitudeUp(
  roundingDigit: string,
  trailingDigits: string,
  negative: boolean
): boolean {
  if (roundingDigit > "5") {
    return true;
  }

  if (roundingDigit < "5") {
    return false;
  }

  if (/[1-9]/.test(trailingDigits)) {
    return true;
  }

  return !negative;
}

function expandFiniteNumberString(value: string): string {
  if (!/[eE]/.test(value)) {
    return value;
  }

  const [coefficient = "0", exponentText = "0"] = value.split(/[eE]/, 2);
  const exponent = Number(exponentText);
  const [integerPart = "0", fractionPart = ""] = coefficient.split(".");
  const digits = `${integerPart}${fractionPart}`;
  const decimalIndex = integerPart.length + exponent;

  if (decimalIndex <= 0) {
    return `0.${"0".repeat(-decimalIndex)}${digits}`;
  }

  if (decimalIndex >= digits.length) {
    return digits.padEnd(decimalIndex, "0");
  }

  return `${digits.slice(0, decimalIndex)}.${digits.slice(decimalIndex)}`;
}
