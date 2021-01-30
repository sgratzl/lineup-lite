import React from 'react';
import type { CommonProps } from './common';
import { clsx, format, toPercent } from './utils';

export interface UpSetLineProps extends CommonProps {
  /**
   * the value to render
   */
  value: Set<string> | readonly string[];
  /**
   * the label of the category or a function to convert the value to a color
   */
  format?: string | ((v: string) => string);

  sets: readonly string[];
}

export function UpSetLine(props: UpSetLineProps) {
  const has = props.value instanceof Set ? props.value : new Set(props.value);
  const first = props.sets.findIndex((d) => has.has(d));
  let last = first;
  if (has.size > 1 && first < props.sets.length - 1) {
    last =
      props.sets.length -
      1 -
      props.sets
        .slice()
        .reverse()
        .findIndex((d) => has.has(d));
  }
  return (
    <div className={clsx('lt-upset-line', props.className)} style={props.style}>
      {props.sets.map((s) => (
        <svg key={s} className={clsx('lt-upset-dot', has.has(s) && 'lt-upset-dot-enabled')} viewBox="0 0 2 2">
          <title>{format(s, props.format)}</title>
          <circle r="1" cx="1" cy="1" />
        </svg>
      ))}
      {first < last && (
        <svg className="lt-upset-line-line" viewBox={`0 0 ${props.sets.length * 2} 2`}>
          <line x1={first * 2 + 1} x2={last * 2 + 1} y1={1} y2={1} />
        </svg>
      )}
    </div>
  );
}
