import { describe, expect, it } from "vitest";
import { toBanglaDigits, toEnglishDigits } from "../src";

describe("digit conversion", () => {
  it("converts English digits to Bengali digits", () => {
    expect(toBanglaDigits(1250)).toBe("১২৫০");
    expect(toBanglaDigits("1,250.50")).toBe("১,২৫০.৫০");
  });

  it("converts Bengali digits back to English digits", () => {
    expect(toEnglishDigits("১,২৫০.৫০")).toBe("1,250.50");
  });

  it("leaves non-digit characters unchanged in Bangla conversion", () => {
    expect(toBanglaDigits("no-digits")).toBe("no-digits");
    expect(toBanglaDigits("")).toBe("");
  });

  it("round-trips mixed scripts after English digit pass", () => {
    const bn = toBanglaDigits("100");
    expect(toEnglishDigits(bn)).toBe("100");
  });
});
