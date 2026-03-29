import type { HTMLAttributes } from "react";

export type TakaLocale = "en-BD" | "bn-BD";
export type TakaLanguage = "en" | "bn";
export type TakaCurrencyDisplay = "symbol" | "code" | "name";
export type TakaCurrencyPosition = "before" | "after";
export type TakaCompactStyle = "south-asian" | "international";
export type TakaNegativeStyle = "sign" | "accounting";

export interface TakaFormatOptions {
  locale?: TakaLocale;
  currency?: TakaCurrencyDisplay;
  style?: TakaCurrencyDisplay;
  decimals?: number;
  trailingZeros?: boolean;
  useGrouping?: boolean;
  currencyPosition?: TakaCurrencyPosition;
  space?: boolean;
  negativeStyle?: TakaNegativeStyle;
  zeroFormat?: string;
}

export interface TakaCompactOptions extends Omit<
  TakaFormatOptions,
  "useGrouping"
> {
  compactStyle?: TakaCompactStyle;
}

export interface ParseTakaOptions {
  allowParentheses?: boolean;
}

export interface FractionDigits {
  minimumFractionDigits: number;
  maximumFractionDigits: number;
}

export interface CompactUnit {
  threshold: number;
  suffix: string;
}

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
};

export type TakaVariantOptions = Omit<TakaFormatOptions, "style"> & {
  variant?: TakaCurrencyDisplay;
};

export type TakaReactSpanProps = HTMLAttributes<HTMLSpanElement>;

export interface TakaSymbolProps extends TakaReactSpanProps {
  srLabel?: string;
}

export interface TakaAmountProps
  extends TakaReactSpanProps, TakaVariantOptions {
  value: number;
  srLabel?: string;
}

export interface TakaTextProps extends TakaReactSpanProps, TakaVariantOptions {
  value: number;
  srLabel?: string;
}
