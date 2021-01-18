import type React from 'react';

export function toPercent(v: number) {
  return `${Math.round(v * 1000) / 10}%`;
}

export function cslx(...args: (boolean | string | undefined | null)[]) {
  return args.filter(Boolean).join(' ');
}

export function mergeStyles(...args: (React.CSSProperties | undefined | null)[]): React.CSSProperties | undefined {
  const s = args.filter((d): d is React.CSSProperties => d != null);
  if (s.length <= 1) {
    return s[0];
  }
  return Object.assign({}, ...s);
}
