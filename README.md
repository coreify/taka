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
```

## Bengali vs English

```ts
import { formatTaka, toBanglaDigits, toEnglishDigits } from "@coreify/taka";

formatTaka(2499, { locale: "en-BD" });
// => "৳2,499"

formatTaka(2499, { locale: "bn-BD" });
// => "৳২,৪৯৯"

formatTaka(2499, { locale: "bn-BD", style: "name" });
// => "২,৪৯৯ টাকা"

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
```

## React Usage

React helpers are exported from the `./react` subpath so the core package stays framework-agnostic.

```tsx
import { TakaAmount, TakaSymbol, TakaText } from "@coreify/taka/react";

function PriceCard() {
  return (
    <div>
      <p>
        <TakaSymbol />
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

All React components are typed, SSR-safe, and render plain text output inside a `span`.

## API Reference

### Core

- `formatTaka(value, options?)`
- `formatTakaCompact(value, options?)`
- `parseTaka(input, options?)`
- `normalizeTakaInput(input, options?)`
- `isTakaString(input, options?)`
- `toBanglaDigits(input)`
- `toEnglishDigits(input)`
- `getTakaSymbol()`
- `getTakaCode()`
- `getTakaName(language?)`

### Constants

- `TAKA_SYMBOL`
- `TAKA_CODE`
- `TAKA_NAME_EN`
- `TAKA_NAME_BN`

### Main Types

- `TakaLocale`
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
