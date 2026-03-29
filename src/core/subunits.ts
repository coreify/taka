/** Bangladeshi poisha per one taka (ISO 4217 minor units for BDT). */
export const TAKA_POISHA_PER_TAKA = 100;

export function toPoisha(majorUnits: number): number {
  if (!Number.isFinite(majorUnits)) {
    throw new TypeError("Expected a finite number.");
  }

  const poisha = Math.round(majorUnits * TAKA_POISHA_PER_TAKA);

  if (!Number.isSafeInteger(poisha)) {
    throw new RangeError("Poisha amount is outside the safe integer range.");
  }

  return poisha;
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
