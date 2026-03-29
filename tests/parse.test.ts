import { describe, expect, it } from "vitest";
import {
  isTakaString,
  normalizeTakaInput,
  parseTaka,
  TAKA_NAME_BN,
  TAKA_SYMBOL,
  toBanglaDigits
} from "../src";

describe("parseTaka", () => {
  it("parses symbol, code, and Bengali-name strings", () => {
    expect(parseTaka(`${TAKA_SYMBOL}1,250`)).toBe(1250);
    expect(parseTaka("BDT100")).toBe(100);
    expect(parseTaka("100BDT")).toBe(100);
    expect(parseTaka("Taka100")).toBe(100);
    expect(parseTaka("100Taka")).toBe(100);
    expect(parseTaka("BDT 1,250.50")).toBe(1250.5);
    expect(parseTaka(`${toBanglaDigits("1,250")} ${TAKA_NAME_BN}`)).toBe(1250);
  });

  it("normalizes localized digits and wrappers", () => {
    expect(normalizeTakaInput(`${TAKA_SYMBOL} ${toBanglaDigits("1250.50")}`)).toBe("1250.50");
    expect(parseTaka(`(${TAKA_SYMBOL}1,250)`)).toBe(-1250);
  });

  it("supports European-style grouping and decimal separators", () => {
    expect(normalizeTakaInput(`${TAKA_SYMBOL}1.234,56`)).toBe("1234.56");
    expect(parseTaka("BDT -1.234,56")).toBe(-1234.56);
    expect(parseTaka(`${TAKA_SYMBOL}1,5`)).toBe(1.5);
  });

  it("supports Indian-style lakh grouping", () => {
    expect(normalizeTakaInput(`${TAKA_SYMBOL}12,34,567`)).toBe("1234567");
    expect(parseTaka(`${TAKA_SYMBOL}12,34,567.89`)).toBe(1234567.89);
  });

  it("rejects invalid or ambiguous input", () => {
    expect(parseTaka("taka: one thousand")).toBeNull();
    expect(parseTaka("BDT 1,250.50.20")).toBeNull();
    expect(parseTaka("1-250")).toBeNull();
    expect(parseTaka(`${TAKA_SYMBOL}1,23,45`)).toBeNull();
  });

  it("parses ambiguous comma groups when allowLooseCommaGrouping is set", () => {
    expect(
      parseTaka(`${TAKA_SYMBOL}1,23,45`, { allowLooseCommaGrouping: true })
    ).toBe(12345);
  });

  it("detects likely taka strings", () => {
    expect(isTakaString(`${TAKA_SYMBOL}1,250`)).toBe(true);
    expect(isTakaString("1,250")).toBe(false);
  });

  it("parses amounts with only a fractional part after stripping currency", () => {
    expect(parseTaka(`${TAKA_SYMBOL}.5`)).toBe(0.5);
    expect(parseTaka("BDT .25")).toBe(0.25);
  });

  it("normalizes unicode dashes and nbsp like minus", () => {
    expect(parseTaka(`${TAKA_SYMBOL}\u22121,250`)).toBe(-1250);
    expect(normalizeTakaInput(`${TAKA_SYMBOL}\u00a01,250`)).toBe("1250");
  });

  it("does not treat parentheses as negative when disabled", () => {
    expect(parseTaka(`(${TAKA_SYMBOL}1,250)`, { allowParentheses: false })).toBeNull();
  });

  it("rejects scientific notation and other non-plain numbers by default", () => {
    expect(parseTaka(`${TAKA_SYMBOL}1e3`)).toBeNull();
    expect(parseTaka("BDT 1,250.50.1")).toBeNull();
  });

  it("parses scientific notation when allowScientificNotation is set", () => {
    expect(parseTaka(`${TAKA_SYMBOL}1e3`, { allowScientificNotation: true })).toBe(
      1000
    );
    expect(
      parseTaka("1e3", { allowScientificNotation: true })
    ).toBeNull();
    expect(parseTaka("BDT 1.5e2", { allowScientificNotation: true })).toBe(150);
    expect(
      parseTaka("BDT1e3", { allowScientificNotation: true })
    ).toBe(1000);
    expect(
      parseTaka("Taka1e3", { allowScientificNotation: true })
    ).toBe(1000);
    expect(
      parseTaka("BDT100.5e2", { allowScientificNotation: true })
    ).toBe(10050);
    expect(
      parseTaka(`${TAKA_SYMBOL}1e400`, { allowScientificNotation: true })
    ).toBeNull();
  });

  it("parses glued BDT/Taka with accounting parentheses and leading minus", () => {
    expect(parseTaka("(BDT100)")).toBe(-100);
    expect(parseTaka("(Taka100)")).toBe(-100);
    expect(parseTaka("-BDT100")).toBe(-100);
    expect(parseTaka("-Taka100")).toBe(-100);
  });

  it("rejects hex literals with TypeError (aligned with formatTaka)", () => {
    expect(() => parseTaka("0x10")).toThrow(TypeError);
    expect(() => parseTaka("0x10")).toThrow(/hex/i);
    expect(() => parseTaka(`${TAKA_SYMBOL}0x10`)).toThrow(TypeError);
    expect(isTakaString("0x10")).toBe(false);
    expect(isTakaString(`${TAKA_SYMBOL}0x10`)).toBe(false);
  });

  it("rejects fullwidth hex lookalikes (０x…) like ASCII hex", () => {
    const fullwidthZeroHex = "\uFF10x10";
    expect(() => parseTaka(fullwidthZeroHex)).toThrow(TypeError);
    expect(() => parseTaka(fullwidthZeroHex)).toThrow(/hex/i);
    expect(isTakaString(fullwidthZeroHex)).toBe(false);
  });

  it("rejects multiple Taka symbols in one string", () => {
    expect(parseTaka(`${TAKA_SYMBOL}${TAKA_SYMBOL}100`)).toBeNull();
    expect(parseTaka(`${TAKA_SYMBOL} ${TAKA_SYMBOL} 100`)).toBeNull();
    expect(isTakaString(`${TAKA_SYMBOL}${TAKA_SYMBOL}100`)).toBe(false);
  });

  it("does not treat Bangla টাকা inside a longer word as a currency token", () => {
    const sandwiched = `\u0995${TAKA_NAME_BN}\u0995 100`;
    expect(isTakaString(sandwiched)).toBe(false);
  });

  it("returns null for currency-only or empty input after normalization", () => {
    expect(parseTaka(TAKA_SYMBOL)).toBeNull();
    expect(parseTaka("   ")).toBeNull();
    expect(parseTaka("BDT")).toBeNull();
  });

  it("returns null for values outside the safe integer range", () => {
    expect(parseTaka(`${TAKA_SYMBOL}9,007,199,254,740,992`)).toBeNull();
    expect(parseTaka("BDT 9007199254740992.5")).toBeNull();
  });

  it("does not flag isTakaString when a token exists but no parseable amount", () => {
    expect(isTakaString(TAKA_SYMBOL)).toBe(false);
    expect(isTakaString(`${TAKA_NAME_BN} only`)).toBe(false);
  });

  it("detects the English name token case-insensitively", () => {
    expect(isTakaString("taka 10")).toBe(true);
    expect(parseTaka("Taka 10")).toBe(10);
  });
});
