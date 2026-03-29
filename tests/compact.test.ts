import { describe, expect, it } from "vitest";
import { TAKA_SYMBOL, formatTakaCompact, toBanglaDigits } from "../src";

describe("formatTakaCompact", () => {
  it("formats south-asian compact output by default", () => {
    expect(formatTakaCompact(1200)).toBe(`${TAKA_SYMBOL}1.2K`);
    expect(formatTakaCompact(125000)).toBe(`${TAKA_SYMBOL}1.25L`);
    expect(formatTakaCompact(10000000)).toBe(`${TAKA_SYMBOL}1Cr`);
  });

  it("supports international compact output", () => {
    expect(formatTakaCompact(1500000, { compactStyle: "international" })).toBe(
      `${TAKA_SYMBOL}1.5M`
    );
  });

  it("supports localized compact labels", () => {
    expect(formatTakaCompact(1200, { compactLabelStyle: "localized" })).toBe(
      `${TAKA_SYMBOL}1.2 thousand`
    );
    expect(
      formatTakaCompact(125000, {
        compactLabelStyle: "localized",
        locale: "bn-BD"
      })
    ).toBe(`${TAKA_SYMBOL}${toBanglaDigits("1.25")} লাখ`);
    expect(
      formatTakaCompact(10000000, {
        compactLabelStyle: "localized",
        locale: "bn-BD"
      })
    ).toBe(`${TAKA_SYMBOL}${toBanglaDigits("1")} কোটি`);
  });

  it("supports localized digits and negatives", () => {
    expect(formatTakaCompact(125000, { locale: "bn-BD" })).toBe(
      `${TAKA_SYMBOL}${toBanglaDigits("1.25")}L`
    );
    expect(formatTakaCompact(-10000000)).toBe(`-${TAKA_SYMBOL}1Cr`);
  });

  it("falls back to regular formatting below the compact threshold", () => {
    expect(formatTakaCompact(999)).toBe(`${TAKA_SYMBOL}999`);
  });

  it("uses compact suffixes at exact south-asian thresholds", () => {
    expect(formatTakaCompact(1000)).toBe(`${TAKA_SYMBOL}1K`);
    expect(formatTakaCompact(100_000)).toBe(`${TAKA_SYMBOL}1L`);
    expect(formatTakaCompact(10_000_000)).toBe(`${TAKA_SYMBOL}1Cr`);
  });

  it("uses compact suffixes at international thresholds", () => {
    expect(
      formatTakaCompact(1_000_000, { compactStyle: "international" })
    ).toBe(`${TAKA_SYMBOL}1M`);
    expect(
      formatTakaCompact(1_000_000_000, { compactStyle: "international" })
    ).toBe(`${TAKA_SYMBOL}1B`);
  });

  it("accepts numeric-like inputs", () => {
    expect(formatTakaCompact("1200")).toBe(`${TAKA_SYMBOL}1.2K`);
    expect(formatTakaCompact(new Number(1200))).toBe(`${TAKA_SYMBOL}1.2K`);
  });

  it("rejects non-finite amounts", () => {
    expect(() => formatTakaCompact(Number.NaN)).toThrow(TypeError);
  });

  it("delegates very small magnitudes to formatTaka (including zeroFormat)", () => {
    expect(formatTakaCompact(0, { zeroFormat: "Free" })).toBe("Free");
    expect(formatTakaCompact(12, { zeroFormat: "Free" })).toBe(
      `${TAKA_SYMBOL}12`
    );
  });

  it("supports accounting negatives in compact mode", () => {
    expect(formatTakaCompact(-125000, { negativeStyle: "accounting" })).toBe(
      `(${TAKA_SYMBOL}1.25L)`
    );
  });
});
