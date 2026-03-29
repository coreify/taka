import { describe, expect, it } from "vitest";
import { formatTakaCompact, TAKA_SYMBOL, toBanglaDigits } from "../src";

const LAKH = "\u09b2\u09be\u0996";
const KOTI = "\u0995\u09cb\u099f\u09bf";
const BILLION_BN = "\u09ac\u09bf\u09b2\u09bf\u09af\u09bc\u09a8";

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
    ).toBe(`${TAKA_SYMBOL}${toBanglaDigits("1.25")} ${LAKH}`);
    expect(
      formatTakaCompact(10000000, {
        compactLabelStyle: "localized",
        locale: "bn-BD"
      })
    ).toBe(`${TAKA_SYMBOL}${toBanglaDigits("1")} ${KOTI}`);
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
    ).toBe(`${TAKA_SYMBOL}${toBanglaDigits("1")} ${BILLION_BN}`);
  });

  it("keeps negative and currency-position behavior with localized labels", () => {
    expect(
      formatTakaCompact(-125000, {
        compactLabelStyle: "localized",
        locale: "bn-BD"
      })
    ).toBe(`-${TAKA_SYMBOL}${toBanglaDigits("1.25")} ${LAKH}`);
    expect(
      formatTakaCompact(125000, {
        compactLabelStyle: "localized",
        currencyPosition: "after",
        space: true,
        locale: "bn-BD"
      })
    ).toBe(`${toBanglaDigits("1.25")} ${LAKH} ${TAKA_SYMBOL}`);
  });
});
