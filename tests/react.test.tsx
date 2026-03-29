import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TakaAmount, TakaSymbol, TakaText } from "../src/react";

describe("React helpers", () => {
  it("renders the symbol component", () => {
    expect(renderToStaticMarkup(<TakaSymbol className="currency" />)).toBe(
      '<span aria-label="Bangladeshi Taka" class="currency">\u09f3</span>'
    );
  });

  it("renders formatted amounts", () => {
    expect(
      renderToStaticMarkup(<TakaAmount value={1250} locale="bn-BD" />)
    ).toContain("৳১,২৫০");
  });

  it("renders full text output", () => {
    expect(
      renderToStaticMarkup(<TakaText value={1250} locale="bn-BD" />)
    ).toContain("১,২৫০ টাকা");
  });
});
