import { formatTaka } from "./format";
import {
  applyNegativeStyle,
  assertFiniteAmount,
  combineCurrencyAndValue,
  formatNumber,
  getCompactUnits,
  getCurrencyLabel,
  resolveCurrencyDisplay,
  resolveCurrencyPosition,
  resolveCurrencySpacing,
  resolveFractionDigits,
  resolveLocale
} from "./shared";
import type { TakaCompactOptions } from "./types";

export function formatTakaCompact(
  value: number,
  options: TakaCompactOptions = {}
): string {
  assertFiniteAmount(value);

  if (Math.abs(value) < 1_000) {
    return formatTaka(value, options);
  }

  if (value === 0 && options.zeroFormat) {
    return options.zeroFormat;
  }

  const locale = resolveLocale(options.locale);
  const display = resolveCurrencyDisplay(options);
  const position = resolveCurrencyPosition(display, options.currencyPosition);
  const spaced = resolveCurrencySpacing(display, options.space);
  const compactStyle = options.compactStyle ?? "south-asian";
  const absoluteValue = Math.abs(value);
  const unit = getCompactUnits(compactStyle).find(
    (candidate) => absoluteValue >= candidate.threshold
  );

  if (!unit) {
    return formatTaka(value, options);
  }

  const scaledValue = absoluteValue / unit.threshold;
  const fractionDigits = resolveFractionDigits(
    scaledValue,
    options.decimals,
    options.trailingZeros,
    2
  );
  const currencyLabel = getCurrencyLabel(display, locale);
  const formattedNumber = `${formatNumber(scaledValue, locale, fractionDigits, false)}${unit.suffix}`;
  const formattedValue = combineCurrencyAndValue(
    currencyLabel,
    formattedNumber,
    position,
    spaced
  );

  return applyNegativeStyle(formattedValue, value, options.negativeStyle);
}
