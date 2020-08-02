import React from 'react';
import { ICommonStats } from '../../stats/common';
import { toPercent } from '../utils';
import './Histogram.css';
import './Summary.css';

interface HistogramProps<T> {
  s: ICommonStats<T> & { readonly min?: T; readonly max?: T };
  maxBin?: number;
  label?: boolean;
}

export default function Histogram<T>(props: HistogramProps<T>) {
  const maxBin = props.maxBin ?? props.s.maxBin;
  const lastBin = props.s.hist.length - 1;
  const dense = props.s.hist.length > 10;
  return (
    <div
      className="lt-histogram lt-summary"
      data-min={props.s.min != null ? props.s.format(props.s.min) : null}
      data-max={props.s.max != null ? props.s.format(props.s.max) : null}
    >
      {props.s.hist.map((h, i) => {
        const p = toPercent(h.count / maxBin);
        return (
          <div
            key={String(h.x0)}
            className={'lt-histogram-bin' + (dense || i === lastBin ? ' lt-histogram-bin-dense' : '')}
            style={{
              backgroundImage: `linear-gradient(to top, ${h.color} ${p}, transparent ${p})`,
            }}
            data-label={props.label ? props.s.format(h.x0) : null}
            title={`${props.s.format(h.x0)}${
              !props.label ? ` - ${props.s.format(h.x1)}` : ''
            }: ${h.count.toLocaleString()}`}
          />
        );
      })}
    </div>
  );
}
