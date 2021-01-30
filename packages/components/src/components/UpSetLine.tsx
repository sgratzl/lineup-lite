import React from 'react';
import type { CommonProps } from './common';
import { clsx, format, useI18N } from './utils';

export const UPSET_LINE_I18N_EN = {
  upsetHas: '{0}: yes',
  upsetHasPartial: '{0}: some',
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
  const i18n = useI18N(UPSET_LINE_I18N_EN, props.i18n);
  return (
    <div className={clsx('lt-upset-line', props.className)} style={props.style}>
      {props.sets.map((s) => (
        <svg key={s} viewBox="0 0 2 2">
          <title>{(has.has(s) ? i18n.upsetHas : i18n.upsetHasNot)(format(s, props.format))}</title>
          <circle r="1" cx="1" cy="1" className={clsx('lt-upset-dot', has.has(s) && 'lt-upset-dot-enabled')} />
        </svg>
      ))}
      {first < last && (
        <svg viewBox={`0 0 ${props.sets.length * 2} 2`}>
          <line className="lt-upset-line-line" x1={first * 2 + 1} x2={last * 2 + 1} y1={1} y2={1} />
        </svg>
      )}
    </div>
  );
}

export interface UpSetPartialLineProps extends CommonProps {
  /**
   * the value to render
   */
  value: readonly (boolean | null)[];
  /**
   * the label of the category or a function to convert the value to a color
   */
  format?: string | ((v: string) => string);

  sets: readonly string[];

  i18n?: Partial<typeof UPSET_LINE_I18N_EN>;
}

export function UpSetPartialLine(props: UpSetPartialLineProps) {
  const i18n = useI18N(UPSET_LINE_I18N_EN, props.i18n);
  return (
    <div className={clsx('lt-upset-line', props.className)} style={props.style}>
      {props.sets.map((s, i) => {
        const has = props.value[i] === true;
        const hasNot = props.value[i] === false;
        const partial = !has && !hasNot;
        return (
          <svg key={s} viewBox="0 0 2 2">
            <title>
              {(has ? i18n.upsetHas : partial ? i18n.upsetHasPartial : i18n.upsetHasNot)(format(s, props.format))}
            </title>
            <circle className={clsx('lt-upset-dot', has && 'lt-upset-dot-enabled')} r="1" cx="1" cy="1" />
            {partial && <circle className={clsx('lt-upset-dot', 'lt-upset-dot-partial')} r="0.5" cx="1" cy="1" />}
          </svg>
        );
      })}
    </div>
  );
}
