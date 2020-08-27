export function toPercent(v: number) {
  return `${Math.round(v * 1000) / 10}%`;
}

export function cslx(...args: (boolean | string | undefined | null)[]) {
  return args.filter(Boolean).join(' ');
}
