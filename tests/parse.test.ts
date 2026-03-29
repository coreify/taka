import { describe, expect, it } from "vitest";
import { isTakaString, normalizeTakaInput, parseTaka } from "../src/parse";

describe("parseTaka", () => {
  it("parses symbol, code, and Bengali-name strings", () => {
    expect(parseTaka("৳1,250")).toBe(1250);
    expect(parseTaka("BDT 1,250.50")).toBe(1250.5);
    expect(parseTaka("১,২৫০ টাকা")).toBe(1250);
  });

  it("normalizes localized digits and wrappers", () => {
    expect(normalizeTakaInput("৳ ১,২৫০.৫০")).toBe("1250.50");
    expect(parseTaka("(৳1,250)")).toBe(-1250);
  });

  it("rejects invalid or ambiguous input", () => {
    expect(parseTaka("taka: one thousand")).toBeNull();
    expect(parseTaka("BDT 1,250.50.20")).toBeNull();
    expect(parseTaka("1-250")).toBeNull();
  });

  it("detects likely taka strings", () => {
    expect(isTakaString("৳1,250")).toBe(true);
    expect(isTakaString("1,250")).toBe(false);
  });
});
