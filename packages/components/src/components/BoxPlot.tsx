/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useCallback } from 'react';
import type { IBoxPlot } from '@sgratzl/boxplots';
import { NumberStatsWrapper } from './NumberStatsWrapper';
import { FilterRangeWrapper, FilterRangeSliderProps } from './FilterRange';
import type { CommonProps } from './common';
import { clsx, useI18N, ZeroWidth } from './utils';

export type { IBoxPlot } from '@sgratzl/boxplots';

export const BOXPLOT_I18N_EN = {
  boxplotMinimum: 'Minimum: {0}',
  boxplot25Quantile: '25% Quantile: {0}',
  boxplotMedian: 'Median: {0}',
  boxplotMean: 'Mean: {0}',
  boxplot75Quantile: '75% Quantile: {0}',
  boxplotMaximum: 'Maximum: {0}',
  boxplotNrItems: '# Items: {0}',
};

export type BoxPlotScaled = Omit<IBoxPlot, 'items'> & {
  scale: (v: number) => number;
  format: (v: number) => string;
  color: (v: number) => string;
};

export interface BoxPlotChartProps extends CommonProps {
  /**
   * the number boxplot statistics
   */
  s: BoxPlotScaled;
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
  padding: number,
  hor = true
) {
  const cy = h / 2;
  const q1 = s(stats.q1);
  const q3 = s(stats.q3);
  const boxHeight = h - padding * 2;
  const whiskerLow = hor
    ? `M ${s(stats.whiskerLow)} 0 l 0 ${h} l 0 -${cy} L ${q1} ${cy}`
    : `M 0 ${s(stats.whiskerLow)} l ${h} 0 l -${cy} 0 L ${cy} ${q1}`;
  const whiskerHigh = hor
    ? `M ${s(stats.whiskerHigh)} 0 l 0 ${h} l 0 -${cy} L ${q3} ${cy}`
    : `M 0 ${s(stats.whiskerHigh)} l ${h} 0 l -${cy} 0 L ${cy} ${q3}`;
  const median = hor
    ? `M ${s(stats.median)} ${padding} l 0 ${boxHeight}`
    : `M ${padding} ${s(stats.median)} l ${boxHeight} 0`;

  return `${whiskerLow} ${whiskerHigh} ${median}`;
}

function generateTitle(
  s: BoxPlotScaled,
  pre: Omit<IBoxPlot, 'items'> | undefined,
  i18n: Record<keyof typeof BOXPLOT_I18N_EN, (...args: unknown[]) => string>
) {
  const p = (v: number) => `/${s.format(v)}`;
  return `${i18n.boxplotMinimum(`${s.format(s.min)}${pre ? p(pre.min) : ''}`)}
${i18n.boxplot25Quantile(`${s.format(s.q1)}${pre ? p(pre.q1) : ''}`)}
${i18n.boxplotMedian(`${s.format(s.median)}${pre ? p(pre.median) : ''}`)}
${i18n.boxplotMean(`${s.format(s.mean)}${pre ? p(pre.mean) : ''}`)}
${i18n.boxplot75Quantile(`${s.format(s.q3)}${pre ? p(pre.q3) : ''}`)}
${i18n.boxplotMaximum(`${s.format(s.max)}${pre ? p(pre.max) : ''}`)}
${i18n.boxplotNrItems(`${s.count.toLocaleString()}${pre ? `/${pre.count.toLocaleString()}` : ''}`)}`;
}

/**
 * renders a boxplot as a SVG chart
 */
export function BoxPlotChart(props: BoxPlotChartProps): JSX.Element {
  const { s, preFilter: pre } = props;
  const i18n = useI18N(BOXPLOT_I18N_EN, props.i18n);
  const boxPadding = 2;
  const scale = useCallback((v: number) => Math.round(s.scale(v) * 1000) / 10, [s]);
  const outlierRadius = 4;
  const height = 20;

  const generateBoxPlot = (b: Omit<IBoxPlot, 'items'>) => {
    if (Number.isNaN(b.median)) {
      return null;
    }
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

/**
 * renders a boxplot as a SVG chart
 */
export function BoxPlotChartVertical(props: BoxPlotChartProps): JSX.Element {
  const { s } = props;
  const pre = props.preFilter;
  const i18n = useI18N(BOXPLOT_I18N_EN, props.i18n);
  const boxPadding = 2;
  const scale = useCallback((v: number) => Math.round(s.scale(v) * 1000) / 10, [s]);
  const outlierRadius = 4;
  const width = 20;

  const generateBoxPlot = (b: Omit<IBoxPlot, 'items'>) => {
    if (Number.isNaN(b.median)) {
      return null;
    }
    const cx = width / 2;
    const path = generatePath(b, scale, width, boxPadding, false);
    return (
      <>
        <rect
          y={scale(b.q1)}
          x={boxPadding}
          width={width - boxPadding * 2}
          height={scale(b.median) - scale(b.q1)}
          className="lt-boxplot-box"
          style={{ fill: s.color(s.scale((b.median + b.q1) / 2)) }}
        />
        <rect
          y={scale(b.median)}
          x={boxPadding}
          width={width - boxPadding * 2}
          height={scale(b.q3) - scale(b.median)}
          style={{ fill: s.color(s.scale((b.median + b.q3) / 2)) }}
          className="lt-boxplot-box"
        />
        <path d={`M ${boxPadding} ${scale(b.mean)} l ${width - boxPadding * 2} 0`} className="lt-boxplot-mean" />
        <path d={path} className="lt-boxplot-frame" />
        {b.outlier.map((o) => (
          <path
            className="lt-boxplot-outlier"
            key={o}
            d={`M ${cx - outlierRadius} ${scale(o)} l ${2 * outlierRadius} 0`}
          >
            <title>{s.format(o)}</title>
          </path>
        ))}
      </>
    );
  };

  const offset = pre != null ? width * 0.1 : 0;
  return (
    <svg
      viewBox={`0 0 ${width + offset} 100`}
      className={props.className}
      style={props.style}
      preserveAspectRatio="none"
    >
      <title>{generateTitle(s, pre, i18n)}</title>
      {pre != null && pre.count > s.count && (
        <g className="lt-boxplot-pre" transform={`translate(${offset},0)`}>
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
  s: BoxPlotScaled;
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
export function BoxPlot(props: BoxPlotProps): JSX.Element {
  return (
    <NumberStatsWrapper
      className={clsx('lt-boxplot', props.className)}
      s={props.s}
      summary={props.summary}
      style={props.style}
    >
      <ZeroWidth />
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
export function FilterRangeBoxPlot(props: FilterRangeBoxPlotProps): JSX.Element {
  return (
    <FilterRangeWrapper summary={props.summary} {...props} className={clsx('lt-boxplot', props.className)}>
      <ZeroWidth />
      <BoxPlotChart {...props} className={clsx('lt-boxplot-wrapper', props.className)} />
    </FilterRangeWrapper>
  );
}
