import React, { useMemo } from 'react';
import type { CommonProps } from './common';
import { clsx, format, i18n as l } from './utils';

export const UPSET_LINE_I18N_EN = {
  upsetHas: '{0}: yes',
  upsetHasNot: '{0}: no',
};

export interface UpSetLineProps extends CommonProps {
  /**
   * the value to render
   */
  value: Set<string> | readonly string[];
  /**
   * the label of the category or a function to convert the value to a color
   */
  format?: string | ((v: string) => string);

  sets: readonly string[];

  i18n?: Partial<typeof UPSET_LINE_I18N_EN>;
}

export function UpSetLine(props: UpSetLineProps) {
  const has = props.value instanceof Set ? props.value : new Set(props.value);
  const first = props.sets.findIndex((d) => has.has(d));
  let last = first;
  if (has.size > 1 && first < props.sets.length - 1) {
    last =
      props.sets.length -
      1 -
      props.sets
        .slice()
        .reverse()
        .findIndex((d) => has.has(d));
  }
  const i18n = useMemo(
    () => ({
      ...UPSET_LINE_I18N_EN,
      ...(props.i18n ?? {}),
    }),
    [props.i18n]
  );
  return (
    <div className={clsx('lt-upset-line', props.className)} style={props.style}>
      {props.sets.map((s) => (
        <svg key={s} className={clsx('lt-upset-dot', has.has(s) && 'lt-upset-dot-enabled')} viewBox="0 0 2 2">
          <title>{l(has.has(s) ? i18n.upsetHas : i18n.upsetHasNot, format(s, props.format))}</title>
          <circle r="1" cx="1" cy="1" />
        </svg>
      ))}
      {first < last && (
        <svg className="lt-upset-line-line" viewBox={`0 0 ${props.sets.length * 2} 2`}>
          <line x1={first * 2 + 1} x2={last * 2 + 1} y1={1} y2={1} />
        </svg>
      )}
    </div>
  );
}
