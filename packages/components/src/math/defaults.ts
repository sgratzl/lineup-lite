import { schemeTableau10 } from 'd3-scale-chromatic';

/**
 * simple scale option clamping between 0 and 1
 */
export function defaultScale(v: number): number {
  return Math.max(Math.min(v, 1), 0);
}

/**
 * a color scale returning a constant value
 */
export function defaultConstantColorScale(): string {
  return 'rgba(0,0,0,0.25)';
}

/**
 * a color scale returning a constant value
 */
export function defaultConstantDarkColorScale(): string {
  return 'rgba(255,255,255,0.25)';
}

/**
 * inverts the give color scale by handing in an inverted value (1-v)
 */
export function invertColorScale(scale: (v: number) => string): (v: number) => string {
  return (v: number) => scale(1 - v);
}

/**
 * default numeric color scale converting a number between 0..1 to a color
 */
export function defaultColorScale(v: number): string {
  const maxL = 0.9;
  const minL = 0.23;
  return `hsl(206, 64%, ${Math.round(100 * (v * (maxL - minL) + minL))}%)`;
}

/**
 * default numeric color scale converting a number between 0..1 to a color for dark themes
 */
export const defaultDarkColorScale = invertColorScale(defaultColorScale);

/**
 * helper function to assign categorical values to colors
 * @param colors color array to assign
 * @param start offset in the array to start
 */
export function autoAssignColors(colors: readonly string[], start = 0): (v: string) => string {
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

/**
 * default
 */
export function defaultCategoricalColorScale(): (v: string) => string {
  return autoAssignColors(schemeTableau10, 1);
}
