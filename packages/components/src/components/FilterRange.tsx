/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, {
  MutableRefObject,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  MouseEvent as RMouseEvent,
  PropsWithChildren,
} from 'react';
import type { INumericStats } from '../math/common';
import type { CommonProps } from './common';
import { clsx, toPercent, useI18N } from './utils';

export const FILTER_RANGE_I18N_EN = {
  filterRangeMinFilter: 'Min Filter: {0}',
  filterRangeMaxFilter: 'Max Filter: {0}',
};

export interface FilterRangeSliderProps<T> {
  /**
   * stats to render
   */
  s: INumericStats<T>;
  /**
   * set the filter
   */
  setFilter: (value?: [T | null, T | null]) => void;
  /**
   * get current filter value
   */
  filterValue: [T | null, T | null];

  i18n?: Partial<typeof FILTER_RANGE_I18N_EN>;
}

interface FilterRefData {
  clearFilter(): void;
  setShortCutFilter(evt: RMouseEvent<HTMLElement>): void;
}

function FilterRangeSlider<T>(props: FilterRangeSliderProps<T> & { refData: MutableRefObject<FilterRefData> }) {
  const { setFilter } = props;
  const { invert, scale } = props.s;
  const { filterValue } = props;
  const [localFilter, setLocalFilter] = useState(filterValue ?? [null as T | null, null as T | null]);
  const filterRef = useRef(localFilter);
  filterRef.current = localFilter;

  const i18n = useI18N(FILTER_RANGE_I18N_EN, props.i18n);

  useLayoutEffect(() => {
    const v = filterRef.current;
    const l = filterValue ?? [null as T | null, null as T | null];
    if (v[0] !== l[0] || v[1] !== l[1]) {
      setLocalFilter(l);
    }
  }, [setLocalFilter, filterRef, filterValue]);

  const onMinMouseDown = useMemo(() => {
    let ueber: HTMLElement | null = null;
    let base = 0;
    let width = 0;

    const onMinMouseMove = (evt: MouseEvent) => {
      const ratio = Math.min(1, Math.max(0, (evt.clientX - base) / width));
      const v = [ratio <= 0 ? null : invert(ratio), filterRef.current[1]] as [T | null, T | null];
      setLocalFilter(v);
      setFilter(v[0] == null && v[1] == null ? undefined : v);
    };
    const onMinMouseUp = () => {
      if (!ueber) {
        return;
      }
      ueber.removeEventListener('mousemove', onMinMouseMove);
      ueber.removeEventListener('mouseleave', onMinMouseUp);
      ueber.removeEventListener('mouseup', onMinMouseUp);
      ueber = null;
    };

    return (evt: RMouseEvent<HTMLElement>) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const bb = evt.currentTarget.parentElement!.parentElement!.getBoundingClientRect();
      base = bb.x;
      width = bb.width;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ueber = evt.currentTarget.closest('body')!;
      ueber.addEventListener('mousemove', onMinMouseMove);
      ueber.addEventListener('mouseleave', onMinMouseUp);
      ueber.addEventListener('mouseup', onMinMouseUp);
    };
  }, [setFilter, setLocalFilter, filterRef, invert]);

  const onMaxMouseDown = useMemo(() => {
    let ueber: HTMLElement | null = null;
    let base = 0;
    let width = 0;

    const onMinMouseMove = (evt: MouseEvent) => {
      const ratio = Math.min(1, Math.max(0, (evt.clientX - base) / width));
      const v = [filterRef.current[0], ratio >= 1 ? null : invert(ratio)] as [T | null, T | null];
      setLocalFilter(v);
      setFilter(v[0] == null && v[1] == null ? undefined : v);
    };
    const onMinMouseUp = () => {
      if (!ueber) {
        return;
      }
      ueber.removeEventListener('mousemove', onMinMouseMove);
      ueber.removeEventListener('mouseleave', onMinMouseUp);
      ueber.removeEventListener('mouseup', onMinMouseUp);
      ueber = null;
    };

    return (evt: RMouseEvent<HTMLElement>) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const bb = evt.currentTarget.parentElement!.parentElement!.getBoundingClientRect();
      base = bb.x;
      width = bb.width;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ueber = evt.currentTarget.closest('body')!;
      ueber.addEventListener('mousemove', onMinMouseMove);
      ueber.addEventListener('mouseleave', onMinMouseUp);
      ueber.addEventListener('mouseup', onMinMouseUp);
    };
  }, [setFilter, setLocalFilter, filterRef, invert]);

  const clearFilter = useCallback(() => {
    setLocalFilter([null, null]);
    setFilter(undefined);
  }, [setFilter, setLocalFilter]);

  const setShortCutFilter = useCallback(
    (evt: RMouseEvent<HTMLElement>) => {
      // set filter shortcut
      const bb = evt.currentTarget.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (evt.clientX - bb.x) / bb.width));
      // jump the closest to it
      const currentMinDistance = Math.abs(
        ratio - (typeof filterRef.current[0] === 'number' ? scale(filterRef.current[0]) : 0)
      );
      const currentMaxDistance = Math.abs(
        ratio - (typeof filterRef.current[1] === 'number' ? scale(filterRef.current[1]) : 1)
      );
      const useMin = currentMinDistance <= currentMaxDistance;
      const domainValue = invert(ratio);
      if (useMin) {
        setLocalFilter([domainValue, filterRef.current[1]]);
        setFilter([domainValue, filterRef.current[1]]);
      } else {
        setLocalFilter([filterRef.current[0], domainValue]);
        setFilter([filterRef.current[0], domainValue]);
      }
    },
    [setFilter, setLocalFilter, filterRef, invert, scale]
  );
  // eslint-disable-next-line no-param-reassign
  props.refData.current = {
    clearFilter,
    setShortCutFilter,
  };
  return (
    <>
      <div
        className="lt-filter-range lt-filter-range-min"
        data-value={localFilter[0]}
        title={localFilter[0] == null ? undefined : i18n.filterRangeMinFilter(props.s.format(localFilter[0]))}
        style={{ width: toPercent(localFilter[0] == null ? 0 : Math.max(0, props.s.scale(localFilter[0]))) }}
      >
        <div className="lt-filter-range-drag" onMouseDown={onMinMouseDown} role="presentation" />
      </div>
      <div
        className="lt-filter-range lt-filter-range-max"
        data-value={localFilter[1]}
        title={localFilter[1] == null ? undefined : i18n.filterRangeMaxFilter(props.s.format(localFilter[1]))}
        style={{ width: toPercent(localFilter[1] == null ? 0 : Math.max(0, 1 - props.s.scale(localFilter[1]))) }}
      >
        <div className="lt-filter-range-drag" onMouseDown={onMaxMouseDown} role="presentation" />
      </div>
    </>
  );
}

export function FilterRangeWrapper<T>(
  props: PropsWithChildren<
    {
      s: INumericStats<T> & { readonly center?: T };
      summary?: boolean;
    } & FilterRangeSliderProps<T> &
      CommonProps
  >
): JSX.Element {
  const refData = useRef({ clearFilter() {}, setShortCutFilter() {} } as FilterRefData);
  const clearFilter = useCallback(() => refData.current.clearFilter(), [refData]);
  const setShortCutFilter = useCallback(
    (evt: RMouseEvent<HTMLElement>) => refData.current.setShortCutFilter(evt),
    [refData]
  );

  const hasCenter = props.s.center != null && props.summary;
  return (
    <div
      className={clsx('lt-summary', !props.summary && 'lt-group', hasCenter && 'lt-summary-center', props.className)}
      data-min={props.s.min != null && props.summary ? props.s.format(props.s.min) : null}
      data-max={props.s.max != null && props.summary ? props.s.format(props.s.max) : null}
      onDoubleClick={clearFilter}
      onClick={setShortCutFilter}
      role="presentation"
      style={props.style}
      data-filtered={props.filterValue ? 'true' : undefined}
    >
      {hasCenter && props.s.center != null && <div className="lt-summary-center">{props.s.format(props.s.center)}</div>}
      {props.children}
      <FilterRangeSlider {...props} refData={refData} />
    </div>
  );
}
