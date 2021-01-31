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
  CategoricalSetRenderer,
  CategoricalSetHistogramRenderer,
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
} from './sort';
import { categoricalGroupBy, dateGroupBy, numberGroupBy, textGroupBy, categoricalSetGroupBy } from './grouping';
import { statsAggregate } from './hooks';

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
