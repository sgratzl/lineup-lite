/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { CSSProperties, useMemo } from 'react';

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
