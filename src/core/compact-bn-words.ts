import { toBanglaDigits } from "./locale";

const HAZAR = 1_000;
const LAKH = 100_000;
const CRORE = 10_000_000;

/**
 * Bengali compact phrasing using কোটি / লাখ / হাজার (not decimal "১.২৫ লাখ" for million-scale amounts).
 * Example: 1,250,000 → "১২ লাখ ৫০ হাজার".
 */
export function formatBnLocalizedCompactAmount(absoluteValue: number): string {
  const n = Math.trunc(absoluteValue);

  if (n < 0) {
    throw new RangeError("Expected a non-negative amount.");
  }

  if (n < HAZAR) {
    return toBanglaDigits(String(n));
  }

  if (n < LAKH) {
    const hazar = Math.floor(n / HAZAR);
    const rest = n % HAZAR;

    if (rest === 0) {
      return `${toBanglaDigits(String(hazar))} হাজার`;
    }

    return `${toBanglaDigits(String(hazar))} হাজার ${toBanglaDigits(String(rest))}`;
  }

  if (n < CRORE) {
    const lakhs = Math.floor(n / LAKH);
    const rem = n % LAKH;
    const hazar = Math.floor(rem / HAZAR);
    const rest = rem % HAZAR;
    const parts: string[] = [];

    if (lakhs > 0) {
      parts.push(`${toBanglaDigits(String(lakhs))} লাখ`);
    }

    if (hazar > 0) {
      parts.push(`${toBanglaDigits(String(hazar))} হাজার`);
    }

    if (rest > 0) {
      parts.push(toBanglaDigits(String(rest)));
    }

    return parts.join(" ");
  }

  const crores = Math.floor(n / CRORE);
  const rem = n % CRORE;
  const parts: string[] = [`${toBanglaDigits(String(crores))} কোটি`];

  if (rem === 0) {
    return parts.join(" ");
  }

  const lakhs = Math.floor(rem / LAKH);
  const rem2 = rem % LAKH;
  const hazar = Math.floor(rem2 / HAZAR);
  const rest = rem2 % HAZAR;

  if (lakhs > 0) {
    parts.push(`${toBanglaDigits(String(lakhs))} লাখ`);
  }

  if (hazar > 0) {
    parts.push(`${toBanglaDigits(String(hazar))} হাজার`);
  }

  if (rest > 0) {
    parts.push(toBanglaDigits(String(rest)));
  }

  return parts.join(" ");
}
