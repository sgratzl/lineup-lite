import React from 'react';
import { IHistStats, IBin } from '../math/common';
import { toPercent, cslx } from './utils';
import { color } from 'd3-color';
import { FilterRangeSliderProps, FilterRangeSlider } from './FilterRange';
import { NumberStatsWrapper } from './NumberStatsWrapper';

export interface HistogramProps<T> {
  /**
   * the stats to render
   */
  s: IHistStats<T> & { readonly min?: T; readonly max?: T };
  /**
   * the unfiltered stats in case the normal stats were filtered
   */
  preFilter?: IHistStats<T>;
  /**
   * the max bin size to use in case of synchronizing between charts
   */
  maxBin?: number;
  /**
   * whether bin title should only be the x0
   */
  label?: boolean;
  /**
   * whether to render it as a summary with range text
   */
  summary?: boolean;
}

const DENSE = 10;
const FILTERED_OPACITY = 0.2;

function generateBinTitle<T>(props: HistogramProps<T>, h: IBin<T>, raw?: IBin<T>) {
  const rawT = raw ? `/${raw.count.toLocaleString()}` : '';
  return `${props.s.format(h.x0)}${
    !props.label ? ` - ${props.s.format(h.x1)}` : ''
  }: ${h.count.toLocaleString()}${rawT} items`;
}

/**
 * renders a number or date histogram
 */
export function Histogram<T>(props: HistogramProps<T>) {
  return (
    <NumberStatsWrapper className="lt-histogram" s={props.s} summary={props.summary}>
      {props.s.hist.map((h, i) => (
        <Bin key={String(h.x0)} h={h} i={i} props={props} />
      ))}
    </NumberStatsWrapper>
  );
}

function Bin<T>({
  h,
  props,
  i,
  onClick,
}: {
  h: IBin<T>;
  i: number;
  onClick?: (evt: React.MouseEvent<HTMLElement>) => void;
  props: HistogramProps<T>;
}) {
  const preFilter = props.preFilter;
  const maxBin = props.maxBin ?? preFilter?.maxBin ?? props.s.maxBin;
  const lastBin = props.s.hist.length - 1;
  const dense = props.s.hist.length > DENSE || i === lastBin;
  const p = toPercent(h.count / maxBin);
  let gradient = `${h.color} ${p}, transparent ${p}`;
  const raw = preFilter?.hist[i];
  if (raw) {
    const rawP = toPercent(raw.count / maxBin);
    if (raw.count > h.count) {
      const c = color(h.color)!;
      c.opacity *= FILTERED_OPACITY;
      const semi = c.toString();
      gradient = `${h.color} ${p}, ${semi} ${p}, ${semi} ${rawP}, transparent ${rawP}`;
    }
  }
  return (
    <div
      className={cslx('lt-histogram-bin', dense && 'lt-histogram-bin-dense', onClick && 'lt-histogram-bin-interactive')}
      style={{
        backgroundImage: `linear-gradient(to top, ${gradient})`,
      }}
      data-i={i}
      onClick={onClick}
      data-label={props.label ? props.s.format(h.x0) : null}
      title={generateBinTitle<T>(props, h, raw)}
    />
  );
}

export interface FilterBinHistogramProps<T> extends HistogramProps<T> {
  setFilter: (value: T[]) => void;
  filterValue: T[];
}

export function FilterBinHistogram<T>(props: FilterBinHistogramProps<T>) {
  const { setFilter, filterValue } = props;
  const hist = props.s.hist;

  const onClick = React.useCallback(
    (evt: React.MouseEvent<HTMLElement>) => {
      const current: T[] = filterValue ?? [];
      const bin = hist[Number.parseInt(evt.currentTarget.dataset.i!, 10)];
      const value = bin.x0;
      const next = current.includes(value) ? current.filter((d) => d !== value) : current.concat([value]);
      setFilter(next);
    },
    [setFilter, hist, filterValue]
  );
  return (
    <NumberStatsWrapper className="lt-histogram" s={props.s} summary>
      {props.s.hist.map((h, i) => (
        <Bin key={String(h.x0)} h={h} props={props} i={i} onClick={onClick} />
      ))}
    </NumberStatsWrapper>
  );
}

export type FilterRangeHistogramProps<T> = HistogramProps<T> & FilterRangeSliderProps<T>;

/**
 * renders a histogram along with a range filter
 */
export function FilterRangeHistogram<T>(props: FilterRangeHistogramProps<T>) {
  return (
    <NumberStatsWrapper className="lt-histogram" s={props.s} summary>
      {props.s.hist.map((h, i) => (
        <Bin key={String(h.x0)} h={h} i={i} props={props} />
      ))}
      <FilterRangeSlider {...props} />
    </NumberStatsWrapper>
  );
}
