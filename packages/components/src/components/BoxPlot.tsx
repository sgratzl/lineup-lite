import React, { useCallback, useMemo } from 'react';
import type { INumberStats } from '../math/numberStatsGenerator';
import type { IBoxPlot } from '@sgratzl/boxplots';
import { NumberStatsWrapper } from './NumberStatsWrapper';
import { FilterRangeWrapper, FilterRangeSliderProps } from './FilterRange';
import type { CommonProps } from './common';
import { clsx, i18n as t } from './utils';

export const BOXPLOT_I18N_EN = {
  boxplotMinimum: 'Minimum: {0}',
  boxplot25Quantile: '25% Quantile: {0}',
  boxplotMedian: 'Median: {0}',
  boxplotMean: 'Mean: {0}',
  boxplot75Quantile: '75% Quantile: {0}',
  boxplotMaximum: 'Maximum: {0}',
  boxplotNrItems: '# Items: {0}',
};

export interface BoxPlotChartProps extends CommonProps {
  /**
   * the number boxplot statistics
   */
  s: INumberStats;
  /**
   * the optional stats containing the unfiltered stats in case of filtering operation applied
   * to the regular one
   */
  preFilter?: Omit<IBoxPlot, 'items'>;

  i18n?: Partial<typeof BOXPLOT_I18N_EN>;
}

function generatePath(
  stats: Pick<IBoxPlot, 'q1' | 'q3' | 'whiskerHigh' | 'whiskerLow' | 'median'>,
  s: (v: number) => number,
  h: number,
  padding: number
) {
  const cy = h / 2;
  const q1 = s(stats.q1);
  const q3 = s(stats.q3);
  const boxHeight = h - padding * 2;
  const whiskerLow = `M ${s(stats.whiskerLow)} 0 l 0 ${h} l 0 -${cy} L ${q1} ${cy}`;
  const whiskerHigh = `M ${s(stats.whiskerHigh)} 0 l 0 ${h} l 0 -${cy} L ${q3} ${cy}`;
  const median = `M ${s(stats.median)} ${padding} l 0 ${boxHeight}`;

  return `${whiskerLow} ${whiskerHigh} ${median}`;
}

function generateTitle(s: INumberStats, pre: Omit<IBoxPlot, 'items'> | undefined, i18n: typeof BOXPLOT_I18N_EN) {
  const p = (v: number) => `/${s.format(v)}`;
  return `${t(i18n.boxplotMinimum, `${s.format(s.min)}${pre ? p(pre.min) : ''}`)}
${t(i18n.boxplot25Quantile, `${s.format(s.q1)}${pre ? p(pre.q1) : ''}`)}
${t(i18n.boxplotMedian, `${s.format(s.median)}${pre ? p(pre.median) : ''}`)}
${t(i18n.boxplotMean, `${s.format(s.mean)}${pre ? p(pre.mean) : ''}`)}
${t(i18n.boxplot75Quantile, `${s.format(s.q3)}${pre ? p(pre.q3) : ''}`)}
${t(i18n.boxplotMaximum, `${s.format(s.max)}${pre ? p(pre.max) : ''}`)}
${t(i18n.boxplotNrItems, `${s.count.toLocaleString()}${pre ? `/${pre.count.toLocaleString()}` : ''}`)}`;
}

/**
 * renders a boxplot as a SVG chart
 */
export function BoxPlotChart(props: BoxPlotChartProps) {
  const s = props.s;
  const pre = props.preFilter;
  const i18n = useMemo(
    () => ({
      ...BOXPLOT_I18N_EN,
      ...(props.i18n ?? {}),
    }),
    [props.i18n]
  );
  const boxPadding = 2;
  const scale = useCallback((v: number) => Math.round(s.scale(v) * 1000) / 10, [s]);
  const outlierRadius = 4;
  const height = 20;

  const generateBoxPlot = (b: Omit<IBoxPlot, 'items'>) => {
    const cy = height / 2;
    const path = generatePath(b, scale, height, boxPadding);
    return (
      <>
        <rect
          x={scale(b.q1)}
          y={boxPadding}
          height={height - boxPadding * 2}
          width={scale(b.median) - scale(b.q1)}
          className="lt-boxplot-box"
          style={{ fill: s.color(s.scale((b.median + b.q1) / 2)) }}
        />
        <rect
          x={scale(b.median)}
          y={boxPadding}
          height={height - boxPadding * 2}
          width={scale(b.q3) - scale(b.median)}
          style={{ fill: s.color(s.scale((b.median + b.q3) / 2)) }}
          className="lt-boxplot-box"
        />
        <path d={`M${scale(b.mean)} ${boxPadding} l 0 ${height - boxPadding * 2}`} className="lt-boxplot-mean" />
        <path d={path} className="lt-boxplot-frame" />
        {b.outlier.map((o) => (
          <path
            className="lt-boxplot-outlier"
            key={o}
            d={`M${scale(o)} ${cy - outlierRadius} l 0 ${2 * outlierRadius}`}
          >
            <title>{s.format(o)}</title>
          </path>
        ))}
      </>
    );
  };

  const offset = pre != null ? height * 0.1 : 0;
  return (
    <svg
      viewBox={`0 0 100 ${height + offset}`}
      className={props.className}
      style={props.style}
      preserveAspectRatio="none"
    >
      <title>{generateTitle(s, pre, i18n)}</title>
      {pre != null && pre.count > s.count && (
        <g className="lt-boxplot-pre" transform={`translate(0,${offset})`}>
          {generateBoxPlot(pre)}
        </g>
      )}
      {generateBoxPlot(s)}
    </svg>
  );
}

export interface BoxPlotProps extends CommonProps {
  /**
   * the stats to render
   */
  s: INumberStats;
  /**
   * the optional stats containing the unfiltered stats in case of filtering operation applied
   * to the regular one
   */
  preFilter?: Omit<IBoxPlot, 'items'>;
  /**
   * whether to render it as a summary including labels
   */
  summary?: boolean;

  i18n?: Partial<typeof BOXPLOT_I18N_EN>;
}

/**
 * renders a boxplot
 */
export function BoxPlot(props: BoxPlotProps) {
  return (
    <NumberStatsWrapper
      className={clsx('lt-boxplot', props.className)}
      s={props.s}
      summary={props.summary}
      style={props.style}
    >
      <BoxPlotChart {...props} className={clsx('lt-boxplot-wrapper', props.className)} />
    </NumberStatsWrapper>
  );
}

export type FilterRangeBoxPlotProps = BoxPlotProps &
  FilterRangeSliderProps<number> & {
    i18n?: FilterRangeSliderProps<number>['i18n'] & BoxPlotProps['i18n'];
  };

/**
 * renders a boxplot along with a range filter
 */
export function FilterRangeBoxPlot(props: FilterRangeBoxPlotProps) {
  return (
    <FilterRangeWrapper summary={props.summary} {...props} className={clsx('lt-boxplot', props.className)}>
      <BoxPlotChart {...props} className={clsx('lt-boxplot-wrapper', props.className)} />
    </FilterRangeWrapper>
  );
}
