import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  formatTaka,
  formatTakaCompact,
  fromPoisha,
  parseTaka,
  TAKA_NAME_EN,
  TAKA_SYMBOL,
  toPoisha
} from "../src";
import { TakaAmount } from "../src/react";

const testDir = dirname(fileURLToPath(import.meta.url));

describe("package e2e (former issues.md coverage)", () => {
  it("floating-point money: integer poisha pipeline then format", () => {
    const parsed = parseTaka(`${TAKA_SYMBOL}12.5`);
    expect(parsed).toBe(12.5);
    const poisha = toPoisha(parsed!);
    expect(poisha).toBe(1250);
    expect(formatTaka(fromPoisha(poisha))).toBe(`${TAKA_SYMBOL}12.5`);
  });

  it("rejects amounts outside safe integer range without silent rounding", () => {
    expect(parseTaka(`${TAKA_SYMBOL}9,007,199,254,740,992`)).toBeNull();
    expect(() => formatTaka("9007199254740993")).toThrow(RangeError);
  });

  it("ambiguous commas: strict by default, loose opt-in for parse and format", () => {
    expect(parseTaka(`${TAKA_SYMBOL}1,23,45`)).toBeNull();
    expect(
      parseTaka(`${TAKA_SYMBOL}1,23,45`, { allowLooseCommaGrouping: true })
    ).toBe(12345);
    expect(() => formatTaka("1,23,45")).toThrow(TypeError);
    expect(formatTaka("1,23,45", { allowLooseCommaGrouping: true })).toBe(
      `${TAKA_SYMBOL}12,345`
    );
  });

  it("rejects hex and junk numeric strings with explicit TypeError", () => {
    expect(() => formatTaka("0x10")).toThrow(TypeError);
    try {
      formatTaka("0x10");
    } catch (e) {
      expect((e as Error).message).toMatch(/hex/i);
    }
    expect(() => parseTaka("0x10")).toThrow(TypeError);
    expect(() => parseTaka(`${TAKA_SYMBOL}0x10`)).toThrow(TypeError);
    expect(() => formatTaka("12px")).toThrow(TypeError);
  });

  it("scientific notation off by default; opt-in respects bounds and requires a token", () => {
    expect(parseTaka(`${TAKA_SYMBOL}1e3`)).toBeNull();
    expect(
      parseTaka(`${TAKA_SYMBOL}1e3`, { allowScientificNotation: true })
    ).toBe(1000);
    expect(parseTaka("1e3", { allowScientificNotation: true })).toBeNull();
    expect(() => formatTaka("1e2")).toThrow(TypeError);
    expect(formatTaka("1e2", { allowScientificNotation: true })).toContain(
      "100"
    );
    expect(
      parseTaka(`${TAKA_SYMBOL}1e400`, { allowScientificNotation: true })
    ).toBeNull();
    expect(() =>
      formatTaka("1e400", { allowScientificNotation: true })
    ).toThrow(RangeError);
  });

  it("compact formatter respects the same string coercion options", () => {
    expect(
      formatTakaCompact("1500000", {
        compactStyle: "international",
        allowScientificNotation: true
      })
    ).toMatch(/1\.5M/);
  });

  it("React entry renders amounts; server-style formatting uses core only", () => {
    const markup = renderToStaticMarkup(
      createElement(TakaAmount, {
        value: 99,
        locale: "en-BD",
        variant: "symbol"
      })
    );
    expect(markup).toContain(`>${TAKA_SYMBOL}99<`);
    expect(markup).toContain(`99 ${TAKA_NAME_EN}`);
  });

  it("core source types module does not depend on React", () => {
    const typesSrc = readFileSync(
      join(testDir, "../src/types/index.ts"),
      "utf8"
    );
    expect(typesSrc).not.toMatch(/from ['"]react['"]/);
    expect(typesSrc).not.toMatch(/from "react"/);
  });

  it("React bundle keeps a top-level use client directive after build", () => {
    const jsPath = join(testDir, "../dist/react.js");
    if (!existsSync(jsPath)) {
      return;
    }
    const js = readFileSync(jsPath, "utf8");
    expect(js.trimStart().startsWith('"use client"')).toBe(true);
  });
});
