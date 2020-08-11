import React from 'react';
import { ICommonStats, IBin } from '../../stats/common';
import { toPercent, cslx } from '../utils';
import './Histogram.css';
import './Summary.css';
import { FilterRangeSliderProps, FilterRangeSlider } from './FilterRange';

export interface HistogramProps<T> {
  s: ICommonStats<T> & { readonly min?: T; readonly max?: T };
  maxBin?: number;
  label?: boolean;
}

const DENSE = 10;

function generateBinTitle<T>(props: HistogramProps<T>, h: IBin<T>) {
  return `${props.s.format(h.x0)}${!props.label ? ` - ${props.s.format(h.x1)}` : ''}: ${h.count.toLocaleString()}`;
}

export default function Histogram<T>(props: HistogramProps<T>) {
  return (
    <HistogramWrapper s={props.s}>
      {props.s.hist.map((h, i) => (
        <Bin key={String(h.x0)} h={h} i={i} props={props} />
      ))}
    </HistogramWrapper>
  );
}

function HistogramWrapper<T>(
  props: React.PropsWithChildren<{ s: ICommonStats<T> & { readonly min?: T; readonly max?: T } }>
) {
  return (
    <div
      className="lt-histogram lt-summary"
      data-min={props.s.min != null ? props.s.format(props.s.min) : null}
      data-max={props.s.max != null ? props.s.format(props.s.max) : null}
    >
      {props.children}
    </div>
  );
}

function Bin<T>({
  h,
  props,
  opacity,
  i,
  onClick,
}: {
  h: IBin<T>;
  i: number;
  onClick?: (evt: React.MouseEvent<HTMLElement>) => void;
  props: HistogramProps<T>;
  opacity?: number;
}) {
  const maxBin = props.maxBin ?? props.s.maxBin;
  const lastBin = props.s.hist.length - 1;
  const dense = props.s.hist.length > DENSE || i === lastBin;
  const p = toPercent(h.count / maxBin);
  return (
    <div
      className={cslx('lt-histogram-bin', dense && 'lt-histogram-bin-dense', onClick && 'lt-histogram-bin-interactive')}
      style={{
        backgroundImage: `linear-gradient(to top, ${h.color} ${p}, transparent ${p})`,
        opacity,
      }}
      data-i={i}
      onClick={onClick}
      data-label={props.label ? props.s.format(h.x0) : null}
      title={generateBinTitle<T>(props, h)}
    />
  );
}

export interface FilterBinHistogramProps<T> extends HistogramProps<T> {
  setFilter: (value: T[]) => void;
  filterValue: T[];
}

export function FilterBinHistogram<T>(props: FilterBinHistogramProps<T>) {
  const { setFilter, filterValue } = props;
  const current: T[] = filterValue ?? [];
  const hist = props.s.hist;

  const onClick = React.useCallback(
    (evt: React.MouseEvent<HTMLElement>) => {
      const bin = hist[Number.parseInt(evt.currentTarget.dataset.i!, 10)];
      const value = bin.x0;
      const next = current.includes(value) ? current.filter((d) => d !== value) : current.concat([value]);
      setFilter(next);
    },
    [setFilter, hist, current]
  );
  return (
    <HistogramWrapper s={props.s}>
      {props.s.hist.map((h, i) => (
        <Bin
          key={String(h.x0)}
          h={h}
          props={props}
          opacity={current.includes(h.x0) ? 0.2 : undefined}
          i={i}
          onClick={onClick}
        />
      ))}
    </HistogramWrapper>
  );
}

export type FilterRangeHistogramProps<T> = HistogramProps<T> & FilterRangeSliderProps<T>;

export function FilterRangeHistogram<T>(props: FilterRangeHistogramProps<T>) {
  return (
    <HistogramWrapper s={props.s}>
      {props.s.hist.map((h, i) => (
        <Bin key={String(h.x0)} h={h} i={i} props={props} />
      ))}
      <FilterRangeSlider {...props} />
    </HistogramWrapper>
  );
}
