/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { CSSProperties, useMemo } from 'react';

export const EMPTY_OBJ = {}; // static object to avoid updates
export const EMPTY_ARR = [];

export function toPercent(v: number): string {
  return `${Math.round(v * 1000) / 10}%`;
}

export function clsx(...args: (boolean | string | undefined | null)[]): string {
  return args.filter(Boolean).join(' ');
}

export function mergeStyles(...args: (CSSProperties | undefined | null | boolean)[]): CSSProperties | undefined {
  const s = args.filter((d): d is CSSProperties => Boolean(d));
  if (s.length <= 1) {
    return s[0];
  }
  return Object.assign({}, ...s);
}

export function format<T>(value: T, formatter?: string | ((v: T) => string)): string {
  return typeof formatter === 'string' ? formatter : typeof formatter === 'function' ? formatter(value) : String(value);
}

export function i18n(pattern: string, ...args: unknown[]): string {
  if (args.length === 0) {
    return pattern;
  }
  return pattern.replace(/\{(\d+)\}/g, (_, v) => String(args[Number.parseInt(v, 10)] ?? '?'));
}

export function toLocaleString(v?: number | Date | null): string {
  return v == null ? '' : v.toLocaleString();
}

export function useI18N<T extends Record<string, string>>(
  original: T,
  overrides?: Partial<T>
): Record<keyof T, (...args: unknown[]) => string> {
  return useMemo(() => {
    const r = {} as Record<keyof T, (...args: unknown[]) => string>;
    for (const key of Object.keys(original) as (keyof T)[]) {
      const v = (overrides && overrides[key] != null ? overrides[key] : original[key]) as string;
      r[key] = i18n.bind(null, v);
    }
    return r;
  }, [original, overrides]);
}

export function hashCode(s: string) {
  // based on https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
  return s.split('').reduce((a, b) => {
    const next = (a << 5) - a + b.charCodeAt(0);
    return next & next;
  }, 0);
}

export function generateGradient(prefix: string, colors: (string | null | undefined)[], x1: number, x2: number) {
  if (colors.length === 0 || colors.every((d) => d === colors[0])) {
    // single color
    // eslint-disable-next-line prefer-destructuring
    return {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      value: colors[0]!,
      elem: <></>,
    };
  }
  const id = `${prefix}-${hashCode(colors.join(','))}`;
  return {
    value: `url('#${id}')`,
    elem: (
      <defs>
        <linearGradient id={id} x1={x1} x2={x2} gradientUnits="userSpaceOnUse">
          {colors.map((d, i) =>
            d == null ? null : <stop key={d} offset={toPercent(i / (colors.length - 1))} stopColor={d} />
          )}
        </linearGradient>
      </defs>
    ),
  };
}

export function ZeroWidth() {
  return <span>{'​' /* zero space width character for proper height */}</span>;
}
