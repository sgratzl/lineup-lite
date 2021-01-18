import React from 'react';
import type { CommonProps } from './common';
import { cslx } from './utils';

export interface DateLabelProps extends CommonProps {
  /**
   * the date value to render
   */
  value: Date;
  /**
   * optional formatted date string or a function to compute the date string
   */
  format: string | ((v: Date) => string);
}

/**
 * renders a date
 */
export function DateLabel(props: DateLabelProps) {
  const label = typeof props.format === 'string' ? props.format : props.format(props.value);
  return (
    <div className={cslx('lt-date', props.className)} style={props.style} title={label}>
      {label}
    </div>
  );
}
