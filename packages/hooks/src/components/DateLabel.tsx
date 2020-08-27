import React from 'react';

export interface DateLabelProps {
  format: (v: Date) => string;
  value: Date;
}

export function DateLabel(props: DateLabelProps) {
  return <div className="lt-date">{props.format(props.value)}</div>;
}
