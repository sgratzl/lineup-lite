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
  DateHistogramRenderer,
  DateRenderer,
  NumberHistogramRenderer,
  TextSummaryRenderer,
} from './renderers';
import { textStats, categoricalStats, dateStats, numberStats } from './stats';
import { rangeFilter, categoricalFilter } from './filters';

function identity<T>(v: T) {
  return v;
}

export function asStringColumn<D extends object, C extends Column<D>>(col: C, options?: TextStatsOptions) {
  return {
    ...col,
    Summary: TextSummaryRenderer,
    Aggregated: TextSummaryRenderer,
    aggregate: identity,
    filter: 'text',
    stats: options ? textStats(options) : textStats,
  };
}

export function asNumberColumn<D extends object, C extends Column<D>>(col: C, options?: NumberStatsOptions) {
  return {
    ...col,
    Cell: BarRenderer,
    Summary: NumberHistogramRenderer,
    Aggregated: NumberHistogramRenderer,
    aggregate: identity,
    filter: rangeFilter,
    stats: options ? numberStats(options) : numberStats,
  };
}

export function asNumberBoxPlotColumn<D extends object, C extends Column<D>>(col: C, options?: NumberStatsOptions) {
  return {
    ...col,
    Cell: BarRenderer,
    Summary: BoxPlotRenderer,
    Aggregated: BoxPlotRenderer,
    aggregate: identity,
    filter: rangeFilter,
    stats: options ? numberStats(options) : numberStats,
  };
}

export function asCategoricalColumn<D extends object, C extends Column<D>>(col: C, options?: CategoricalStatsOptions) {
  return {
    ...col,
    Cell: BarRenderer,
    Summary: CategoricalHistogramRenderer,
    Aggregated: CategoricalHistogramRenderer,
    aggregate: identity,
    filter: categoricalFilter,
    stats: options ? categoricalStats(options) : categoricalStats,
  };
}

export function asDateColumn<D extends object, C extends Column<D>>(col: C, options?: DateStatsOptions) {
  return {
    ...col,
    Cell: DateRenderer,
    Summary: DateHistogramRenderer,
    Aggregated: DateHistogramRenderer,
    aggregate: identity,
    filter: rangeFilter,
    stats: options ? dateStats(options) : dateStats,
  };
}
