/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

export function normalize(min: number, max: number): (v: number) => number {
  const range = max - min;
  return (v: number) => (range === 0 ? 0.5 : (v - min) / range);
}
/**
 * helper function to invert the normalization to a given min/max range
 */
export function deNormalize(min: number, max: number): (v: number) => number {
  const range = max - min;
  return (v: number) => v * range + min;
}
