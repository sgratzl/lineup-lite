/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
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
    const elem = map.get(c);
    if (elem) {
      return elem;
    }
    const color = colors[i % colors.length];
    i += 1;
    map.set(c, color);
    return color;
  };
}

export const schemeTableau10 = [
  '#4e79a7',
  '#e15759',
  '#76b7b2',
  '#59a14f',
  '#edc949',
  '#af7aa1',
  '#ff9da7',
  '#9c755f',
  '#bab0ab',
  '#f28e2c',
];
/**
 * default
 */
export function defaultCategoricalColorScale(): (v: string) => string {
  return autoAssignColors(schemeTableau10, 0);
}
