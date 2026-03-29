import { createRequire } from "node:module";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type * as BuiltCoreExports from "../src";
import { beforeAll, describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const distIndexJsPath = join(process.cwd(), "dist/index.js");
const distIndexCjsPath = join(process.cwd(), "dist/index.cjs");
const LAKH = "\u09b2\u09be\u0996";

type BuiltCoreModule = typeof BuiltCoreExports;

let builtCoreEsm: BuiltCoreModule;
let builtCoreCjs: BuiltCoreModule;

beforeAll(async () => {
  builtCoreEsm = await import(pathToFileURL(distIndexJsPath).href);
  builtCoreCjs = require(distIndexCjsPath) as BuiltCoreModule;
});

describe("built package localized compact labels", () => {
  it("preserves localized compact labels in built core entries", () => {
    expect(
      builtCoreEsm.formatTakaCompact(125000, {
        compactLabelStyle: "localized",
        locale: "bn-BD"
      })
    ).toBe(`${builtCoreEsm.TAKA_SYMBOL}\u09e7.\u09e8\u09eb ${LAKH}`);
    expect(
      builtCoreCjs.formatTakaCompact(1500000, {
        compactStyle: "international",
        compactLabelStyle: "localized"
      })
    ).toBe(`${builtCoreCjs.TAKA_SYMBOL}1.5 million`);
  });
});
