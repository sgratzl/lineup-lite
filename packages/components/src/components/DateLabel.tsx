import React from 'react';
import type { CommonProps } from './common';
import { clsx, format, toLocaleString } from './utils';

export interface DateLabelProps extends CommonProps {
  /**
   * the date value to render
   */
  value: Date;
  /**
   * optional formatted date string or a function to compute the date string
   */
  format?: string | ((v: Date) => string);
}

/**
 * renders a date
 */
export function DateLabel(props: DateLabelProps) {
  const label = format(props.value, props.format ?? toLocaleString);
  return (
    <div className={clsx('lt-date', props.className)} style={props.style} title={label}>
      {label}
    </div>
  );
}
