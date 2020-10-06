import {
  CategoricalStatsOptions,
  DateStatsOptions,
  NumberStatsOptions,
  TextStatsOptions,
} from '@lineup-lite/components';
import { Column } from 'react-table';
import {
  BarRenderer,
  BoxPlotRenderer,
  CategoricalHistogramRenderer,
  CategoricalRenderer,
  DateHistogramRenderer,
  DateRenderer,
  DateGroupRenderer,
  NumberHistogramRenderer,
  TextSummaryRenderer,
} from './renderers';
import { textStats, categoricalStats, dateStats, numberStats } from './stats';
import { rangeFilter, categoricalFilter } from './filters';
import { FullColumn } from './interfaces';
import { sortCompare, sortCategories } from './sort';
import { categoricalGroupBy, dateGroupBy, numberGroupBy, stringGroupBy } from './grouping';

export function statsAggregate<T>(v: T) {
  return v;
}

export function asStringColumn<D extends object, C extends Column<D>>(
  col: C,
  options?: TextStatsOptions
): C & Partial<FullColumn<D>> {
  return {
    Summary: TextSummaryRenderer,
    Aggregated: TextSummaryRenderer,
    Group: TextGroupRenderer,
    aggregate: statsAggregate,
    filter: 'text',
    stats: options ? textStats(options) : textStats,
    sortType: sortCompare,
    defaultCanSort: true,
    groupBy: stringGroupBy,
    ...col,
  };
}

export function asNumberColumn<D extends object, C extends Column<D>>(
  col: C,
  options?: NumberStatsOptions
): C & Partial<FullColumn<D>> {
  return {
    Cell: BarRenderer,
    Summary: NumberHistogramRenderer,
    Group: NumberGroupRenderer,
    Aggregated: NumberHistogramRenderer,
    aggregate: statsAggregate,
    filter: rangeFilter,
    stats: options ? numberStats(options) : numberStats,
    sortType: sortCompare,
    sortDescFirst: true,
    defaultCanGroupBy: false,
    groupBy: numberGroupBy,
    ...col,
  };
}

export function asNumberBoxPlotColumn<D extends object, C extends Column<D>>(
  col: C,
  options?: NumberStatsOptions
): C & Partial<FullColumn<D>> {
  return {
    Cell: BarRenderer,
    Summary: BoxPlotRenderer,
    Group: NumberGroupRenderer,
    Aggregated: BoxPlotRenderer,
    aggregate: statsAggregate,
    filter: rangeFilter,
    stats: options ? numberStats(options) : numberStats,
    sortType: sortCompare,
    sortDescFirst: true,
    defaultCanGroupBy: false,
    groupBy: numberGroupBy,
    ...col,
  };
}

export function asCategoricalColumn<D extends object, C extends Column<D>>(
  col: C,
  options?: CategoricalStatsOptions
): C & Partial<FullColumn<D>> {
  return {
    Cell: CategoricalRenderer,
    Summary: CategoricalHistogramRenderer,
    Group: CategoricalRenderer,
    Aggregated: CategoricalHistogramRenderer,
    aggregate: statsAggregate,
    filter: categoricalFilter,
    stats: options ? categoricalStats(options) : categoricalStats,
    sortType: options && options.categories ? sortCategories(options.categories) : sortCompare,
    defaultCanSort: true,
    groupBy: categoricalGroupBy,
    ...col,
  };
}

export function asDateColumn<D extends object, C extends Column<D>>(
  col: C,
  options?: DateStatsOptions
): C & Partial<FullColumn<D>> {
  return {
    Cell: DateRenderer,
    Summary: DateHistogramRenderer,
    Group: DateGroupRenderer,
    Aggregated: DateHistogramRenderer,
    aggregate: statsAggregate,
    filter: rangeFilter,
    stats: options ? dateStats(options) : dateStats,
    sortType: sortCompare,
    sortDescFirst: true,
    groupBy: dateGroupBy,
    ...col,
  };
}
