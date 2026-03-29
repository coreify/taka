import { describe, expect, it } from "vitest";
import { formatTaka } from "../src/format";

describe("formatTaka", () => {
  it("formats the default symbol display", () => {
    expect(formatTaka(1250)).toBe("৳1,250");
  });

  it("formats decimals with plan-aligned fixed precision by default", () => {
    expect(formatTaka(1250, { decimals: 2 })).toBe("৳1,250.00");
    expect(formatTaka(1250, { decimals: 2, trailingZeros: false })).toBe(
      "৳1,250"
    );
  });

  it("formats using the code display", () => {
    expect(formatTaka(1250, { currency: "code" })).toBe("BDT 1,250");
  });

  it("formats Bengali digits and the Bengali currency name", () => {
    expect(formatTaka(1250, { locale: "bn-BD" })).toBe("৳১,২৫০");
    expect(formatTaka(1250, { locale: "bn-BD", style: "name" })).toBe(
      "১,২৫০ টাকা"
    );
  });

  it("uses the requested locale for large-number grouping", () => {
    expect(formatTaka(1234567.89, { locale: "en-BD" })).toBe("৳1,234,567.89");
    expect(formatTaka(1234567.89, { locale: "bn-BD" })).toBe("৳১২,৩৪,৫৬৭.৮৯");
  });

  it("supports after-placement and accounting negatives", () => {
    expect(formatTaka(1250, { currencyPosition: "after", space: true })).toBe(
      "1,250 ৳"
    );
    expect(formatTaka(-1250, { negativeStyle: "accounting" })).toBe("(৳1,250)");
  });

  it("supports custom zero formatting", () => {
    expect(formatTaka(0, { zeroFormat: "Free" })).toBe("Free");
  });
});
