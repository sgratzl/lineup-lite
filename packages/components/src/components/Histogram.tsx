import React, { useCallback, useMemo } from 'react';
import type { IHistStats, IBin } from '../math/common';
import { toPercent, clsx, i18n, EMPTY_ARR } from './utils';
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

function generateBinTitle<T>(h: IBin<T>, raw?: IBin<T>, title?: string) {
  const rawT = raw ? `/${raw.count.toLocaleString()}` : '';
  const base = `${h.label}: ${h.count.toLocaleString()}${rawT}`;
  if (title) {
    return i18n(title, base);
  }
  return base;
}

/**
 * renders a number or date histogram
 */
export function Histogram<T>(props: HistogramProps<T>) {
  return (
    <NumberStatsWrapper
      style={props.style}
      className={clsx('lt-histogram', props.className)}
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
  title,
}: {
  h: IBin<T>;
  i: number;
  onClick?: (evt: React.MouseEvent<HTMLElement>) => void;
  props: HistogramProps<T>;
  title?: string;
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
      className={clsx('lt-histogram-bin', dense && 'lt-histogram-bin-dense', onClick && 'lt-histogram-bin-interactive')}
      style={{
        backgroundImage: gradient,
      }}
      data-i={i}
      onClick={onClick}
      data-label={props.label ? h.label : null}
      title={generateBinTitle<T>(h, raw, title)}
    />
  );
}

export const FILTER_BIN_I18N_EN = {
  filterBin: '{0} - Click to filter this out this bin',
  removeFilterBin: '{0} - Click to remove filtering out this bin',
};

export interface FilterBinHistogramProps<T> extends HistogramProps<T> {
  /**
   * sets the current filter
   */
  setFilter: (value: T[]) => void;
  /**
   * current filter value
   */
  filterValue: T[];

  i18n?: Partial<typeof FILTER_BIN_I18N_EN>;
}

export function FilterBinHistogram<T>(props: FilterBinHistogramProps<T>) {
  const { setFilter, filterValue = EMPTY_ARR } = props;
  const hist = props.s.hist;

  const i18n = useMemo(
    () => ({
      ...FILTER_BIN_I18N_EN,
      ...(props.i18n ?? {}),
    }),
    [props.i18n]
  );

  const onClick = useCallback(
    (evt: React.MouseEvent<HTMLElement>) => {
      const current: T[] = filterValue ?? EMPTY_ARR;
      const bin = hist[Number.parseInt(evt.currentTarget.dataset.i!, 10)];
      const value = bin.x0;
      const next = current.includes(value) ? current.filter((d) => d !== value) : current.concat([value]);
      setFilter(next);
    },
    [setFilter, hist, filterValue]
  );
  return (
    <NumberStatsWrapper style={props.style} className={clsx('lt-histogram', props.className)} s={props.s} summary>
      {props.s.hist.map((h, i) => (
        <Bin
          key={String(h.x0)}
          h={h}
          props={props}
          i={i}
          onClick={onClick}
          title={(filterValue ?? EMPTY_ARR).includes(h.x0) ? i18n.removeFilterBin : i18n.filterBin}
        />
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
    <FilterRangeWrapper summary {...props} className={clsx('lt-histogram', props.className)}>
      {props.s.hist.map((h, i) => (
        <Bin key={String(h.x0)} h={h} i={i} props={props} />
      ))}
    </FilterRangeWrapper>
  );
}

export const FILTER_SET_I18N_EN = {
  filterMustNotSet: '{0} - Click to must not have this set',
  filterMustSet: '{0} - Click to must have this set',
  filterMaybeSet: '{0} - Click to remove filtering by this set',
};

export interface FilterSetValue<T> {
  set: T;
  value: boolean;
}

export interface FilterSetHistogramProps<T> extends HistogramProps<T> {
  /**
   * sets the current filter
   */
  setFilter: (value: FilterSetValue<T>[]) => void;
  /**
   * current filter value
   */
  filterValue: FilterSetValue<T>[];

  i18n?: Partial<typeof FILTER_SET_I18N_EN>;
}

export function FilterSetHistogram<T>(props: FilterSetHistogramProps<T>) {
  const { setFilter, filterValue = EMPTY_ARR } = props;
  const hist = props.s.hist;

  const i18n = useMemo(
    () => ({
      ...FILTER_SET_I18N_EN,
      ...(props.i18n ?? {}),
    }),
    [props.i18n]
  );

  const onClick = useCallback(
    (evt: React.MouseEvent<HTMLElement>) => {
      const current: FilterSetValue<T>[] = filterValue ?? EMPTY_ARR;
      const bin = hist[Number.parseInt(evt.currentTarget.dataset.i!, 10)];
      const value = bin.x0;
      const index = current.findIndex((d) => d.set === value);
      if (index < 0) {
        setFilter(current.concat([{ set: value, value: true }]));
      } else if (current[index].value) {
        current[index].value = false;
        setFilter(current.slice());
      } else {
        const next = current.slice();
        next.splice(index, 1);
        setFilter(next);
      }
    },
    [setFilter, hist, filterValue]
  );
  return (
    <NumberStatsWrapper style={props.style} className={clsx('lt-histogram', props.className)} s={props.s} summary>
      {props.s.hist.map((h, i) => {
        const index = (filterValue ?? EMPTY_ARR).findIndex((d) => d.set === h.x0);
        return (
          <Bin
            key={String(h.x0)}
            h={h}
            props={props}
            i={i}
            onClick={onClick}
            title={
              index < 0 ? i18n.filterMustSet : filterValue[index].value ? i18n.filterMustNotSet : i18n.filterMaybeSet
            }
          />
        );
      })}
    </NumberStatsWrapper>
  );
}
