import type { HTMLAttributes, ReactElement } from "react";
import { createElement } from "react";
import { TAKA_SYMBOL } from "./constants";
import { formatTaka } from "./format";
import type {
  TakaCurrencyDisplay,
  TakaFormatOptions,
  TakaLocale
} from "./types";

export interface TakaSymbolProps extends HTMLAttributes<HTMLSpanElement> {
  srLabel?: string;
}

type SpanProps = HTMLAttributes<HTMLSpanElement>;

type TakaFormatOptionInput = {
  locale?: TakaLocale | undefined;
  currency?: TakaCurrencyDisplay | undefined;
  style?: TakaCurrencyDisplay | undefined;
  variant?: TakaCurrencyDisplay | undefined;
  decimals?: number | undefined;
  trailingZeros?: boolean | undefined;
  useGrouping?: boolean | undefined;
  currencyPosition?: TakaFormatOptions["currencyPosition"] | undefined;
  space?: boolean | undefined;
  negativeStyle?: TakaFormatOptions["negativeStyle"] | undefined;
  zeroFormat?: string | undefined;
};

type VariantOptions = Omit<TakaFormatOptions, "style"> & {
  variant?: TakaCurrencyDisplay;
};

export interface TakaAmountProps extends SpanProps, VariantOptions {
  value: number;
  srLabel?: string;
}

export interface TakaTextProps extends SpanProps, VariantOptions {
  value: number;
  srLabel?: string;
}

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

function buildFormatOptions(options: TakaFormatOptionInput): TakaFormatOptions {
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
