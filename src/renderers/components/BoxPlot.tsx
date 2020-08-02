import React from 'react';
import { INumberStats } from '../../stats/numberStats';
import './BoxPlot.css';
import './Summary.css';

export interface BoxPlotProps {
  s: INumberStats;
  className?: string;
  style?: React.CSSProperties;
}

function generatePath(stats: INumberStats, s: (v: number) => number, h: number, padding: number) {
  const cy = h / 2;
  const q1 = s(stats.q1);
  const q3 = s(stats.q3);
  const boxHeight = h - padding * 2;
  const whiskerLow = `M ${s(stats.whiskerLow)} 0 l 0 ${h} l 0 -${cy} L ${q1} ${cy}`;
  const whiskerHigh = `M ${s(stats.whiskerHigh)} 0 l 0 ${h} l 0 -${cy} L ${q3} ${cy}`;
  const median = `M ${s(stats.median)} ${padding} l 0 ${boxHeight}`;

  return `${whiskerLow} ${whiskerHigh} ${median}`;
}

function generateTitle(s: INumberStats) {
  return `Minimum: ${s.format(s.min)}
25% Quantile: ${s.format(s.q1)}
Median: ${s.format(s.median)}
Mean: ${s.format(s.mean)}
75% Quantile: ${s.format(s.q3)}
Maximum: ${s.format(s.max)}
# Items: ${s.count.toLocaleString()}`;
}

export default function BoxPlot(props: BoxPlotProps) {
  const s = props.s;
  const height = 20;
  const cy = height / 2;
  const boxPadding = 2;
  const scale = (v: number) => Math.round(s.scale(v) * 1000) / 10;
  const outlierRadius = 4;
  const path = generatePath(s, scale, height, boxPadding);
  const title = generateTitle(s);
  return (
    <svg viewBox={`0 0 100 ${height}`} className={props.className} style={props.style} preserveAspectRatio="xMaxYMid">
      <title>{title}</title>
      <rect
        x={scale(s.q1)}
        y={boxPadding}
        height={height - boxPadding}
        width={scale(s.median) - scale(s.q1)}
        className="lt-boxplot-box"
        style={{ fill: s.color(s.scale((s.median + s.q1) / 2)) }}
      />
      <rect
        x={scale(s.median)}
        y={boxPadding}
        height={height - boxPadding}
        width={scale(s.q3) - scale(s.median)}
        style={{ fill: s.color(s.scale((s.median + s.q3) / 2)) }}
        className="lt-boxplot-box"
      />
      <path d={path} className="lt-boxplot-frame" />
      {s.outlier.map((o) => (
        <circle className="lt-boxplot-outlier" key={o} cx={scale(o)} cy={cy} r={outlierRadius}>
          <title>{s.format(o)}</title>
        </circle>
      ))}
    </svg>
  );
}
