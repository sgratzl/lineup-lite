/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import {
  CategoricalStatsOptions,
  DateStatsOptions,
  NumberStatsOptions,
  TextStatsOptions,
  defaultConstantColorScale,
} from '@lineup-lite/components';
import type { Accessor, Column } from 'react-table';
import {
  BarRenderer,
  BoxPlotRenderer,
  CategoricalHistogramRenderer,
  CategoricalRenderer,
  DateHistogramRenderer,
  DateRenderer,
  NumberHistogramRenderer,
  GroupValueRenderer,
  TextSummaryRenderer,
  CategoricalSetRenderer,
  CategoricalSetHistogramRenderer,
  HeatMap1DRenderer,
  BoxPlotArrayRenderer,
  TextRenderer,
  StackedBarRenderer,
  computeStackedValue,
} from './renderers';
import { textStats, categoricalStats, dateStats, numberStats } from './stats';
import { rangeFilter, categoricalFilter, categoricalSetFilter } from './filters';
import type { LineUpLiteColumn } from './interfaces';
import {
  sortCompare,
  categoricalSort,
  sortSplitter,
  numberGroupCompare,
  textGroupCompare,
  categoricalGroupCompare,
  dateGroupCompare,
  categoricalSetCompare,
  categoricalSetGroupCompare,
  numbersCompare,
} from './sort';
import { categoricalGroupBy, dateGroupBy, numberGroupBy, textGroupBy, categoricalSetGroupBy } from './grouping';
import { statsAggregate, statsAggregateArray } from './hooks';

function guessName(acc: string) {
  return acc
    .replace(/[-_ ]+/gm, ' ')
    .split(/(?=[A-Z ])/)
    .map((d) => (d.length <= 1 ? d : `${d[0].toUpperCase()}${d.slice(1)}`))
    .join(' ');
}

export function asColumn<D extends object, C extends Column<D> = Column<D>>(col: C | keyof D): C {
  if (typeof col === 'string') {
    return {
      Header: guessName(col),
      accessor: col as string,
    } as C;
  }
  return col as C;
}

/**
 * defines a text column
 * @param col property key or partial column Header and accessor
 * @param options additional options for statistics
 */
export function asTextColumn<D extends object, C extends Column<D> = Column<D>>(
  col: C | keyof D,
  options?: TextStatsOptions
): LineUpLiteColumn<D> {
  return ({
    Cell: TextRenderer,
    Summary: TextSummaryRenderer,
    Aggregated: TextSummaryRenderer,
    Group: GroupValueRenderer,
    aggregate: statsAggregate,
    filter: 'text',
    stats: textStats(options),
    sortType: sortSplitter(sortCompare, textGroupCompare),
    defaultCanSort: true,
    groupBy: textGroupBy,
    canHide: false,
    ...asColumn<D, C>(col),
  } as unknown) as LineUpLiteColumn<D>;
}

/**
 * defines a number column
 * @param col property key or partial column Header and accessor
 * @param options additional options for statistics
 */
export function asNumberColumn<D extends object, C extends Column<D> = Column<D>>(
  col: C | keyof D,
  options?: NumberStatsOptions
): LineUpLiteColumn<D> {
  return ({
    Cell: BarRenderer,
    Summary: NumberHistogramRenderer,
    Group: GroupValueRenderer,
    Aggregated: NumberHistogramRenderer,
    aggregate: statsAggregate,
    filter: rangeFilter,
    stats: numberStats(options),
    sortType: sortSplitter(sortCompare, numberGroupCompare),
    sortDescFirst: true,
    defaultCanGroupBy: false,
    groupBy: numberGroupBy,
    canHide: false,
    ...asColumn<D, C>(col),
  } as unknown) as LineUpLiteColumn<D>;
}

/**
 * defines a number array column, each value is a number array
 * @param col property key or partial column Header and accessor
 * @param options additional options for statistics
 */
export function asNumbersColumn<D extends object, C extends Column<D> = Column<D>>(
  col: C | keyof D,
  options?: NumberStatsOptions
): LineUpLiteColumn<D> {
  return ({
    Cell: HeatMap1DRenderer,
    Summary: NumberHistogramRenderer,
    Group: GroupValueRenderer,
    Aggregated: BoxPlotArrayRenderer,
    aggregate: statsAggregateArray,
    filter: rangeFilter,
    stats: numberStats(options),
    sortType: sortSplitter(numbersCompare, numberGroupCompare),
    sortDescFirst: true,
    defaultCanGroupBy: false,
    groupBy: numberGroupBy,
    canHide: false,
    ...asColumn<D, C>(col),
  } as unknown) as LineUpLiteColumn<D>;
}

/**
 * defines a number column that is rendered as boxplot
 * @param col property key or partial column Header and accessor
 * @param options additional options for statistics
 */
export function asNumberBoxPlotColumn<D extends object, C extends Column<D> = Column<D>>(
  col: C | keyof D,
  options?: NumberStatsOptions
): LineUpLiteColumn<D> {
  return ({
    Cell: BarRenderer,
    Summary: BoxPlotRenderer,
    Group: GroupValueRenderer,
    Aggregated: BoxPlotRenderer,
    aggregate: statsAggregate,
    filter: rangeFilter,
    stats: numberStats(options),
    sortType: sortSplitter(sortCompare, numberGroupCompare),
    sortDescFirst: true,
    defaultCanGroupBy: false,
    groupBy: numberGroupBy,
    canHide: false,
    ...asColumn<D, C>(col),
  } as unknown) as LineUpLiteColumn<D>;
}

/**
 * defines a categorical column
 * @param col property key or partial column Header and accessor
 * @param options additional options for statistics
 */
export function asCategoricalColumn<D extends object, C extends Column<D> = Column<D>>(
  col: C | keyof D,
  options?: CategoricalStatsOptions
): LineUpLiteColumn<D> {
  return ({
    Cell: CategoricalRenderer,
    Summary: CategoricalHistogramRenderer,
    Group: CategoricalRenderer,
    Aggregated: CategoricalHistogramRenderer,
    aggregate: statsAggregate,
    filter: categoricalFilter,
    stats: categoricalStats(options),
    sortType: sortSplitter(
      options && options.categories ? categoricalSort(options.categories) : sortCompare,
      categoricalGroupCompare
    ),
    defaultCanSort: true,
    groupBy: categoricalGroupBy,
    canHide: false,
    ...asColumn<D, C>(col),
  } as unknown) as LineUpLiteColumn<D>;
}

/**
 * defines a categorical set column
 * @param col property key or partial column Header and accessor
 * @param options additional options for statistics
 */
export function asCategoricalSetColumn<D extends object, C extends Column<D> = Column<D>>(
  col: C | keyof D,
  options?: CategoricalStatsOptions
): LineUpLiteColumn<D> {
  return ({
    Cell: CategoricalSetRenderer,
    Summary: CategoricalSetHistogramRenderer,
    Group: CategoricalSetRenderer,
    Aggregated: CategoricalSetHistogramRenderer,
    aggregate: statsAggregate,
    filter: categoricalSetFilter,
    stats: categoricalStats(options),
    sortType: sortSplitter(
      options && options.categories ? categoricalSetCompare(options.categories) : categoricalSetCompare(),
      categoricalSetGroupCompare
    ),
    defaultCanSort: true,
    groupBy: categoricalSetGroupBy,
    canHide: false,
    ...asColumn<D, C>(col),
  } as unknown) as LineUpLiteColumn<D>;
}

/**
 * defines a date column
 * @param col property key or partial column Header and accessor
 * @param options additional options for statistics
 */
export function asDateColumn<D extends object, C extends Column<D> = Column<D>>(
  col: C | keyof D,
  options?: DateStatsOptions
): LineUpLiteColumn<D> {
  return ({
    Cell: DateRenderer,
    Summary: DateHistogramRenderer,
    Group: GroupValueRenderer,
    Aggregated: DateHistogramRenderer,
    aggregate: statsAggregate,
    filter: rangeFilter,
    stats: dateStats(options),
    sortType: sortSplitter(sortCompare, dateGroupCompare),
    sortDescFirst: true,
    groupBy: dateGroupBy,
    canHide: false,
    ...asColumn<D, C>(col),
  } as unknown) as LineUpLiteColumn<D>;
}

/**
 * defines a number column
 * @param col property key or partial column Header and accessor
 * @param options additional options for statistics
 */
export function asStackedNumberColumn<D extends object, C extends Column<D> = Column<D>>(
  col: C | string,
  stack: readonly { col: keyof D | Accessor<D>; weight: number; color?: string }[],
  options?: NumberStatsOptions & { colors?: (v: string) => string }
): LineUpLiteColumn<D> {
  return ({
    Cell: StackedBarRenderer,
    Summary: NumberHistogramRenderer,
    Group: GroupValueRenderer,
    Aggregated: NumberHistogramRenderer,
    aggregate: statsAggregate,
    filter: rangeFilter,
    stats: numberStats({ color: defaultConstantColorScale, ...(options ?? {}) }),
    sortType: sortSplitter(sortCompare, numberGroupCompare),
    sortDescFirst: true,
    defaultCanGroupBy: false,
    groupBy: numberGroupBy,
    canHide: false,
    id: typeof col == 'string' ? col : col.id ?? col.Header!,
    ...(typeof col === 'string' ? { Header: col } : col),
    accessor: computeStackedValue(stack, options?.colors),
  } as unknown) as LineUpLiteColumn<D>;
}
