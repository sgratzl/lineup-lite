import { interpolateBlues, schemeTableau10 } from 'd3-scale-chromatic';

export function defaultScale(v: number) {
  return Math.max(Math.min(v, 1), 0);
}

export function defaultConstantColorScale() {
  return 'rgba(0,0,0,0.25)';
}

export function invertColorScale(scale: (v: number) => string) {
  return (v: number) => scale(1 - v);
}

export const defaultColorScale = invertColorScale(interpolateBlues);

export function autoAssignColors(colors: readonly string[], start = 0) {
  let i = start;
  const map = new Map<string, string>();
  return (c: string) => {
    if (map.has(c)) {
      return map.get(c)!;
    }
    const color = colors[i++ % colors.length];
    map.set(c, color);
    return color;
  };
}

export function defaultCategoricalColorScale() {
  return autoAssignColors(schemeTableau10, 1);
}
