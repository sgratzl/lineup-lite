import type {
  CategoricalStatsOptions,
  DateStatsOptions,
  NumberStatsOptions,
  TextStatsOptions,
} from '@lineup-lite/components';
import type { Column } from 'react-table';
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
} from './renderers';
import { textStats, categoricalStats, dateStats, numberStats } from './stats';
import { rangeFilter, categoricalFilter } from './filters';
import type { LineUpLiteColumn } from './interfaces';
import { sortCompare, sortCategories } from './sort';
import { categoricalGroupBy, dateGroupBy, numberGroupBy, textGroupBy } from './grouping';

export function statsAggregate<T>(v: T) {
  return v;
}

function guessName(acc: string) {
  return acc
    .replace(/[-_ ]+/gm, ' ')
    .split(/(?=[A-Z ])/)
    .map((d) => (d.length <= 1 ? d : `${d[0]}${d.slice(1)}`))
    .join(' ');
}

function asColumn<D extends object, C extends Column<D> = Column<D>>(col: C | keyof D): C {
  if (typeof col === 'string') {
    return {
      Header: guessName(col),
      accessor: col as string,
    } as C;
  }
  return col as C;
}

export function asTextColumn<D extends object, C extends Column<D> = Column<D>>(
  col: C | keyof D,
  options?: TextStatsOptions
): LineUpLiteColumn<D> {
  return ({
    Summary: TextSummaryRenderer,
    Aggregated: TextSummaryRenderer,
    Group: GroupValueRenderer,
    aggregate: statsAggregate,
    filter: 'text',
    stats: textStats(options),
    sortType: sortCompare,
    defaultCanSort: true,
    groupBy: textGroupBy,
    ...asColumn<D, C>(col),
  } as unknown) as LineUpLiteColumn<D>;
}

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
    sortType: sortCompare,
    sortDescFirst: true,
    defaultCanGroupBy: false,
    groupBy: numberGroupBy,
    ...asColumn<D, C>(col),
  } as unknown) as LineUpLiteColumn<D>;
}

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
    sortType: sortCompare,
    sortDescFirst: true,
    defaultCanGroupBy: false,
    groupBy: numberGroupBy,
    ...asColumn<D, C>(col),
  } as unknown) as LineUpLiteColumn<D>;
}

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
    sortType: options && options.categories ? sortCategories(options.categories) : sortCompare,
    defaultCanSort: true,
    groupBy: categoricalGroupBy,
    ...asColumn<D, C>(col),
  } as unknown) as LineUpLiteColumn<D>;
}

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
    sortType: sortCompare,
    sortDescFirst: true,
    groupBy: dateGroupBy,
    ...asColumn<D, C>(col),
  } as unknown) as LineUpLiteColumn<D>;
}
