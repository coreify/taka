import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TAKA_NAME_BN, TAKA_SYMBOL, toBanglaDigits } from "../src";
import { TakaAmount, TakaSymbol, TakaText } from "../src/react";

describe("React helpers", () => {
  it("renders the symbol component", () => {
    const markup = renderToStaticMarkup(<TakaSymbol className="currency" />);
    expect(markup).toContain('class="currency"');
    expect(markup).toContain('aria-label="Bangladeshi Taka"');
    expect(markup).toContain(`>${TAKA_SYMBOL}<`);
  });

  it("renders formatted amounts", () => {
    expect(
      renderToStaticMarkup(<TakaAmount value="1250" locale="bn-BD" />)
    ).toContain(`${TAKA_SYMBOL}${toBanglaDigits("1,250")}`);
  });

  it("renders full text output", () => {
    expect(
      renderToStaticMarkup(<TakaText value={1250} locale="bn-BD" />)
    ).toContain(`${toBanglaDigits("1,250")} ${TAKA_NAME_BN}`);
  });

  it("honours custom screen-reader labels over spread aria-label props", () => {
    const markup = renderToStaticMarkup(
      <TakaAmount
        value={100}
        srLabel="Price in taka"
        aria-label="Overridden label"
        locale="en-BD"
      />
    );
    expect(markup).toContain('aria-label="Price in taka"');
  });

  it("uses aria-label when srLabel is omitted", () => {
    const markup = renderToStaticMarkup(
      <TakaSymbol aria-label="Currency sign" className="currency" />
    );
    expect(markup).toContain('aria-label="Currency sign"');
  });

  it("can render symbol-style amounts explicitly on TakaText", () => {
    const markup = renderToStaticMarkup(
      <TakaText value={99} locale="en-BD" variant="symbol" />
    );
    expect(markup).toContain(`>${TAKA_SYMBOL}99<`);
    expect(markup).toContain('aria-label="99 Taka"');
  });

  it("uses zeroFormat in the default aria-label when srLabel is omitted", () => {
    const markup = renderToStaticMarkup(
      <TakaAmount value={0} locale="en-BD" zeroFormat="Free" />
    );
    expect(markup).toContain(">Free<");
    expect(markup).toContain('aria-label="Free"');
  });

  it("passes string coercion flags into format and aria label (not the DOM)", () => {
    const markup = renderToStaticMarkup(
      <TakaAmount
        value="1e3"
        locale="en-BD"
        allowScientificNotation
      />
    );
    expect(markup).toContain("1,000");
    expect(markup).toContain('aria-label="1,000 Taka"');
    expect(markup).not.toMatch(/allowscientificnotation/i);
  });

  it("throws once on an invalid string value (single coercion path)", () => {
    expect(() =>
      renderToStaticMarkup(<TakaAmount value="not-a-number" locale="en-BD" />)
    ).toThrow(TypeError);
  });
});
