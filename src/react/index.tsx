import type { ReactElement } from "react";
import { createElement } from "react";
import { TAKA_SYMBOL } from "../core/constants";
import { formatTaka } from "../core/format";
import type {
  TakaAmountProps,
  TakaFormatOptions,
  TakaLocale,
  TakaReactFormatOptionInput,
  TakaSymbolProps,
  TakaTextProps
} from "../types";

export type { TakaAmountProps, TakaSymbolProps, TakaTextProps } from "../types";

export function TakaSymbol({
  srLabel = "Bangladeshi Taka",
  ...props
}: TakaSymbolProps): ReactElement {
  return createElement(
    "span",
    { "aria-label": srLabel, ...props },
    TAKA_SYMBOL
  );
}

export function TakaAmount({
  value,
  srLabel,
  variant,
  currency,
  locale,
  decimals,
  trailingZeros,
  useGrouping,
  currencyPosition,
  space,
  negativeStyle,
  zeroFormat,
  ...props
}: TakaAmountProps): ReactElement {
  const formatOptions = buildFormatOptions({
    locale,
    currency,
    variant,
    decimals,
    trailingZeros,
    useGrouping,
    currencyPosition,
    space,
    negativeStyle,
    zeroFormat
  });
  const ariaLabel = srLabel ?? getAccessibleLabel(value, locale);
  const formatted = formatTaka(value, formatOptions);

  return createElement(
    "span",
    { "aria-label": ariaLabel, ...props },
    formatted
  );
}

export function TakaText({
  value,
  srLabel,
  variant,
  currency,
  locale,
  decimals,
  trailingZeros,
  useGrouping,
  currencyPosition,
  space,
  negativeStyle,
  zeroFormat,
  ...props
}: TakaTextProps): ReactElement {
  const resolvedVariant = variant ?? currency ?? "name";
  const formatOptions = buildFormatOptions({
    locale,
    variant: resolvedVariant,
    decimals,
    trailingZeros,
    useGrouping,
    currencyPosition,
    space,
    negativeStyle,
    zeroFormat
  });
  const ariaLabel = srLabel ?? getAccessibleLabel(value, locale);
  const formatted = formatTaka(value, formatOptions);

  return createElement(
    "span",
    { "aria-label": ariaLabel, ...props },
    formatted
  );
}

function getAccessibleLabel(
  value: number,
  locale: TakaLocale | undefined
): string {
  const formatOptions = buildFormatOptions({
    style: "name",
    currencyPosition: "after",
    space: true
  });

  if (locale) {
    formatOptions.locale = locale;
  }

  return formatTaka(value, formatOptions);
}

function buildFormatOptions(
  options: TakaReactFormatOptionInput
): TakaFormatOptions {
  const formatOptions: TakaFormatOptions = {};

  if (options.locale) {
    formatOptions.locale = options.locale;
  }

  if (options.currency) {
    formatOptions.currency = options.currency;
  }

  const resolvedStyle = options.variant ?? options.style;

  if (resolvedStyle) {
    formatOptions.style = resolvedStyle;
  }

  if (options.decimals !== undefined) {
    formatOptions.decimals = options.decimals;
  }

  if (options.trailingZeros !== undefined) {
    formatOptions.trailingZeros = options.trailingZeros;
  }

  if (options.useGrouping !== undefined) {
    formatOptions.useGrouping = options.useGrouping;
  }

  if (options.currencyPosition) {
    formatOptions.currencyPosition = options.currencyPosition;
  }

  if (options.space !== undefined) {
    formatOptions.space = options.space;
  }

  if (options.negativeStyle) {
    formatOptions.negativeStyle = options.negativeStyle;
  }

  if (options.zeroFormat) {
    formatOptions.zeroFormat = options.zeroFormat;
  }

  return formatOptions;
}
