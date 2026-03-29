import type { TakaCompactOptions, TakaNumericInput } from "../types";
import { formatCoercedAmount } from "./format";
import {
  applyNegativeStyle,
  combineCurrencyAndValue,
  coerceFiniteAmount,
  formatNumber,
  getCompactUnitLabel,
  getCompactUnits,
  getCurrencyLabel,
  resolveCurrencyDisplay,
  resolveCurrencyPosition,
  resolveCurrencySpacing,
  resolveFractionDigits,
  resolveLocale
} from "./shared";

export function formatTakaCompact(
  value: TakaNumericInput,
  options: TakaCompactOptions = {}
): string {
  const amount = coerceFiniteAmount(value, options);

  if (amount === 0 && options.zeroFormat) {
    return options.zeroFormat;
  }

  if (Math.abs(amount) < 1_000) {
    return formatCoercedAmount(amount, options);
  }

  const locale = resolveLocale(options.locale);
  const display = resolveCurrencyDisplay(options);
  const position = resolveCurrencyPosition(display, options.currencyPosition);
  const spaced = resolveCurrencySpacing(display, options.space);
  const compactStyle = options.compactStyle ?? "south-asian";
  const compactLabelStyle = options.compactLabelStyle ?? "short";
  const absoluteValue = Math.abs(amount);
  const unit = getCompactUnits(compactStyle).find(
    (candidate) => absoluteValue >= candidate.threshold
  );

  if (!unit) {
    return formatCoercedAmount(amount, options);
  }

  const scaledValue = absoluteValue / unit.threshold;
  const fractionDigits = resolveFractionDigits(
    scaledValue,
    options.decimals,
    options.trailingZeros,
    2
  );
  const scaledDisplayValue = truncateCompactValue(
    scaledValue,
    fractionDigits.maximumFractionDigits
  );
  const currencyLabel = getCurrencyLabel(display, locale);
  const compactLabel = getCompactUnitLabel(unit, locale, compactLabelStyle);
  const compactSeparator = compactLabelStyle === "localized" ? " " : "";
  const formattedNumber = `${formatNumber(
    scaledDisplayValue,
    locale,
    fractionDigits,
    false
  )}${compactSeparator}${compactLabel}`;
  const formattedValue = combineCurrencyAndValue(
    currencyLabel,
    formattedNumber,
    position,
    spaced
  );

  return applyNegativeStyle(formattedValue, amount, options.negativeStyle);
}

function truncateCompactValue(value: number, fractionDigits: number): number {
  if (fractionDigits <= 0) {
    return Math.trunc(value);
  }

  const factor = 10 ** fractionDigits;
  return Math.trunc(value * factor) / factor;
}
