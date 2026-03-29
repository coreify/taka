import { describe, expect, it } from "vitest";
import { formatTakaCompact } from "../src/compact";

describe("formatTakaCompact", () => {
  it("formats south-asian compact output by default", () => {
    expect(formatTakaCompact(1200)).toBe("৳1.2K");
    expect(formatTakaCompact(125000)).toBe("৳1.25L");
    expect(formatTakaCompact(10000000)).toBe("৳1Cr");
  });

  it("supports international compact output", () => {
    expect(formatTakaCompact(1500000, { compactStyle: "international" })).toBe(
      "৳1.5M"
    );
  });

  it("supports localized digits and negatives", () => {
    expect(formatTakaCompact(125000, { locale: "bn-BD" })).toBe("৳১.২৫L");
    expect(formatTakaCompact(-10000000)).toBe("-৳1Cr");
  });

  it("falls back to regular formatting below the compact threshold", () => {
    expect(formatTakaCompact(999)).toBe("৳999");
  });
});
