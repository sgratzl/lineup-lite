import React from 'react';
import { NumberBarProps } from './NumberBar';

export function NumberColor(props: NumberBarProps) {
  return (
    <div className="lt-color" style={{ borderLeftColor: props.color(props.scale(props.value)) }}>
      {props.format(props.value)}
    </div>
  );
}
