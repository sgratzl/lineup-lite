import React from 'react';

export function clsx(...args: (boolean | string | undefined | null)[]) {
  return args.filter(Boolean).join(' ');
}

export function mergeStyles(...args: (React.CSSProperties | undefined | null)[]): React.CSSProperties | undefined {
  const s = args.filter((d): d is React.CSSProperties => d != null);
  if (s.length <= 1) {
    return s[0];
  }
  return Object.assign({}, ...s);
}
