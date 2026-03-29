import { describe, expect, it } from "vitest";
import { formatTaka } from "../src";

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

  it("rejects non-finite amounts", () => {
    expect(() => formatTaka(Number.NaN)).toThrow(TypeError);
    expect(() => formatTaka(Number.POSITIVE_INFINITY)).toThrow(TypeError);
    expect(() => formatTaka(Number.NEGATIVE_INFINITY)).toThrow(TypeError);
  });

  it("rejects boxed numbers (Number objects are not plain primitives)", () => {
    expect(() => formatTaka(Object(1) as unknown as number)).toThrow(TypeError);
  });

  it("rejects invalid decimal places", () => {
    expect(() => formatTaka(1, { decimals: -1 })).toThrow(RangeError);
    expect(() => formatTaka(1, { decimals: 1.5 })).toThrow(RangeError);
    expect(() => formatTaka(1, { decimals: 21 })).toThrow(RangeError);
  });

  it("treats negative zero like zero for sign output", () => {
    expect(formatTaka(-0)).toBe("৳0");
    expect(formatTaka(-0, { negativeStyle: "accounting" })).toBe("৳0");
  });

  it("lets style win over currency when both are set", () => {
    expect(
      formatTaka(100, { currency: "code", style: "name", currencyPosition: "before" })
    ).toBe("Taka 100");
  });

  it("allows disabling digit grouping", () => {
    expect(formatTaka(1234567, { useGrouping: false })).toBe("৳1234567");
  });

  it("formats fractional amounts without fixed decimals by default", () => {
    expect(formatTaka(1.2)).toBe("৳1.2");
    expect(formatTaka(1.234)).toBe("৳1.23");
  });

  it("applies accounting style with code display", () => {
    expect(
      formatTaka(-500, { currency: "code", negativeStyle: "accounting" })
    ).toBe("(BDT 500)");
  });
});
