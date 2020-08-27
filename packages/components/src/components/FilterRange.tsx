import React, { useLayoutEffect } from 'react';
import { INumericStats } from '../math/common';
import { toPercent } from './utils';
import { useAsyncDebounce, useGetLatest } from 'react-table';

export interface FilterRangeSliderProps<T> {
  s: INumericStats<T>;
  setFilter: (value: [T | null, T | null]) => void;
  filterValue: [T | null, T | null];
}

export function FilterRangeSlider<T>(props: FilterRangeSliderProps<T>) {
  const { setFilter } = props;
  const invert = props.s.invert;
  const filterValue = props.filterValue;
  const [localFilter, setLocalFilter] = React.useState(filterValue ?? [null as T | null, null as T | null]);
  const currentFilter = useGetLatest(localFilter);

  useLayoutEffect(() => {
    const v = currentFilter();
    const l = filterValue ?? [null as T | null, null as T | null];
    if (v[0] !== l[0] || v[1] !== l[1]) {
      setLocalFilter(l);
    }
  }, [setLocalFilter, currentFilter, filterValue]);

  const setFilterDebounced = useAsyncDebounce(setFilter, 100);

  const onMinMouseDown = React.useMemo(() => {
    let ueber: HTMLElement | null = null;
    let base = 0;
    let width = 0;

    const onMinMouseMove = (evt: MouseEvent) => {
      const ratio = Math.min(1, Math.max(0, (evt.clientX - base) / width));
      const v = [ratio <= 0 ? null : invert(ratio), currentFilter()[1]] as [T | null, T | null];
      setLocalFilter(v);
      setFilterDebounced(v);
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
  }, [setFilterDebounced, setLocalFilter, currentFilter, invert]);

  const onMaxMouseDown = React.useMemo(() => {
    let ueber: HTMLElement | null = null;
    let base = 0;
    let width = 0;

    const onMinMouseMove = (evt: MouseEvent) => {
      const ratio = Math.min(1, Math.max(0, (evt.clientX - base) / width));
      const v = [currentFilter()[0], ratio >= 1 ? null : invert(ratio)] as [T | null, T | null];
      setLocalFilter(v);
      setFilterDebounced(v);
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
  }, [setFilterDebounced, setLocalFilter, currentFilter, invert]);

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
