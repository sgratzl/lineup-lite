import React, { MutableRefObject, useCallback, useLayoutEffect, useRef } from 'react';
import { INumericStats } from '../math/common';
import { cslx, toPercent } from './utils';

export interface FilterRangeSliderProps<T> {
  /**
   * stats to render
   */
  s: INumericStats<T>;
  /**
   * set the filter
   */
  setFilter: (value: [T | null, T | null]) => void;
  /**
   * get current filter value
   */
  filterValue: [T | null, T | null];
}

interface FilterRefData {
  clearFilter(): void;
  setShortCutFilter(evt: React.MouseEvent<HTMLElement>): void;
}

function FilterRangeSlider<T>(props: FilterRangeSliderProps<T> & { refData: MutableRefObject<FilterRefData> }) {
  const { setFilter } = props;
  const { invert, scale } = props.s;
  const filterValue = props.filterValue;
  const [localFilter, setLocalFilter] = React.useState(filterValue ?? [null as T | null, null as T | null]);
  const filterRef = React.useRef(localFilter);
  filterRef.current = localFilter;

  useLayoutEffect(() => {
    const v = filterRef.current;
    const l = filterValue ?? [null as T | null, null as T | null];
    if (v[0] !== l[0] || v[1] !== l[1]) {
      setLocalFilter(l);
    }
  }, [setLocalFilter, filterRef, filterValue]);

  const onMinMouseDown = React.useMemo(() => {
    let ueber: HTMLElement | null = null;
    let base = 0;
    let width = 0;

    const onMinMouseMove = (evt: MouseEvent) => {
      const ratio = Math.min(1, Math.max(0, (evt.clientX - base) / width));
      const v = [ratio <= 0 ? null : invert(ratio), filterRef.current[1]] as [T | null, T | null];
      setLocalFilter(v);
      setFilter(v);
    };
    const onMinMouseUp = () => {
      ueber!.removeEventListener('mousemove', onMinMouseMove);
      ueber!.removeEventListener('mouseleave', onMinMouseUp);
      ueber!.removeEventListener('mouseup', onMinMouseUp);
      ueber = null;
    };

    return (evt: React.MouseEvent<HTMLElement>) => {
      const bb = evt.currentTarget.parentElement!.parentElement!.getBoundingClientRect();
      base = bb.x;
      width = bb.width;
      ueber = evt.currentTarget.closest('body')!;
      ueber.addEventListener('mousemove', onMinMouseMove);
      ueber.addEventListener('mouseleave', onMinMouseUp);
      ueber.addEventListener('mouseup', onMinMouseUp);
    };
  }, [setFilter, setLocalFilter, filterRef, invert]);

  const onMaxMouseDown = React.useMemo(() => {
    let ueber: HTMLElement | null = null;
    let base = 0;
    let width = 0;

    const onMinMouseMove = (evt: MouseEvent) => {
      const ratio = Math.min(1, Math.max(0, (evt.clientX - base) / width));
      const v = [filterRef.current[0], ratio >= 1 ? null : invert(ratio)] as [T | null, T | null];
      setLocalFilter(v);
      setFilter(v);
    };
    const onMinMouseUp = () => {
      ueber!.removeEventListener('mousemove', onMinMouseMove);
      ueber!.removeEventListener('mouseleave', onMinMouseUp);
      ueber!.removeEventListener('mouseup', onMinMouseUp);
      ueber = null;
    };

    return (evt: React.MouseEvent<HTMLElement>) => {
      const bb = evt.currentTarget.parentElement!.parentElement!.getBoundingClientRect();
      base = bb.x;
      width = bb.width;
      ueber = evt.currentTarget.closest('body')!;
      ueber.addEventListener('mousemove', onMinMouseMove);
      ueber.addEventListener('mouseleave', onMinMouseUp);
      ueber.addEventListener('mouseup', onMinMouseUp);
    };
  }, [setFilter, setLocalFilter, filterRef, invert]);

  const clearFilter = useCallback(() => {
    setLocalFilter([null, null]);
    setFilter([null, null]);
  }, [setFilter, setLocalFilter]);

  const setShortCutFilter = useCallback(
    (evt: React.MouseEvent<HTMLElement>) => {
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
  props.refData.current = {
    clearFilter,
    setShortCutFilter,
  };

  return (
    <>
      <div
        className="lt-filter-range lt-filter-range-min"
        title={localFilter[0] == null ? undefined : `Min Filter: ${props.s.format(localFilter[0])}`}
        style={{ width: toPercent(localFilter[0] == null ? 0 : Math.max(0, props.s.scale(localFilter[0]))) }}
      >
        <div className="lt-filter-range-drag" onMouseDown={onMinMouseDown} />
      </div>
      <div
        className="lt-filter-range lt-filter-range-max"
        title={localFilter[1] == null ? undefined : `Max Filter: ${props.s.format(localFilter[1])}`}
        style={{ width: toPercent(localFilter[1] == null ? 0 : Math.max(0, 1 - props.s.scale(localFilter[1]))) }}
      >
        <div className="lt-filter-range-drag" onMouseDown={onMaxMouseDown} />
      </div>
    </>
  );
}

export function FilterRangeWrapper<T>(
  props: React.PropsWithChildren<
    {
      s: INumericStats<T>;
      summary?: boolean;
      className?: string;
    } & FilterRangeSliderProps<T>
  >
) {
  const refData = useRef({ clearFilter() {}, setShortCutFilter() {} } as FilterRefData);
  const clearFilter = useCallback(() => refData.current.clearFilter(), [refData]);
  const setShortCutFilter = useCallback(
    (evt: React.MouseEvent<HTMLElement>) => refData.current.setShortCutFilter(evt),
    [refData]
  );

  return (
    <div
      className={cslx(props.className, 'lt-summary', !props.summary && 'lt-group')}
      data-min={props.s.min != null && props.summary ? props.s.format(props.s.min) : null}
      data-max={props.s.max != null && props.summary ? props.s.format(props.s.max) : null}
      onDoubleClick={clearFilter}
      onClick={setShortCutFilter}
    >
      {props.children}
      <FilterRangeSlider {...props} refData={refData} />
    </div>
  );
}
