import React from 'react';
import type { CommonProps } from './common';
import { UpSetDot } from './UpSetDot';
import { clsx, format, toPercent, useI18N } from './utils';

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
   * the color of the category or a function to convert the value to a color
   */
  color?: string | ((v: string) => string);
  /**
   * the label of the category or a function to convert the value to a color
   */
  format?: string | ((v: string) => string);

  sets: readonly string[];

  i18n?: Partial<typeof UPSET_LINE_I18N_EN>;
}

export function UpSetLine(props: UpSetLineProps) {
  const has = props.value instanceof Set ? props.value : new Set(props.value);
  const sets = props.sets;
  const first = sets.findIndex((d) => has.has(d));
  let last = first;
  if (has.size > 1 && first < sets.length - 1) {
    last =
      sets.length -
      1 -
      sets
        .slice()
        .reverse()
        .findIndex((d) => has.has(d));
  }
  const i18n = useI18N(UPSET_LINE_I18N_EN, props.i18n);
  return (
    <div className={clsx('lt-upset-line', props.className)} style={props.style}>
      {sets.map((s) => (
        <UpSetDot
          key={s}
          mode={has.has(s)}
          title={(has.has(s) ? i18n.upsetHas : i18n.upsetHasNot)(format(s, props.format))}
          color={typeof props.color === 'string' ? props.color : props.color ? props.color(s) : undefined}
        />
      ))}
      {first < last && (
        <svg
          className="lt-upset-line-line"
          viewBox={`0 0 ${(sets.length - 1) * 2} 2`}
          preserveAspectRatio="none"
          style={{ left: toPercent(1 / (sets.length + 1)), width: toPercent(1 - 2 / (sets.length + 1)) }}
        >
          <line x1={first * 2} x2={last * 2} y1={1} y2={1} />
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
   * the color of the category or a function to convert the value to a color
   */
  color?: string | ((v: string) => string);
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
          <UpSetDot
            key={s}
            mode={!has && !hasNot ? null : has}
            title={(has ? i18n.upsetHas : partial ? i18n.upsetHasPartial : i18n.upsetHasNot)(format(s, props.format))}
            color={typeof props.color === 'string' ? props.color : props.color ? props.color(s) : undefined}
          />
        );
      })}
    </div>
  );
}
