import React from 'react';
import type { CommonProps } from './common';

export interface TextLabelProps extends CommonProps {
  /**
   * the date value to render
   */
  value: string;
  /**
   * optional formatted date string or a function to compute the string
   */
  format: string | ((v: string) => string);
}

/**
 * renders a date
 */
export function TextLabel(props: TextLabelProps) {
  const label = typeof props.format === 'string' ? props.format : props.format(props.value);
  return (
    <div className={props.className} style={props.style} title={label}>
      {label}
    </div>
  );
}
