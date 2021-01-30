import React from 'react';
import type { CommonProps } from './common';
import { clsx, format } from './utils';

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
  return (
    <div className={clsx('lt-upset-line', props.className)} style={props.style}>
      {props.sets.map((s) => (
        <div
          key={s}
          className={clsx('lt-upset-dot', has.has(s) && 'lt-upset-dot-enabled')}
          title={format(s, props.format)}
        />
      ))}
    </div>
  );
}
