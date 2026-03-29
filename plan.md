# Build `@coreify/taka`

Create a production-ready npm package named **`@coreify/taka`**.

## Goal

Build a lightweight, modern developer toolkit for working with **Bangladeshi Taka (৳ / BDT)** in web applications.

This package should **not** be a clone of a currency font package. Instead, it should focus on **formatting, display, symbol utilities, React-friendly rendering, locale-aware output, and developer experience** for Bangladeshi currency.

The package should feel like a polished open-source utility that developers can use in:

- JavaScript / TypeScript projects
- React / Next.js apps
- Node.js backend rendering
- E-commerce apps
- dashboards
- accounting UIs
- invoices
- financial summaries
- Bangla and English interfaces

---

## Package Name

- **Package:** `@coreify/taka`

---

## Core Product Vision

`@coreify/taka` should be the go-to package for:

- formatting Bangladeshi Taka values
- rendering `৳` correctly and consistently
- switching between **Bangla** and **English** presentation
- outputting **BDT**, **৳**, localized digits, and readable money strings
- providing clean utilities and optional React components

The package should solve practical UI needs such as:

- `৳1,250`
- `৳ 1,250.00`
- `১,২৫০ টাকা`
- `BDT 1,250`
- compact forms like `৳1.2K`, `৳3.4L`, `৳2.1Cr`
- accessible output for screen readers
- consistent currency spacing and formatting rules

---

## What to Build

Design the package as a clean monorepo or a well-structured single package with clear modules.

Possible structure:

```txt
packages/
  taka/
    src/
      index.ts
      constants.ts
      format.ts
      parse.ts
      symbol.ts
      locale.ts
      compact.ts
      react.tsx
      types.ts
    tests/
    README.md
```

Or if not monorepo, a single package structure is fine as long as it is clean and scalable.

---

## Main Features

### 1. Currency Formatting

Provide utilities to format numeric values as Bangladeshi Taka.

Examples:

- `formatTaka(1250)` → `৳1,250`
- `formatTaka(1250, { decimals: 2 })` → `৳1,250.00`
- `formatTaka(1250, { currency: "code" })` → `BDT 1,250`
- `formatTaka(1250, { locale: "bn-BD" })` → `৳১,২৫০`
- `formatTaka(1250, { style: "name", locale: "bn-BD" })` → `১,২৫০ টাকা`

Support:

- `en-BD`
- `bn-BD`

Allow configuration for:

- decimal places
- thousand separators
- symbol vs code vs full name
- spacing between currency and value
- trailing zeros
- negative values
- zero values

---

### 2. Taka Symbol Utilities

Provide helpers for:

- Taka symbol: `৳`
- ISO currency code: `BDT`
- English name: `Taka`
- Bengali name: `টাকা`

Examples:

- `getTakaSymbol()` → `৳`
- `getTakaCode()` → `BDT`
- `getTakaName("en")` → `Taka`
- `getTakaName("bn")` → `টাকা`

Also include constants:

- `TAKA_SYMBOL`
- `TAKA_CODE`
- `TAKA_NAME_EN`
- `TAKA_NAME_BN`

---

### 3. Locale-Aware Digit Conversion

Support digit transformation between English and Bengali numerals.

Examples:

- `toBanglaDigits(1250)` → `১২৫০`
- `toEnglishDigits("১,২৫০")` → `1,250`

Useful for mixed-language UI rendering.

---

### 4. Compact Money Formatting

Add compact notation suitable for local usage.

Examples:

- `formatTakaCompact(1200)` → `৳1.2K`
- `formatTakaCompact(125000)` → `৳1.25L`
- `formatTakaCompact(10000000)` → `৳1Cr`

Support both:

- international compact style: `K`, `M`
- South Asian compact style: `L`, `Cr`

Configurable options:

- `compactStyle: "international" | "south-asian"`
- decimals for compact values
- locale-aware output

Examples:

- `৳1.2K`
- `৳1.5L`
- `৳2Cr`
- Bengali-friendly variants if applicable

---

### 5. Parsing Utilities

Allow parsing from strings into numbers.

Examples:

- `parseTaka("৳1,250")` → `1250`
- `parseTaka("BDT 1,250.50")` → `1250.5`
- `parseTaka("১,২৫০ টাকা")` → `1250`

Should handle:

- symbol removal
- code removal
- localized digits
- commas and whitespace
- Bengali text wrappers like `টাকা`

---

### 6. React Components

Include optional React helpers.

#### `TakaSymbol`

Simple symbol component.

Example:

```tsx
<TakaSymbol />
```

#### `TakaAmount`

Render formatted amount.

Example:

```tsx
<TakaAmount value={1250} />
<TakaAmount value={1250} locale="bn-BD" />
<TakaAmount value={1250} currency="code" />
```

#### `TakaText`

Flexible display wrapper for full text output.

Example:

```tsx
<TakaText value={1250} style="name" locale="bn-BD" />
```

React components should be:

- tiny
- tree-shakeable
- typed
- SSR-safe
- usable in Next.js

---

## API Design

Design a clean, minimal API.

Suggested exports:

```ts
export { formatTaka } from "./format";
export { formatTakaCompact } from "./compact";
export { parseTaka } from "./parse";
export { toBanglaDigits, toEnglishDigits } from "./locale";
export {
  getTakaSymbol,
  getTakaCode,
  getTakaName,
  TAKA_SYMBOL,
  TAKA_CODE,
  TAKA_NAME_EN,
  TAKA_NAME_BN
} from "./symbol";
export { TakaSymbol, TakaAmount, TakaText } from "./react";
export type {
  TakaFormatOptions,
  TakaCompactOptions,
  TakaLocale,
  TakaCurrencyDisplay,
  TakaNameStyle
} from "./types";
```

---

## TypeScript Requirements

Use full TypeScript support.

Requirements:

- strict typing
- exported type definitions
- clean IntelliSense
- well-named option types
- no loose `any`
- safe defaults
- modern ESM-first design

---

## Build and Packaging

Set up the package for modern npm publishing.

Requirements:

- ESM-first
- optional CJS compatibility if desired
- tree-shakeable exports
- clean `exports` map
- `.d.ts` generation
- minimal bundle size
- works with Node and browsers
- side-effect free when possible

Suggested tools:

- `tsup`
- `typescript`
- `vitest`
- `eslint`
- `prettier`

Suggested scripts:

- `build`
- `build:watch`
- `test`
- `test:unit`
- `lint`
- `format`
- `typecheck`

---

## Code Quality

The implementation should be:

- simple
- well-structured
- production-ready
- readable
- documented
- maintainable
- tested

Avoid:

- overengineering
- unnecessary dependencies
- heavy i18n libraries unless truly needed
- bloated abstractions

---

## Testing

Write thorough tests for:

- positive numbers
- decimals
- negative values
- zero
- Bengali digit conversion
- symbol/code/name display
- parsing from multiple formats
- compact notation
- locale switching
- React component rendering if React components are included

Use `vitest`.

---

## Documentation

Write a high-quality `README.md` with:

### Sections to include

- package intro
- why this package exists
- installation
- quick start
- formatting examples
- Bengali vs English examples
- compact formatting examples
- parsing examples
- React usage
- API reference
- TypeScript support
- license

### Tone

The documentation should feel:

- polished
- developer-focused
- practical
- modern
- concise but complete

---

## README Positioning

Position `@coreify/taka` as:

**A modern toolkit for formatting and rendering Bangladeshi Taka in JavaScript, TypeScript, and React apps.**

Not as:

- a font package
- a Unicode workaround
- a novelty package

Focus on:

- developer experience
- localization
- money formatting
- Bangladesh-first UI utility

---

## Design Principles

The package should embody these principles:

- **Bangladesh-first**
- **developer-friendly**
- **minimal API**
- **small footprint**
- **typed by default**
- **works everywhere**
- **practical over gimmicky**
- **clean output formatting**

---

## Example Usage Targets

Make sure the package works nicely in scenarios like:

### E-commerce

```ts
formatTaka(2499); // ৳2,499
```

### Bengali invoice UI

```ts
formatTaka(2499, { locale: "bn-BD" }); // ৳২,৪৯৯
```

### Accounting dashboard

```ts
formatTakaCompact(1250000, { compactStyle: "south-asian" }); // ৳12.5L
```

### Parsing input

```ts
parseTaka("৳ ১,২৫০.৫০"); // 1250.5
```

### React UI

```tsx
<TakaAmount value={1250} locale="bn-BD" />
```

---

## Nice-to-Have Features

If appropriate, also consider:

- `isTakaString()` helper
- `normalizeTakaInput()` helper
- configurable separator rules
- currency placement options (`before` / `after`)
- accessibility labels like `"1250 Bangladeshi Taka"`
- custom formatter presets

---

## Deliverables

Build the package with:

1. Source code
2. TypeScript types
3. Tests
4. README
5. npm-ready package configuration
6. examples of usage
7. clean exports map
8. publish-ready structure

---

## Final Output Expectation

The final result should feel like a serious open-source package that could be published to npm under `@coreify/taka` and immediately used by developers building Bangladesh-focused products.

It should be elegant, minimal, practical, and trustworthy.

Build it as if it were intended to become the default Taka utility package for the JavaScript ecosystem.
