# `@coreify/taka`

A modern toolkit for formatting and rendering Bangladeshi Taka in JavaScript, TypeScript, and React apps.

`@coreify/taka` is built for Bangladesh-first product teams that need predictable BDT formatting, localized digits, compact currency output, and small React-friendly helpers without dragging in a heavyweight i18n stack.

## Why This Package Exists

Most currency tooling is generic. Bangladeshi products often need a narrower set of features:

- Correct Taka symbol and code handling
- Bengali and English display modes
- Compact values for dashboards and commerce UIs
- Parsing from user-facing currency strings
- SSR-safe React rendering

This package focuses on those cases directly.

## Installation

```bash
npm install @coreify/taka
```

Requires **Node.js 18+** (the runtime uses `Intl.NumberFormat`).

If you want the React helpers as well:

```bash
npm install @coreify/taka react
```

## Quick Start

```ts
import { formatTaka, formatTakaCompact, parseTaka } from "@coreify/taka";

formatTaka(1250);
// => "৳1,250"

formatTaka(1250, { decimals: 2, trailingZeros: true });
// => "৳1,250.00"

formatTakaCompact(125000);
// => "৳1.25L"

parseTaka("৳ ১,২৫০.৫০");
// => 1250.5

parseTaka("not money");
// => null
```

## Formatting Examples

```ts
import { formatTaka } from "@coreify/taka";

formatTaka(2499);
// => "৳2,499"

formatTaka(2499, { currency: "code" });
// => "BDT 2,499"

formatTaka(2499, { style: "name" });
// => "2,499 Taka"

formatTaka(2499, {
  currencyPosition: "after",
  space: true
});
// => "2,499 ৳"

formatTaka(-2499, { negativeStyle: "accounting" });
// => "(৳2,499)"

formatTaka(0, { zeroFormat: "Free" });
// => "Free"

formatTaka(1234567, { useGrouping: false });
// => "৳1234567"
```

`useGrouping` defaults to `true`. Use `zeroFormat` to replace the normal output when the amount is exactly zero.

## Bengali vs English

```ts
import { formatTaka, toBanglaDigits, toEnglishDigits } from "@coreify/taka";

formatTaka(2499, { locale: "en-BD" });
// => "৳2,499"

formatTaka(2499, { locale: "bn-BD" });
// => "৳২,৪৯৯"

formatTaka(2499, { locale: "bn-BD", style: "name" });
// => "২,৪৯৯ টাকা"

getTakaName("bn");
// => "টাকা"

getTakaName("bn-BD");
// => "টাকা"

toBanglaDigits("1250.50");
// => "১২৫০.৫০"

toEnglishDigits("১,২৫০.৫০");
// => "1,250.50"
```

## Compact Formatting

```ts
import { formatTakaCompact } from "@coreify/taka";

formatTakaCompact(1200);
// => "৳1.2K"

formatTakaCompact(125000);
// => "৳1.25L"

formatTakaCompact(10000000);
// => "৳1Cr"

formatTakaCompact(1500000, { compactStyle: "international" });
// => "৳1.5M"

formatTakaCompact(125000, { locale: "bn-BD" });
// => "৳১.২৫L"
```

## Parsing Examples

```ts
import { isTakaString, normalizeTakaInput, parseTaka } from "@coreify/taka";

parseTaka("৳1,250");
// => 1250

parseTaka("BDT 1,250.50");
// => 1250.5

parseTaka("১,২৫০ টাকা");
// => 1250

normalizeTakaInput("৳ ১,২৫০.৫০");
// => "1250.50"

isTakaString("৳1,250");
// => true

parseTaka("(৳1,250)");
// => -1250

parseTaka("(1,250)", { allowParentheses: false });
// => null (parentheses are not unfolded, so the value is not a plain number string)
```

`parseTaka` returns `null` when the string cannot be parsed as a finite amount. By default, a value wrapped in parentheses is treated as negative; set `allowParentheses: false` to disable that.

## React Usage

React helpers are exported from the `./react` subpath so the core package stays framework-agnostic.

```tsx
import { TakaAmount, TakaSymbol, TakaText } from "@coreify/taka/react";

function PriceCard() {
  return (
    <div>
      <p>
        <TakaSymbol srLabel="Taka" />
      </p>
      <p>
        <TakaAmount value={1250} />
      </p>
      <p>
        <TakaText value={1250} locale="bn-BD" />
      </p>
    </div>
  );
}
```

- **`TakaSymbol`**: Renders `৳`. Use `srLabel` to override the default `aria-label` (`"Bangladeshi Taka"`).
- **`TakaAmount`**: Uses the symbol display by default (same defaults as `formatTaka`). Pass `variant` or `style` / `currency` for `code` or `name`, mirroring core options (`decimals`, `trailingZeros`, `useGrouping`, `currencyPosition`, `space`, `negativeStyle`, `zeroFormat`, …).
- **`TakaText`**: Same props as `TakaAmount`, but defaults to **name** style (e.g. `1,250 Taka` / `১,২৫০ টাকা` with locale). Override with `variant="symbol"` if you need the symbol.

`TakaAmount` and `TakaText` use a sensible `aria-label` derived from the formatted **name** style unless you pass `srLabel`.

All React components are typed, SSR-safe, and render plain text output inside a `span`.

## API Reference

### Core

- `formatTaka(value, options?)` — options include `locale`, `currency` / `style`, `decimals`, `trailingZeros`, `useGrouping`, `currencyPosition`, `space`, `negativeStyle`, `zeroFormat`
- `formatTakaCompact(value, options?)` — same as format options plus `compactStyle` (`"south-asian"` \| `"international"`); values below 1,000 use full `formatTaka` output
- `parseTaka(input, options?)` — returns `number \| null`
- `normalizeTakaInput(input, options?)` — strips currency tokens and grouping; options: `allowParentheses` (default `true`)
- `isTakaString(input, options?)`
- `toBanglaDigits(input)`
- `toEnglishDigits(input)`
- `getTakaSymbol()`
- `getTakaCode()`
- `getTakaName(languageOrLocale?)` — `"en"` \| `"bn"` or `TakaLocale`; Bengali name is used when the argument starts with `"bn"`

### Constants

- `TAKA_SYMBOL`
- `TAKA_CODE`
- `TAKA_NAME_EN`
- `TAKA_NAME_BN`

### Main Types

- `TakaLocale`
- `TakaLanguage`
- `TakaCurrencyDisplay`
- `TakaCurrencyPosition`
- `TakaCompactStyle`
- `TakaNegativeStyle`
- `TakaFormatOptions`
- `TakaCompactOptions`
- `ParseTakaOptions`

## TypeScript Support

The package is authored in strict TypeScript, ships declaration files for both the main entry and the React subpath, and exposes a small, IntelliSense-friendly API surface.

## License

MIT
