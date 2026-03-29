# `@coreify/taka`

A modern toolkit for formatting and rendering Bangladeshi Taka (BDT) in JavaScript, TypeScript, and React.

Built for Bangladesh-first products that need predictable BDT formatting, localized digits, compact amounts, poisha helpers, and small React components without a heavyweight i18n stack.

## Why this package

- Correct **৳** symbol, **BDT** code, and **Taka** / **টাকা** display modes
- **en-BD** and **bn-BD** via `Intl.NumberFormat`
- **Compact** notation (South Asian **K / L / Cr** vs international **K / M / B**)
- **Parse** user-facing currency strings (symbol, code, name; glued tokens; optional scientific notation with a currency token)
- **Poisha** conversion (100 poisha = 1 taka)
- **`bigint`** and boxed **`Number`** where noted
- **SSR-friendly** React helpers on a separate entry (`@coreify/taka/react`)

## Installation

```bash
npm install @coreify/taka
```

Requires **Node.js 18+** (uses `Intl.NumberFormat`).

For React:

```bash
npm install @coreify/taka react
```

## Quick start

```ts
import { formatTaka, formatTakaCompact, parseTaka } from "@coreify/taka";

formatTaka(1250);
// => "৳1,250"

formatTaka(1250, { decimals: 2, trailingZeros: true });
// => "৳1,250.00"

formatTakaCompact(125000);
// => "৳1.25L"

parseTaka("৳1,250.50");
// => 1250.5

parseTaka("not money");
// => null
```

## Formatting

`formatTaka` accepts a finite **`number`**, numeric **`string`**, **`bigint`** in the safe integer range, or boxed **`Number`**.

```ts
import { formatTaka } from "@coreify/taka";

formatTaka(2499);
// => "৳2,499"

formatTaka(2499, { currency: "code" });
// => "BDT 2,499"

formatTaka(2499, { style: "name" });
// => "2,499 Taka"

formatTaka(2499, { currencyPosition: "after", space: true });
// => "2,499 ৳"

formatTaka(-2499, { negativeStyle: "accounting" });
// => "(৳2,499)"

formatTaka(0, { zeroFormat: "Free" });
// => "Free"

formatTaka(1234567, { useGrouping: false });
// => "৳1234567"
```

- **`useGrouping`** defaults to **`true`**.
- **`zeroFormat`**: when the coerced amount is exactly **0** (including **-0**), that string is returned instead of a normal format.
- **String inputs**: US / Indian / European-style separators are normalized (see tests for edge cases). **Hex** strings (including fullwidth lookalikes such as `０x10`) throw **`TypeError`**. Out-of-safe-range values throw **`RangeError`**.
- **`allowScientificNotation`**: when `true`, strings like `"1e3"` are accepted for formatting (no currency token required).
- **`allowLooseCommaGrouping`**: when `true`, ambiguous comma patterns may be collapsed if the result is a safe plain number (use with care).

### Bengali locale

```ts
import { formatTaka, getTakaName, toBanglaDigits, toEnglishDigits } from "@coreify/taka";

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

getTakaName("bn-IN"); // any "bn-*" subtag → Bengali name
// => "টাকা"

toBanglaDigits("1250.50");
// => "১২৫০.৫০"

toEnglishDigits("১,২৫০.৫০");
// => "1,250.50"
```

## Compact formatting

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

Values with **`Math.abs(amount) < 1000`** use full **`formatTaka`** output. Options align with **`TakaFormatOptions`** where applicable (no `useGrouping` on the compact number; grouping is off for the scaled value).

## Poisha (subunits)

ISO 4217 minor units for BDT: **100 poisha = 1 taka**.

```ts
import {
  formatTaka,
  fromPoisha,
  TAKA_POISHA_PER_TAKA,
  toPoisha
} from "@coreify/taka";

TAKA_POISHA_PER_TAKA;
// => 100

toPoisha(12.5);
// => 1250 (integer poisha)

fromPoisha(1250);
// => 12.5

formatTaka(fromPoisha(toPoisha(12.5)));
// => "৳12.5" (default fraction rules for non-integers)

// Unsafe integer poisha throws RangeError
```

## Parsing

```ts
import { isTakaString, normalizeTakaInput, parseTaka } from "@coreify/taka";

parseTaka("৳1,250");
// => 1250

parseTaka("BDT 1,250.50");
// => 1250.5

parseTaka("BDT100");
// => 100 (glued code)

parseTaka("১,২৫০ টাকা");
// => 1250

normalizeTakaInput("৳ ১,২৫০.৫০");
// => "1250.50"

isTakaString("৳1,250");
// => true

parseTaka("(৳1,250)");
// => -1250

parseTaka("(1,250)", { allowParentheses: false });
// => null
```

**Rules:**

- Returns **`null`** for unparseable input; throws **`TypeError`** if the string contains a **hex literal** (same rule as `formatTaka` for string coercion).
- **`allowScientificNotation`**: when `true`, scientific forms are allowed **only if a Taka token is present** (e.g. `"৳1e3"`, `"BDT1e3"`). Bare `"1e3"` is still rejected.
- **`allowLooseCommaGrouping`**: same idea as formatting; opt-in for ambiguous comma groupings.
- More than one **৳** (U+09F3) in the input is rejected (`null`).
- Safe range: amounts beyond **`Number.MAX_SAFE_INTEGER`** round-tripping rules return **`null`** (no silent rounding).

**`normalizeTakaInput`**: strips currency markers and normalizes grouping for further processing; does not throw on hex (use `parseTaka` / `formatTaka` for strict hex rejection).

## Advanced: `formatCoercedAmount`

If you already coerced a value with the same options object shape (e.g. after `parseTaka`), format the **`number`** without parsing again:

```ts
import { formatCoercedAmount, formatTaka } from "@coreify/taka";

const amount = 1250;
formatCoercedAmount(amount, { locale: "bn-BD", style: "name" });
// same result as formatTaka(amount, { ... }) for that amount
```

`formatTaka` is implemented as coerce-then-`formatCoercedAmount`.

## React

Helpers live under **`@coreify/taka/react`** so the core bundle stays React-free. The published **`dist/react.js`** / **`dist/react.cjs`** files are built so a top-level **`"use client"`** directive remains present after minification (Next.js App Router / RSC client boundaries).

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

- **`TakaSymbol`**, **`TakaAmount`**, **`TakaText`**: **`forwardRef`** to the root **`span`**. DOM props match **`React.ComponentPropsWithoutRef<"span">`**, except **`children`** is omitted (content comes from formatting or the symbol).
- **`TakaSymbol`**: renders **৳**. Default **`aria-label`**: `"Bangladeshi Taka"`; override with **`srLabel`** or **`aria-label`**.
- **`TakaAmount`**: default display aligns with **`formatTaka`** (symbol style). Accepts **`variant`** / **`currency`** / **`style`** plus **`decimals`**, **`trailingZeros`**, **`useGrouping`**, **`currencyPosition`**, **`space`**, **`negativeStyle`**, **`zeroFormat`**, **`allowScientificNotation`**, **`allowLooseCommaGrouping`**, **`locale`**. Formatting options are **not** forwarded as DOM attributes.
- **`TakaText`**: same props as **`TakaAmount`**, defaulting to **name** style (e.g. `"1,250 Taka"` / Bengali equivalent with **`locale`**). Use **`variant="symbol"`** for symbol output.
- **`srLabel`** wins over a spread **`aria-label`**. If neither is set, **`TakaAmount`** / **`TakaText`** derive an accessible name from a **name**-style format of the same numeric options.

## API reference

### Core

| Export | Description |
|--------|-------------|
| **`formatTaka(value, options?)`** | Format BDT per **`TakaFormatOptions`**. |
| **`formatCoercedAmount(amount, options?)`** | Format an already-coerced **`number`**. |
| **`formatTakaCompact(value, options?)`** | Compact form; **`TakaCompactOptions`**. |
| **`parseTaka(input, options?)`** | **`number \| null`**; **`ParseTakaOptions`**. |
| **`normalizeTakaInput(input, options?)`** | Stripped/normalized numeric string. |
| **`isTakaString(input, options?)`** | **`boolean`**; **`false`** for hex or multiple **৳**. |
| **`toBanglaDigits`** / **`toEnglishDigits`** | Digit scripts. |
| **`toPoisha`** / **`fromPoisha`** | Poisha conversion; throws if non-finite or unsafe integer poisha. |
| **`TAKA_POISHA_PER_TAKA`** | `100` |
| **`getTakaSymbol`** / **`getTakaCode`** / **`getTakaName`** | Constants helpers; name resolves **`bn`**, **`bn-BD`**, **`bn-*`**, **`en`**, **`en-BD`**, **`en-*`**; otherwise English **Taka**. |

### Constants

**`TAKA_SYMBOL`** (`৳`), **`TAKA_CODE`** (`BDT`), **`TAKA_NAME_EN`**, **`TAKA_NAME_BN`**.

### Types

**`TakaLocale`**, **`TakaLanguage`**, **`TakaCurrencyDisplay`**, **`TakaCurrencyPosition`**, **`TakaCompactStyle`**, **`TakaNegativeStyle`**, **`TakaNumericInput`**, **`TakaFormatOptions`**, **`TakaCompactOptions`**, **`ParseTakaOptions`**.

## TypeScript

Strict TypeScript, declaration files for **`@coreify/taka`** and **`@coreify/taka/react`**. Core types do not import React, so non-React apps need not add **`react`** for the main entry.

## License

MIT
