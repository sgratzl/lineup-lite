import React from 'react';
import type { INumberStats } from '../math/numberStatsGenerator';
import type { IBoxPlot } from '@sgratzl/boxplots';
import { NumberStatsWrapper } from './NumberStatsWrapper';
import { FilterRangeWrapper, FilterRangeSliderProps } from './FilterRange';
import type { CommonProps } from './common';
import { cslx } from './utils';

export interface BoxPlotChartProps extends CommonProps {
  /**
   * the number boxplot statistics
   */
  s: INumberStats;
  /**
   * the optional stats containing the unfiltered stats in case of filtering operation applied
   * to the regular one
   */
  preFilter?: IBoxPlot;
}

function generatePath(stats: IBoxPlot, s: (v: number) => number, h: number, padding: number) {
  const cy = h / 2;
  const q1 = s(stats.q1);
  const q3 = s(stats.q3);
  const boxHeight = h - padding * 2;
  const whiskerLow = `M ${s(stats.whiskerLow)} 0 l 0 ${h} l 0 -${cy} L ${q1} ${cy}`;
  const whiskerHigh = `M ${s(stats.whiskerHigh)} 0 l 0 ${h} l 0 -${cy} L ${q3} ${cy}`;
  const median = `M ${s(stats.median)} ${padding} l 0 ${boxHeight}`;

  return `${whiskerLow} ${whiskerHigh} ${median}`;
}

function generateTitle(s: INumberStats, pre?: IBoxPlot) {
  const p = (v: number) => `/${s.format(v)}`;
  return `Minimum: ${s.format(s.min)}${pre ? p(pre.min) : ''}
25% Quantile: ${s.format(s.q1)}${pre ? p(pre.q1) : ''}
Median: ${s.format(s.median)}${pre ? p(pre.median) : ''}
Mean: ${s.format(s.mean)}${pre ? p(pre.mean) : ''}
75% Quantile: ${s.format(s.q3)}${pre ? p(pre.q3) : ''}
Maximum: ${s.format(s.max)}${pre ? p(pre.max) : ''}
# Items: ${s.count.toLocaleString()}${pre ? `/${pre.count.toLocaleString()}` : ''}`;
}

/**
 * renders a boxplot as a SVG chart
 */
export function BoxPlotChart(props: BoxPlotChartProps) {
  const s = props.s;
  const pre = props.preFilter;
  const boxPadding = 2;
  const scale = (v: number) => Math.round(s.scale(v) * 1000) / 10;
  const outlierRadius = 4;
  const height = 20;

  const generateBoxPlot = (b: IBoxPlot) => {
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
      <title>{generateTitle(s, pre)}</title>
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
  preFilter?: IBoxPlot;
  /**
   * whether to render it as a summary including labels
   */
  summary?: boolean;
}

/**
 * renders a boxplot
 */
export function BoxPlot(props: BoxPlotProps) {
  return (
    <NumberStatsWrapper
      className={cslx('lt-boxplot', props.className)}
      s={props.s}
      summary={props.summary}
      style={props.style}
    >
      <BoxPlotChart {...props} className={cslx('lt-boxplot-wrapper', props.className)} />
    </NumberStatsWrapper>
  );
}

export type FilterRangeBoxPlotProps = BoxPlotProps & FilterRangeSliderProps<number>;

/**
 * renders a boxplot along with a range filter
 */
export function FilterRangeBoxPlot(props: FilterRangeBoxPlotProps) {
  return (
    <FilterRangeWrapper summary={props.summary} {...props} className={cslx('lt-boxplot', props.className)}>
      <BoxPlotChart {...props} className={cslx('lt-boxplot-wrapper', props.className)} />
    </FilterRangeWrapper>
  );
}
