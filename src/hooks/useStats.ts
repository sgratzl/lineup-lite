import {
  HeaderProps,
  Hooks,
  IdType,
  Renderer,
  TableInstance,
  UseFiltersInstanceProps,
  ensurePluginOrder,
  UseGroupByInstanceProps,
  CellProps,
} from 'react-table';

export type UseStatsOptions<D extends object> = Partial<{
  manualStats: boolean;
  autoResetStats?: boolean;
}>;

export interface UseStatsState<D extends object> {
  Stats: Stats<D>;
}

export type UseStatsColumnOptions<D extends object> = Partial<{
  Summary: Renderer<StatsProps<D>>;
  stats: StatsType;
}>;

export interface UseStatsInstanceProps {}

export interface UseStatsColumnProps {
  setStats: (updater: ((statsValue: StatsValue) => StatsValue) | StatsValue) => void;
  statsValue: StatsValue;
  preFilterStatsValue?: StatsValue;
}

export type StatsProps<D extends object> = HeaderProps<D> & { column: UseStatsColumnProps };
export type StatsCellProps<D extends object> = CellProps<D> & { column: UseStatsColumnProps };
export type StatsValue = any;
export type Stats<D extends object> = Array<{ id: IdType<D>; value: StatsValue }>;

export interface StatsType {
  (values: readonly any[], preFilterStats?: any): any;
}

export default function useStats<D extends object = {}>(hooks: Hooks<D>) {
  hooks.useInstance.push(useInstance);
}
useStats.pluginName = 'useStats';

function useInstance<D extends object>(instance: TableInstance<D>) {
  ensurePluginOrder(instance.plugins, ['useFilters', 'useGroupBy'], 'useStats');

  const extendedInstance = (instance as unknown) as TableInstance<D> &
    UseFiltersInstanceProps<D> &
    UseGroupByInstanceProps<D>;

  instance.allColumns.forEach((col) => {
    // TODO do proper options
    const extended = (col as unknown) as UseStatsColumnProps & UseStatsColumnOptions<D>;
    if (!extended.stats) {
      extended.statsValue = null;
      return;
    }

    const flat = extendedInstance.nonGroupedFlatRows ?? instance.flatRows;
    const values = flat.map((row) => row.values[col.id]);
    const preFilteredFlatRows = extendedInstance.preFilteredFlatRows;
    extended.preFilterStatsValue = preFilteredFlatRows
      ? extended.stats(preFilteredFlatRows.map((row) => row.values[col.id]))
      : undefined;
    extended.statsValue = extended.stats(values, extended.preFilterStatsValue);
  });
}
