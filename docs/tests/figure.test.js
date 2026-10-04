import { test } from "node:test";
import assert from "node:assert/strict";

import { figureAt, parseFigure } from "../src/lib/utils/figure.ts";

test("a figure keeps the text around its number", () => {
  assert.deepEqual(parseFigure("80,000+"), {
    prefix: "",
    value: 80000,
    suffix: "+",
  });
  assert.deepEqual(parseFigure("~95%"), {
    prefix: "~",
    value: 95,
    suffix: "%",
  });
  assert.deepEqual(parseFigure("99%+"), {
    prefix: "",
    value: 99,
    suffix: "%+",
  });
});

test("text without a number is not a figure", () => {
  assert.equal(parseFigure("Pro"), undefined);
});

test("a figure counts up from zero with its separators", () => {
  const figure = parseFigure("80,000+");
  assert.equal(figureAt(figure, 0), "0+");
  assert.equal(figureAt(figure, 0.5), "40,000+");
  assert.equal(figureAt(figure, 1), "80,000+");
});

test("counting rounds to whole numbers", () => {
  assert.equal(figureAt(parseFigure("~24%"), 0.51), "~12%");
});
