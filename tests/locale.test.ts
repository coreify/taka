import { describe, expect, it } from "vitest";
import { toBanglaDigits, toEnglishDigits } from "../src/locale";

describe("digit conversion", () => {
  it("converts English digits to Bengali digits", () => {
    expect(toBanglaDigits(1250)).toBe("১২৫০");
    expect(toBanglaDigits("1,250.50")).toBe("১,২৫০.৫০");
  });

  it("converts Bengali digits back to English digits", () => {
    expect(toEnglishDigits("১,২৫০.৫০")).toBe("1,250.50");
  });
});
