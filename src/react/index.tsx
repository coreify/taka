import type { ReactElement } from "react";
import { createElement, forwardRef } from "react";
import { TAKA_SYMBOL } from "../core/constants";
import { formatCoercedAmount } from "../core/format";
import { coerceFiniteAmount } from "../core/shared";
import type { TakaFormatOptions } from "../types";
import type {
  TakaAmountProps,
  TakaReactFormatOptionInput,
  TakaSymbolProps,
  TakaTextProps
} from "../types/react";

export type {
  TakaAmountProps,
  TakaSymbolProps,
  TakaTextProps
} from "../types/react";

export const TakaSymbol = forwardRef<HTMLSpanElement, TakaSymbolProps>(
  function TakaSymbol(
    { "aria-label": ariaLabelProp, srLabel, ...props },
    ref
  ): ReactElement {
    return createElement(
      "span",
      {
        ...props,
        ref,
        "aria-label": srLabel ?? ariaLabelProp ?? "Bangladeshi Taka"
      },
      TAKA_SYMBOL
    );
  }
);

TakaSymbol.displayName = "TakaSymbol";

export const TakaAmount = forwardRef<HTMLSpanElement, TakaAmountProps>(
  function TakaAmount(
    {
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
      allowScientificNotation,
      allowLooseCommaGrouping,
      "aria-label": ariaLabelProp,
      ...props
    },
    ref
  ): ReactElement {
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
      zeroFormat,
      allowScientificNotation,
      allowLooseCommaGrouping
    });
    const amount = coerceFiniteAmount(value, formatOptions);
    const formatted = formatCoercedAmount(amount, formatOptions);
    const ariaLabel =
      srLabel ??
      ariaLabelProp ??
      formatCoercedAmount(amount, {
        ...formatOptions,
        style: "name",
        currencyPosition: "after",
        space: true
      });

    return createElement(
      "span",
      { ...props, ref, "aria-label": ariaLabel },
      formatted
    );
  }
);

TakaAmount.displayName = "TakaAmount";

export const TakaText = forwardRef<HTMLSpanElement, TakaTextProps>(
  function TakaText(
    {
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
      allowScientificNotation,
      allowLooseCommaGrouping,
      "aria-label": ariaLabelProp,
      ...props
    },
    ref
  ): ReactElement {
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
      zeroFormat,
      allowScientificNotation,
      allowLooseCommaGrouping
    });
    const amount = coerceFiniteAmount(value, formatOptions);
    const formatted = formatCoercedAmount(amount, formatOptions);
    const ariaLabel =
      srLabel ??
      ariaLabelProp ??
      formatCoercedAmount(amount, {
        ...formatOptions,
        style: "name",
        currencyPosition: "after",
        space: true
      });

    return createElement(
      "span",
      { ...props, ref, "aria-label": ariaLabel },
      formatted
    );
  }
);

TakaText.displayName = "TakaText";

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

  if (options.allowScientificNotation !== undefined) {
    formatOptions.allowScientificNotation = options.allowScientificNotation;
  }

  if (options.allowLooseCommaGrouping !== undefined) {
    formatOptions.allowLooseCommaGrouping = options.allowLooseCommaGrouping;
  }

  return formatOptions;
}
