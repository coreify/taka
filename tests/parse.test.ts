import { describe, expect, it } from "vitest";
import { isTakaString, normalizeTakaInput, parseTaka } from "../src";

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

  it("parses amounts with only a fractional part after stripping currency", () => {
    expect(parseTaka("৳.5")).toBe(0.5);
    expect(parseTaka("BDT .25")).toBe(0.25);
  });

  it("normalizes unicode dashes and nbsp like minus", () => {
    expect(parseTaka("৳\u22121,250")).toBe(-1250);
    expect(normalizeTakaInput("৳\u00a01,250")).toBe("1250");
  });

  it("does not treat parentheses as negative when disabled", () => {
    expect(parseTaka("(৳1,250)", { allowParentheses: false })).toBeNull();
  });

  it("rejects scientific notation and other non-plain numbers", () => {
    expect(parseTaka("৳1e3")).toBeNull();
    expect(parseTaka("BDT 1,250.50.1")).toBeNull();
  });

  it("returns null for currency-only or empty input after normalization", () => {
    expect(parseTaka("৳")).toBeNull();
    expect(parseTaka("   ")).toBeNull();
    expect(parseTaka("BDT")).toBeNull();
  });

  it("does not flag isTakaString when a token exists but no parseable amount", () => {
    expect(isTakaString("৳")).toBe(false);
    expect(isTakaString("টাকা only")).toBe(false);
  });

  it("detects the English name token case-insensitively", () => {
    expect(isTakaString("taka 10")).toBe(true);
    expect(parseTaka("Taka 10")).toBe(10);
  });
});
