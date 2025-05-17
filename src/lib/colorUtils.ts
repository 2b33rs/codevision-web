export type CMYK = { c: number; m: number; y: number; k: number };

export function parseCMYK(value: string | undefined | null): CMYK {
  const match = (value ?? "").match(/(\d{1,3})%/g);
  if (!match || match.length !== 4) return { c: 0, m: 0, y: 0, k: 0 };
  const [c, m, y, k] = match.map((v) => parseInt(v.replace("%", ""), 10));
  return { c, m, y, k };
}

export function toCMYKString(cmyk: CMYK): string {
  return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
}

export function cmykToRGB(cmyk: CMYK): string {
  const { r, g, b } = cmykToRGBObject(cmyk);
  return `rgb(${r}, ${g}, ${b})`;
}

export function cmykToRGBObject({ c, m, y, k }: CMYK): {
  r: number;
  g: number;
  b: number;
} {
  const r = 255 * (1 - c / 100) * (1 - k / 100);
  const g = 255 * (1 - m / 100) * (1 - k / 100);
  const b = 255 * (1 - y / 100) * (1 - k / 100);
  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
  };
}

export function getTextColorForBackground({
  r,
  g,
  b,
}: {
  r: number;
  g: number;
  b: number;
}): string {
  // simple luminance calculation for contrast
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 186 ? "black" : "white";
}
