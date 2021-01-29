import React from 'react';
import type { IHistStats, IBin } from '../math/common';
import { toPercent, cslx } from './utils';
import { FilterRangeSliderProps, FilterRangeWrapper } from './FilterRange';
import { NumberStatsWrapper } from './NumberStatsWrapper';
import type { CommonProps } from './common';

export interface HistogramProps<T> extends CommonProps {
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

function generateBinTitle<T>(h: IBin<T>, raw?: IBin<T>) {
  const rawT = raw ? `/${raw.count.toLocaleString()}` : '';
  return `${h.label}: ${h.count.toLocaleString()}${rawT} items`;
}

/**
 * renders a number or date histogram
 */
export function Histogram<T>(props: HistogramProps<T>) {
  return (
    <NumberStatsWrapper
      style={props.style}
      className={cslx('lt-histogram', props.className)}
      s={props.s}
      summary={props.summary}
    >
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
  const maxBin = props.maxBin ?? preFilter?.maxBin.count ?? props.s.maxBin.count;
  const lastBin = props.s.hist.length - 1;
  const dense = props.s.hist.length > DENSE || i === lastBin;
  const p = toPercent(h.count / maxBin);
  let gradient = `linear-gradient(to top, ${h.color} ${p}, transparent ${p})`;
  const raw = preFilter?.hist[i];
  if (raw) {
    const rawP = toPercent(raw.count / maxBin);
    if (raw.count > h.count) {
      const semi = `rgba(var(--current-inverted-color-rgb, 255,255,255), 0.7)`;
      gradient = `linear-gradient(to top, ${h.color} ${p}, ${semi} ${p}, ${semi} ${rawP}, transparent ${rawP}), linear-gradient(to top, ${h.color} ${rawP}, transparent ${rawP})`;
    }
  }
  return (
    <div
      className={cslx('lt-histogram-bin', dense && 'lt-histogram-bin-dense', onClick && 'lt-histogram-bin-interactive')}
      style={{
        backgroundImage: gradient,
      }}
      data-i={i}
      onClick={onClick}
      data-label={props.label ? h.label : null}
      title={generateBinTitle<T>(h, raw)}
    />
  );
}

export interface FilterBinHistogramProps<T> extends HistogramProps<T> {
  /**
   * sets the current filter
   */
  setFilter: (value: T[]) => void;
  /**
   * current filter value
   */
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
    <NumberStatsWrapper style={props.style} className={cslx('lt-histogram', props.className)} s={props.s} summary>
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
    <FilterRangeWrapper summary {...props} className={cslx('lt-histogram', props.className)}>
      {props.s.hist.map((h, i) => (
        <Bin key={String(h.x0)} h={h} i={i} props={props} />
      ))}
    </FilterRangeWrapper>
  );
}
