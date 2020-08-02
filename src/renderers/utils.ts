import { StatsProps } from '../hooks/useStats';

export function toPercent(v: number) {
  return `${Math.round(v * 1000) / 10}%`;
}

function isValueArray<T>(props: any): props is { value: readonly T[] } {
  return Array.isArray(props as { value: readonly T[] });
}

export function extractStats<S, T>(
  props: { value: readonly T[] } | StatsProps<any>,
  statsGen: (arr: readonly T[]) => S
): S {
  if (isValueArray(props)) {
    return statsGen(props.value);
  }
  if (Array.isArray(props.column.statsValue)) {
    return statsGen(props.column.statsValue);
  }
  if (props.column.statsValue) {
    return props.column.statsValue as S;
  }
  const values = props.flatRows.map((row) => row.values[props.column.id]);
  return statsGen(values);
}

export function resolve<T>(directValue: T | undefined, globalValue: T | undefined, defaultValue: () => T) {
  if (directValue != null) {
    return directValue;
  }
  if (globalValue != null) {
    return globalValue;
  }
  return defaultValue();
}
