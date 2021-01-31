import React from 'react';
import type { CommonProps } from './common';
import { clsx } from './utils';

interface UpSetDotProps extends CommonProps {
  mode: boolean | null;
  title: string;
  color?: string;
}

export function UpSetDot(props: UpSetDotProps) {
  const style = props.color ? { fill: props.color } : undefined;
  return (
    <svg viewBox="0 0 2 2" className={props.className} style={props.style}>
      <title>{props.title}</title>
      <circle
        className={clsx('lt-upset-dot', props.mode === true && 'lt-upset-dot-enabled')}
        r="1"
        cx="1"
        cy="1"
        style={style}
      />
      {props.mode == null && (
        <circle className={clsx('lt-upset-dot', 'lt-upset-dot-enabled')} r="0.5" cx="1" cy="1" style={style} />
      )}
    </svg>
  );
}
