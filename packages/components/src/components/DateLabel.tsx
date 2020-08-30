import React from 'react';

export interface DateLabelProps {
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
  return <div className="lt-date">{typeof props.format === 'string' ? props.format : props.format(props.value)}</div>;
}
