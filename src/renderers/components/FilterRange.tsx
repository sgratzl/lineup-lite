import React from 'react';
import { INumericStats } from '../../math/common';
import { toPercent } from '../utils';
import './FilterRange.css';

export interface FilterRangeSliderProps<T> {
  s: INumericStats<T>;
  setFilter: (value: [T | null, T | null]) => void;
  filterValue: [T | null, T | null];
}

export function FilterRangeSlider<T>(props: FilterRangeSliderProps<T>) {
  const { setFilter, filterValue } = props;
  const invert = props.s.invert;
  const [fMin, fMax] = filterValue ?? [null, null];

  const onMinMouseDown = React.useMemo(() => {
    let ueber: HTMLElement | null = null;
    let base = 0;
    let width = 0;

    const onMinMouseMove = (evt: MouseEvent) => {
      const ratio = Math.min(1, Math.max(0, (evt.clientX - base) / width));
      setFilter([ratio <= 0 ? null : invert(ratio), fMax]);
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
  }, [setFilter, fMax, invert]);

  const onMaxMouseDown = React.useMemo(() => {
    let ueber: HTMLElement | null = null;
    let base = 0;
    let width = 0;

    const onMinMouseMove = (evt: MouseEvent) => {
      const ratio = Math.min(1, Math.max(0, (evt.clientX - base) / width));
      setFilter([fMin, ratio >= 1 ? null : invert(ratio)]);
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
  }, [setFilter, fMin, invert]);

  return (
    <>
      <div
        className="lt-filter-range lt-filter-range-min"
        title={fMin == null ? undefined : `Min Filter: ${props.s.format(fMin)}`}
        style={{ width: toPercent(fMin == null ? 0 : Math.max(0, props.s.scale(fMin))) }}
      >
        <div className="lt-filter-range-drag" onMouseDown={onMinMouseDown} />
      </div>
      <div
        className="lt-filter-range lt-filter-range-max"
        title={fMax == null ? undefined : `Max Filter: ${props.s.format(fMax)}`}
        style={{ width: toPercent(fMax == null ? 0 : Math.max(0, 1 - props.s.scale(fMax))) }}
      >
        <div className="lt-filter-range-drag" onMouseDown={onMaxMouseDown} />
      </div>
    </>
  );
}
