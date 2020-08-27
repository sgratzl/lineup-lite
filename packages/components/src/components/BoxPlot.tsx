import React from 'react';
import { INumberStats } from '../math/numberStatsGenerator';
import { IBoxPlot } from '@sgratzl/boxplots';

export interface BoxPlotProps {
  s: INumberStats;
  preFilter?: IBoxPlot;
  className?: string;
  style?: React.CSSProperties;
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

export default function BoxPlot(props: BoxPlotProps) {
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
          height={height - boxPadding}
          width={scale(b.median) - scale(b.q1)}
          className="lt-boxplot-box"
          style={{ fill: s.color(s.scale((b.median + b.q1) / 2)) }}
        />
        <rect
          x={scale(b.median)}
          y={boxPadding}
          height={height - boxPadding}
          width={scale(b.q3) - scale(b.median)}
          style={{ fill: s.color(s.scale((b.median + b.q3) / 2)) }}
          className="lt-boxplot-box"
        />
        <path d={path} className="lt-boxplot-frame" />
        {b.outlier.map((o) => (
          <circle className="lt-boxplot-outlier" key={o} cx={scale(o)} cy={cy} r={outlierRadius}>
            <title>{s.format(o)}</title>
          </circle>
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
      preserveAspectRatio="xMaxYMid"
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
