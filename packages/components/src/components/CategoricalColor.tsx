import React from 'react';

export interface CategoricalColorProps {
  value: string;
  color: (v: string) => string;
}

export function CategoricalColor(props: CategoricalColorProps) {
  return (
    <div className="lt-categorical" style={{ borderLeftColor: props.color(props.value) }}>
      {props.value}
    </div>
  );
}
