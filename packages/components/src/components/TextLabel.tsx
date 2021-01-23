import React from 'react';
import type { CommonProps } from './common';
import { format } from './utils';

export interface TextLabelProps extends CommonProps {
  /**
   * the date value to render
   */
  value: string;
  /**
   * optional formatted date string or a function to compute the string
   */
  format?: string | ((v: string) => string);
}

/**
 * renders a date
 */
export function TextLabel(props: TextLabelProps) {
  const label = format(props.value, props.format);
  return (
    <div className={props.className} style={props.style} title={label}>
      {label}
    </div>
  );
}
