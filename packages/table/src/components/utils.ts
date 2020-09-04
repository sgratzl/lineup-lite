export function clsx(...args: (boolean | string | undefined | null)[]) {
  return args.filter(Boolean).join(' ');
}
