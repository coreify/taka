import { describe, expect, it } from "vitest";
import {
  getTakaCode,
  getTakaName,
  getTakaSymbol,
  TAKA_CODE,
  TAKA_NAME_BN,
  TAKA_NAME_EN,
  TAKA_SYMBOL
} from "../src";

describe("symbol utilities", () => {
  it("exports the Taka constants", () => {
    expect(TAKA_SYMBOL).toBe("৳");
    expect(TAKA_CODE).toBe("BDT");
    expect(TAKA_NAME_EN).toBe("Taka");
    expect(TAKA_NAME_BN).toBe("টাকা");
  });

  it("returns symbol, code, and localized names", () => {
    expect(getTakaSymbol()).toBe("৳");
    expect(getTakaCode()).toBe("BDT");
    expect(getTakaName("en")).toBe("Taka");
    expect(getTakaName("bn")).toBe("টাকা");
    expect(getTakaName("bn-BD")).toBe("টাকা");
    expect(getTakaName("en-BD")).toBe("Taka");
  });
});
