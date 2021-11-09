/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { DateFormatter, NumberFormatter, resolveDateFormatter, resolveNumberFormatter } from '../math';
import type { CommonProps } from './common';
import { clsx, EMPTY_ARR } from './utils';

export interface DateAxisProps extends CommonProps {
  format?: DateFormatter;
  labels: readonly Date[];
}

export interface NumberAxisProps extends CommonProps {
  format?: NumberFormatter;
  labels: readonly number[];
}

export interface TextAxisProps extends CommonProps {
  labels: readonly string[];
}

export type ArrayAxisProps = DateAxisProps | NumberAxisProps | TextAxisProps;

function isLabelText(o: ArrayAxisProps): o is TextAxisProps {
  const l = o as TextAxisProps;
  return l != null && Array.isArray(l.labels) && l.labels.length > 0 && typeof l.labels[0] === 'string';
}

function isLabelNumber(o: ArrayAxisProps): o is NumberAxisProps {
  const l = o as NumberAxisProps;
  return l != null && Array.isArray(l.labels) && l.labels.length > 0 && typeof l.labels[0] === 'number';
}

function isLabelDate(o: ArrayAxisProps): o is DateAxisProps {
  const l = o as DateAxisProps;
  return l != null && Array.isArray(l.labels) && l.labels.length > 0 && l.labels[0] instanceof Date;
}

/**
 * renders a summary axis
 */
export function ArrayAxis(props: ArrayAxisProps): JSX.Element {
  let labels: readonly string[] = EMPTY_ARR;
  if (isLabelText(props)) {
    labels = props.labels;
  } else if (isLabelNumber(props)) {
    const f = resolveNumberFormatter(props.format);
    labels = props.labels.map((l) => f(l));
  } else if (isLabelDate(props)) {
    const f = resolveDateFormatter(props.format);
    labels = props.labels.map((l) => f(l));
  }
  return (
    <div className={clsx('lt-summary', 'lt-array-axis', props.className)} style={props.style}>
      {labels.map((d) => (
        <div key={d}>{d}</div>
      ))}
    </div>
  );
}
