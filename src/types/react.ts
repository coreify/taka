import type { ComponentPropsWithoutRef } from "react";
import type {
  TakaCurrencyDisplay,
  TakaFormatOptions,
  TakaLocale,
  TakaNumericInput
} from "./index";

export type TakaReactFormatOptionInput = {
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
  allowScientificNotation?: TakaFormatOptions["allowScientificNotation"];
  allowLooseCommaGrouping?: TakaFormatOptions["allowLooseCommaGrouping"];
};

export type TakaVariantOptions = Omit<TakaFormatOptions, "style"> & {
  variant?: TakaCurrencyDisplay;
};

export type TakaReactSpanProps = ComponentPropsWithoutRef<"span">;

export interface TakaSymbolProps extends Omit<TakaReactSpanProps, "children"> {
  srLabel?: string;
}

export interface TakaAmountProps
  extends Omit<TakaReactSpanProps, "children">, TakaVariantOptions {
  value: TakaNumericInput;
  srLabel?: string;
}

export interface TakaTextProps
  extends Omit<TakaReactSpanProps, "children">, TakaVariantOptions {
  value: TakaNumericInput;
  srLabel?: string;
}
