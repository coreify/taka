import { describe, expect, it } from "vitest";
import {
  formatTaka,
  fromPoisha,
  TAKA_POISHA_PER_TAKA,
  TAKA_SYMBOL,
  toPoisha
} from "../src";

describe("subunits", () => {
  it("defines 100 poisha per taka", () => {
    expect(TAKA_POISHA_PER_TAKA).toBe(100);
  });

  it("round-trips taka through integer poisha", () => {
    expect(toPoisha(10.5)).toBe(1050);
    expect(fromPoisha(1050)).toBe(10.5);
    expect(formatTaka(fromPoisha(1250))).toBe(`${TAKA_SYMBOL}12.5`);
  });

  it("rejects non-finite or non-integer poisha", () => {
    expect(() => toPoisha(Number.NaN)).toThrow(TypeError);
    expect(() => fromPoisha(1.5)).toThrow(RangeError);
  });

  it("rejects poisha outside the safe integer range", () => {
    expect(() => toPoisha(Number.MAX_SAFE_INTEGER)).toThrow(RangeError);
    expect(() => fromPoisha(Number.MAX_SAFE_INTEGER + 1)).toThrow(RangeError);
  });
});
