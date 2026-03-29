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
