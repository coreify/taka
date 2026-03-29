import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type * as BuiltCoreExports from "../src";
import type * as BuiltReactExports from "../src/react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);

const distIndexJsPath = join(process.cwd(), "dist/index.js");
const distIndexCjsPath = join(process.cwd(), "dist/index.cjs");
const distReactJsPath = join(process.cwd(), "dist/react.js");
const distReactCjsPath = join(process.cwd(), "dist/react.cjs");
const distIndexTypesPath = join(process.cwd(), "dist/index.d.ts");

type BuiltCoreModule = typeof BuiltCoreExports;
type BuiltReactModule = typeof BuiltReactExports;

let builtCoreEsm: BuiltCoreModule;
let builtCoreCjs: BuiltCoreModule;
let builtReactEsm: BuiltReactModule;
let builtReactCjs: BuiltReactModule;

beforeAll(async () => {
  for (const path of [
    distIndexJsPath,
    distIndexCjsPath,
    distReactJsPath,
    distReactCjsPath,
    distIndexTypesPath
  ]) {
    if (!existsSync(path)) {
      throw new Error(
        `Expected built artifact at ${path}. Run the build first.`
      );
    }
  }

  builtCoreEsm = await import(pathToFileURL(distIndexJsPath).href);
  builtCoreCjs = require(distIndexCjsPath) as BuiltCoreModule;
  builtReactEsm = await import(pathToFileURL(distReactJsPath).href);
  builtReactCjs = require(distReactCjsPath) as BuiltReactModule;
});

describe("package build outputs", () => {
  it("preserve money conversion and formatting behavior", () => {
    const parsed = builtCoreEsm.parseTaka(`${builtCoreEsm.TAKA_SYMBOL}12.5`);
    expect(parsed).toBe(12.5);

    const poisha = builtCoreEsm.toPoisha(parsed!);
    expect(poisha).toBe(1250);
    expect(builtCoreEsm.formatTaka(builtCoreEsm.fromPoisha(poisha))).toBe(
      `${builtCoreEsm.TAKA_SYMBOL}12.5`
    );
    expect(builtCoreCjs.formatTaka("1250")).toBe(
      `${builtCoreCjs.TAKA_SYMBOL}1,250`
    );
  });

  it("reject out-of-range and underflowing string inputs", () => {
    expect(builtCoreEsm.parseTaka("BDT 9007199254740991.5")).toBeNull();
    expect(() => builtCoreEsm.formatTaka("9007199254740991.5")).toThrow(
      RangeError
    );
    expect(
      builtCoreCjs.parseTaka("BDT 1e-324", { allowScientificNotation: true })
    ).toBeNull();
    expect(() =>
      builtCoreCjs.formatTaka("1e-324", { allowScientificNotation: true })
    ).toThrow(RangeError);
  });

  it("avoid compact rollover into overstated units", () => {
    expect(builtCoreEsm.formatTakaCompact(999999)).toBe(
      `${builtCoreEsm.TAKA_SYMBOL}9.99L`
    );
    expect(
      builtCoreEsm.formatTakaCompact(999999, {
        compactStyle: "international"
      })
    ).toBe(`${builtCoreEsm.TAKA_SYMBOL}999.99K`);
  });

  it("render the built React entry", () => {
    const markup = renderToStaticMarkup(
      createElement(builtReactEsm.TakaAmount, {
        value: 99,
        locale: "en-BD",
        variant: "symbol"
      })
    );

    expect(markup).toContain(`>${builtCoreEsm.TAKA_SYMBOL}99<`);
    expect(markup).toContain('aria-label="99 Taka"');
    expect(typeof builtReactCjs.TakaText).toBe("object");
  });

  it("publish React-free core types and preserve use client", () => {
    const typesSrc = readFileSync(distIndexTypesPath, "utf8");
    expect(typesSrc).not.toMatch(/from ['"]react['"]/);
    expect(typesSrc).not.toMatch(/from "react"/);

    const reactBundle = readFileSync(distReactJsPath, "utf8");
    expect(reactBundle.trimStart().startsWith('"use client"')).toBe(true);
  });
});
