import { describe, expect, it } from "vitest";
import { formatTakaCompact, TAKA_SYMBOL, toBanglaDigits } from "../src";

const KOTI = "\u0995\u09cb\u099f\u09bf";

describe("formatTakaCompact localized labels", () => {
  it("uses locale-aware words when compactLabelStyle is localized", () => {
    expect(
      formatTakaCompact(1200, { compactLabelStyle: "localized" })
    ).toBe(`${TAKA_SYMBOL}1.2 thousand`);
    expect(
      formatTakaCompact(125000, {
        compactLabelStyle: "localized",
        locale: "bn-BD"
      })
    ).toBe(`${TAKA_SYMBOL}১ লাখ ২৫ হাজার`);
    expect(
      formatTakaCompact(10000000, {
        compactLabelStyle: "localized",
        locale: "bn-BD"
      })
    ).toBe(`${TAKA_SYMBOL}${toBanglaDigits("1")} ${KOTI}`);
    expect(
      formatTakaCompact(1250000, {
        compactLabelStyle: "localized",
        locale: "bn-BD"
      })
    ).toBe(`${TAKA_SYMBOL}১২ লাখ ৫০ হাজার`);
  });

  it("supports localized labels with international compact style", () => {
    expect(
      formatTakaCompact(1500000, {
        compactStyle: "international",
        compactLabelStyle: "localized"
      })
    ).toBe(`${TAKA_SYMBOL}1.5 million`);
    expect(
      formatTakaCompact(1000000000, {
        compactStyle: "international",
        compactLabelStyle: "localized",
        locale: "bn-BD"
      })
    ).toBe(`${TAKA_SYMBOL}১০০ কোটি`);
  });

  it("keeps negative and currency-position behavior with localized labels", () => {
    expect(
      formatTakaCompact(-125000, {
        compactLabelStyle: "localized",
        locale: "bn-BD"
      })
    ).toBe(`-${TAKA_SYMBOL}১ লাখ ২৫ হাজার`);
    expect(
      formatTakaCompact(125000, {
        compactLabelStyle: "localized",
        currencyPosition: "after",
        space: true,
        locale: "bn-BD"
      })
    ).toBe(`১ লাখ ২৫ হাজার ${TAKA_SYMBOL}`);
  });
});
