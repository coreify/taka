export type TakaLocale = "en-BD" | "bn-BD";
export type TakaLanguage = "en" | "bn";
export type TakaCurrencyDisplay = "symbol" | "code" | "name";
export type TakaCurrencyPosition = "before" | "after";
export type TakaCompactStyle = "south-asian" | "international";
export type TakaCompactLabelStyle = "short" | "localized";
export type TakaNegativeStyle = "sign" | "accounting";
/** Accepts primitives, `bigint` within safe range, and boxed numbers from some APIs. */
export type TakaNumericInput =
  | number
  | string
  | bigint
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types -- `Number` instances
  | Number;

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
  /**
   * When `true`, plain numeric **strings** may use scientific notation (e.g. `"1e6"`).
   * Disabled by default to avoid accidental spreadsheet paste surprises.
   *
   * **Parsing:** `parseTaka` still requires a Taka currency token in the string for
   * scientific forms (e.g. `"1e3"` alone is rejected; `"৳1e3"` is allowed with this flag).
   * **Formatting:** `formatTaka` has no token requirement — it only coerces the numeric string.
   */
  allowScientificNotation?: boolean;
  /**
   * When `true`, comma groups that are neither US nor Indian are collapsed by removing
   * **all** commas if the result is a safe plain number (e.g. `"1,23,45"` → `12345`).
   * Can mis-read typo’d input; use only when you accept that trade-off.
   */
  allowLooseCommaGrouping?: boolean;
}

export interface TakaCompactOptions extends Omit<
  TakaFormatOptions,
  "useGrouping"
> {
  /**
   * South Asian (**K / L / Cr**) vs international (**K / M / B**) thresholds. Ignored when
   * **`locale` is `bn-BD`** and **`compactLabelStyle` is `"localized"`** (Bengali কোটি/লাখ/হাজার words are used instead).
   */
  compactStyle?: TakaCompactStyle;
  /**
   * - **`short`**: suffix labels (e.g. `1.25L`, `1.5M`).
   * - **`localized`**: English uses words (`thousand`, `million`, …). For **`locale: "bn-BD"`**, uses
   *   **কোটি / লাখ / হাজার** phrases (e.g. `১২ লাখ ৫০ হাজার` for 1,250,000), not decimal `১.২৫ লাখ` or
   *   **মিলিয়ন** / **বিলিয়ন** alone.
   */
  compactLabelStyle?: TakaCompactLabelStyle;
}

export interface ParseTakaOptions {
  allowParentheses?: boolean;
  /**
   * When `true`, allows scientific notation after normalization (e.g. `৳1e6`, `BDT 1e3`).
   * Plain numeric strings such as `"1e3"` are still rejected — a Taka currency token must be present.
   */
  allowScientificNotation?: boolean;
  /** See `allowLooseCommaGrouping` on `TakaFormatOptions`. */
  allowLooseCommaGrouping?: boolean;
}

export interface FractionDigits {
  minimumFractionDigits: number;
  maximumFractionDigits: number;
}

export interface CompactUnit {
  threshold: number;
  shortLabel: string;
  localizedEn: string;
  localizedBn: string;
}
