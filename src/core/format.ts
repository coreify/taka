import {
  applyNegativeStyle,
  combineCurrencyAndValue,
  coerceFiniteAmount,
  formatNumber,
  getCurrencyLabel,
  resolveCurrencyDisplay,
  resolveCurrencyPosition,
  resolveCurrencySpacing,
  resolveFractionDigits,
  resolveLocale
} from "./shared";
import type { TakaFormatOptions, TakaNumericInput } from "../types";

/** Format an amount that has already been coerced with {@link coerceFiniteAmount}. */
export function formatCoercedAmount(
  amount: number,
  options: TakaFormatOptions = {}
): string {
  if (amount === 0 && options.zeroFormat) {
    return options.zeroFormat;
  }

  const locale = resolveLocale(options.locale);
  const display = resolveCurrencyDisplay(options);
  const position = resolveCurrencyPosition(display, options.currencyPosition);
  const spaced = resolveCurrencySpacing(display, options.space);
  const fractionDigits = resolveFractionDigits(
    amount,
    options.decimals,
    options.trailingZeros
  );
  const useGrouping = options.useGrouping ?? true;
  const absoluteValue = Math.abs(amount);
  const currencyLabel = getCurrencyLabel(display, locale);
  const formattedNumber = formatNumber(
    absoluteValue,
    locale,
    fractionDigits,
    useGrouping
  );
  const formattedValue = combineCurrencyAndValue(
    currencyLabel,
    formattedNumber,
    position,
    spaced
  );

  return applyNegativeStyle(formattedValue, amount, options.negativeStyle);
}

export function formatTaka(
  value: TakaNumericInput,
  options: TakaFormatOptions = {}
): string {
  return formatCoercedAmount(coerceFiniteAmount(value, options), options);
}
