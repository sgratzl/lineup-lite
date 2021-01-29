import type React from 'react';

export function toPercent(v: number) {
  return `${Math.round(v * 1000) / 10}%`;
}

export function clsx(...args: (boolean | string | undefined | null)[]) {
  return args.filter(Boolean).join(' ');
}

export function mergeStyles(
  ...args: (React.CSSProperties | undefined | null | boolean)[]
): React.CSSProperties | undefined {
  const s = args.filter((d): d is React.CSSProperties => Boolean(d));
  if (s.length <= 1) {
    return s[0];
  }
  return Object.assign({}, ...s);
}

export function format<T>(value: T, formatter?: string | ((v: T) => string)): string {
  return typeof formatter === 'string' ? formatter : typeof formatter === 'function' ? formatter(value) : String(value);
}

export function i18n(pattern: string, ...args: string[]) {
  if (args.length === 0) {
    return pattern;
  }
  return pattern.replace(/\{(\d+)\}/g, (_, v) => args[Number.parseInt(v, 10)] ?? '?');
}

export function toLocaleString(v?: number | Date | null) {
  return v == null ? '' : v.toLocaleString();
}
