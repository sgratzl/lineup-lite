import React from 'react';

export interface CategoricalColorProps {
  value: string;
  color: string | ((v: string) => string);
}

export function CategoricalColor(props: CategoricalColorProps) {
  return (
    <div
      className="lt-categorical"
      style={{ borderLeftColor: typeof props.color === 'string' ? props.color : props.color(props.value) }}
    >
      {props.value}
    </div>
  );
}
