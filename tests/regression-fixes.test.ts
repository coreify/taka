import { describe, expect, it } from "vitest";
import {
  formatTaka,
  formatTakaCompact,
  parseTaka,
  TAKA_SYMBOL,
  toPoisha
} from "../src";

describe("regression fixes", () => {
  it("reject safe-boundary decimal strings that would silently round up", () => {
    expect(parseTaka("BDT 9007199254740991.5")).toBeNull();
    expect(parseTaka("BDT 9007199254740991.0000001")).toBeNull();
    expect(() => formatTaka("9007199254740991.5")).toThrow(RangeError);
    expect(() => formatTaka("9007199254740991.0000001")).toThrow(RangeError);
  });

  it("reject underflowing and rounded scientific string inputs", () => {
    expect(
      parseTaka("BDT 1e-324", { allowScientificNotation: true })
    ).toBeNull();
    expect(
      parseTaka("BDT 9.0071992547409911e15", {
        allowScientificNotation: true
      })
    ).toBeNull();
    expect(() =>
      formatTaka("1e-324", { allowScientificNotation: true })
    ).toThrow(RangeError);
    expect(() =>
      formatTaka("9.0071992547409911e15", {
        allowScientificNotation: true
      })
    ).toThrow(RangeError);
  });

  it("rounds poisha conversion deterministically for decimal money inputs", () => {
    expect(toPoisha(1.005)).toBe(101);
    expect(toPoisha(2.675)).toBe(268);
    expect(toPoisha(-1.005)).toBe(-100);
  });

  it("prevents compact formatting from overstating values at unit edges", () => {
    expect(formatTakaCompact(999999)).toBe(`${TAKA_SYMBOL}9.99L`);
    expect(formatTakaCompact(9999999)).toBe(`${TAKA_SYMBOL}99.99L`);
    expect(
      formatTakaCompact(999999, { compactStyle: "international" })
    ).toBe(`${TAKA_SYMBOL}999.99K`);
  });
});
