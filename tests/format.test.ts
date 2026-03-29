import { describe, expect, it } from "vitest";
import {
  formatCoercedAmount,
  formatTaka,
  TAKA_NAME_BN,
  TAKA_SYMBOL,
  toBanglaDigits
} from "../src";

describe("formatTaka", () => {
  it("formats the default symbol display", () => {
    expect(formatTaka(1250)).toBe(`${TAKA_SYMBOL}1,250`);
  });

  it("formats decimals with plan-aligned fixed precision by default", () => {
    expect(formatTaka(1250, { decimals: 2 })).toBe(`${TAKA_SYMBOL}1,250.00`);
    expect(formatTaka(1250, { decimals: 2, trailingZeros: false })).toBe(
      `${TAKA_SYMBOL}1,250`
    );
  });

  it("formats using the code display", () => {
    expect(formatTaka(1250, { currency: "code" })).toBe("BDT 1,250");
  });

  it("formats Bengali digits and the Bengali currency name", () => {
    expect(formatTaka(1250, { locale: "bn-BD" })).toBe(
      `${TAKA_SYMBOL}${toBanglaDigits("1,250")}`
    );
    expect(formatTaka(1250, { locale: "bn-BD", style: "name" })).toBe(
      `${toBanglaDigits("1,250")} ${TAKA_NAME_BN}`
    );
  });

  it("uses the requested locale for large-number grouping", () => {
    expect(formatTaka(1234567.89, { locale: "en-BD" })).toBe(
      `${TAKA_SYMBOL}1,234,567.89`
    );
    expect(formatTaka(1234567.89, { locale: "bn-BD" })).toBe(
      `${TAKA_SYMBOL}${toBanglaDigits("12,34,567.89")}`
    );
  });

  it("supports after-placement and accounting negatives", () => {
    expect(formatTaka(1250, { currencyPosition: "after", space: true })).toBe(
      `1,250 ${TAKA_SYMBOL}`
    );
    expect(formatTaka(-1250, { negativeStyle: "accounting" })).toBe(
      `(${TAKA_SYMBOL}1,250)`
    );
  });

  it("supports custom zero formatting", () => {
    expect(formatTaka(0, { zeroFormat: "Free" })).toBe("Free");
  });

  it("accepts numeric strings and boxed numbers", () => {
    expect(formatTaka("1250")).toBe(`${TAKA_SYMBOL}1,250`);
    expect(formatTaka(" 1,250.50 ")).toBe(`${TAKA_SYMBOL}1,250.5`);
    expect(formatTaka("1.234,56")).toBe(`${TAKA_SYMBOL}1,234.56`);
    expect(formatTaka("12,34,567")).toBe(`${TAKA_SYMBOL}1,234,567`);
    expect(formatTaka("12,34,567", { locale: "bn-BD" })).toBe(
      `${TAKA_SYMBOL}${toBanglaDigits("12,34,567")}`
    );
    expect(formatTaka("(1,250)", { negativeStyle: "sign" })).toBe(
      `-${TAKA_SYMBOL}1,250`
    );
    expect(formatTaka(new Number(5))).toBe(`${TAKA_SYMBOL}5`);
    expect(formatTaka(100n)).toBe(`${TAKA_SYMBOL}100`);
  });

  it("rejects scientific, hex, and out-of-range string amounts by default", () => {
    expect(() => formatTaka("1e2")).toThrow(TypeError);
    expect(() => formatTaka("0x10")).toThrow(TypeError);
    expect(() => formatTaka("0x10")).toThrow(/hex/i);
    expect(() => formatTaka("\uFF10x10")).toThrow(TypeError);
    expect(() => formatTaka("\uFF10x10")).toThrow(/hex/i);
    expect(() => formatTaka("9007199254740993")).toThrow(RangeError);
    expect(() => formatTaka(BigInt("9007199254740993"))).toThrow(RangeError);
  });

  it("accepts scientific numeric strings when allowScientificNotation is set", () => {
    expect(formatTaka("1e3", { allowScientificNotation: true })).toBe(
      `${TAKA_SYMBOL}1,000`
    );
    expect(() =>
      formatTaka("1e400", { allowScientificNotation: true })
    ).toThrow(RangeError);
  });

  it("accepts loose comma grouping in strings when allowLooseCommaGrouping is set", () => {
    expect(formatTaka("1,23,45", { allowLooseCommaGrouping: true })).toBe(
      `${TAKA_SYMBOL}12,345`
    );
  });

  it("rejects non-finite amounts", () => {
    expect(() => formatTaka(Number.NaN)).toThrow(TypeError);
    expect(() => formatTaka(Number.POSITIVE_INFINITY)).toThrow(TypeError);
    expect(() => formatTaka(Number.NEGATIVE_INFINITY)).toThrow(TypeError);
  });

  it("rejects invalid numeric-like formatter inputs", () => {
    expect(() => formatTaka("" as string)).toThrow(TypeError);
    expect(() => formatTaka("12px")).toThrow(TypeError);
  });

  it("rejects invalid decimal places", () => {
    expect(() => formatTaka(1, { decimals: -1 })).toThrow(RangeError);
    expect(() => formatTaka(1, { decimals: 1.5 })).toThrow(RangeError);
    expect(() => formatTaka(1, { decimals: 21 })).toThrow(RangeError);
  });

  it("treats negative zero like zero for sign output", () => {
    expect(formatTaka(-0)).toBe(`${TAKA_SYMBOL}0`);
    expect(formatTaka(-0, { negativeStyle: "accounting" })).toBe(
      `${TAKA_SYMBOL}0`
    );
  });

  it("lets style win over currency when both are set", () => {
    expect(
      formatTaka(100, {
        currency: "code",
        style: "name",
        currencyPosition: "before"
      })
    ).toBe("Taka 100");
  });

  it("allows disabling digit grouping", () => {
    expect(formatTaka(1234567, { useGrouping: false })).toBe(
      `${TAKA_SYMBOL}1234567`
    );
  });

  it("formats fractional amounts without fixed decimals by default", () => {
    expect(formatTaka(1.2)).toBe(`${TAKA_SYMBOL}1.2`);
    expect(formatTaka(1.234)).toBe(`${TAKA_SYMBOL}1.23`);
  });

  it("applies accounting style with code display", () => {
    expect(
      formatTaka(-500, { currency: "code", negativeStyle: "accounting" })
    ).toBe("(BDT 500)");
  });

  it("formats pre-coerced amounts the same as formatTaka", () => {
    expect(formatCoercedAmount(1250)).toBe(formatTaka(1250));
    expect(formatCoercedAmount(-500, { negativeStyle: "accounting" })).toBe(
      formatTaka(-500, { negativeStyle: "accounting" })
    );
  });
});
