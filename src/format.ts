import {
  applyNegativeStyle,
  assertFiniteAmount,
  combineCurrencyAndValue,
  formatNumber,
  getCurrencyLabel,
  resolveCurrencyDisplay,
  resolveCurrencyPosition,
  resolveCurrencySpacing,
  resolveFractionDigits,
  resolveLocale
} from "./shared";
import type { TakaFormatOptions } from "./types";

export function formatTaka(
  value: number,
  options: TakaFormatOptions = {}
): string {
  assertFiniteAmount(value);

  if (value === 0 && options.zeroFormat) {
    return options.zeroFormat;
  }

  const locale = resolveLocale(options.locale);
  const display = resolveCurrencyDisplay(options);
  const position = resolveCurrencyPosition(display, options.currencyPosition);
  const spaced = resolveCurrencySpacing(display, options.space);
  const fractionDigits = resolveFractionDigits(
    value,
    options.decimals,
    options.trailingZeros
  );
  const useGrouping = options.useGrouping ?? true;
  const absoluteValue = Math.abs(value);
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

  return applyNegativeStyle(formattedValue, value, options.negativeStyle);
}
