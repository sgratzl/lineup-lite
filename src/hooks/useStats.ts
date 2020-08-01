import { Hooks, TableState, ActionType, TableInstance, Row, MetaBase, Renderer, IdType, HeaderProps, ColumnInstance, Meta, Column } from 'react-table';


export type UseStatsOptions<D extends object> = Partial<{
    manualStats: boolean;
    disableStats: boolean;
    statsTypes: StatsTypes<D>;
    autoResetStats?: boolean;
}>;

export interface UseStatsState<D extends object> {
    Stats: Stats<D>;
}

export type UseStatsColumnOptions<D extends object> = Partial<{
    Summary: Renderer<StatsProps<D>>;
    disableStats: boolean;
    stats: StatsType<D>;
}>;

export interface UseStatsInstanceProps<D extends object> {

}

export interface UseStatsColumnProps<D extends object> {
    setStats: (updater: ((statsValue: StatsValue) => StatsValue) | StatsValue) => void;
    statsValue: StatsValue;
}

export type StatsProps<D extends object> = HeaderProps<D> & { column: UseStatsColumnProps<D> };
export type StatsValue = any;
export type Stats<D extends object> = Array<{ id: IdType<D>; value: StatsValue }>;
export type StatsTypes<D extends object> = Record<string, StatsValue>;

export interface StatsType<D extends object> {
    (rows: Array<Row<D>>, columnIds: Array<IdType<D>>, statsValue: StatsValue): Array<Row<D>>;
}

export default function useStats<D extends object = {}>(hooks: Hooks<D>) {
    hooks.stateReducers.push(reducer);
    hooks.useInstance.push(useInstance);
}
useStats.pluginName = 'useStats';

function reducer<D extends object>(state: TableState<D>, action: ActionType, previousState?: TableState<D>, instance?: TableInstance<D>) {
    return state;
}

function useInstance<D extends object>(instance: TableInstance<D>) {
    instance.allColumns.forEach((col) => {

    })
}


