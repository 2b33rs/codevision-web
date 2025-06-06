import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cmykToRgb(cmyk: string): [number, number, number] {
  const match = cmyk.match(/cmyk\((\d+)%?,(\d+)%?,(\d+)%?,(\d+)%?\)/i);
  if (!match) return [0, 0, 0];

  const [, c, m, y, k] = match.map(Number);
  const cDec = c / 100;
  const mDec = m / 100;
  const yDec = y / 100;
  const kDec = k / 100;

  const r = 255 * (1 - cDec) * (1 - kDec);
  const g = 255 * (1 - mDec) * (1 - kDec);
  const b = 255 * (1 - yDec) * (1 - kDec);

  return [Math.round(r), Math.round(g), Math.round(b)];
}