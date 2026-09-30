// Figures on the homepage, such as "80,000+" or "~95%", that count up as
// they come into view (src/lib/utils/countUp.ts). Kept free of the DOM so it
// can be unit-tested with `node --test`.

interface Figure {
  // The text before and after the number: "~" and "%" in "~95%".
  prefix: string;
  value: number;
  suffix: string;
}

export function parseFigure(text: string): Figure | undefined {
  const match = text.match(/^(\D*)([\d,]+)(\D*)$/);
  if (!match) return undefined;
  const [, prefix, digits, suffix] = match;
  return { prefix, value: Number(digits.replaceAll(",", "")), suffix };
}

// The figure's text `progress` of the way up from zero, from 0 to 1.
export function figureAt(figure: Figure, progress: number): string {
  const value = Math.round(figure.value * progress).toLocaleString("en-US");
  return `${figure.prefix}${value}${figure.suffix}`;
}
