/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { ReactNode } from 'react';
import type { CommonProps } from './common';
import { UpSetDot } from './UpSetDot';
import { clsx, format, toPercent, useI18N } from './utils';

export const UPSET_LINE_I18N_EN = {
  upsetHas: '{0}: yes',
  upsetHasAll: '{0}: all',
  upsetHasSome: '{0}: some',
  upsetHasNone: '{0}: none',
  upsetHasNot: '{0}: no',
};

export type CategoricalSetValue = readonly string[] | Set<string>;

export function isCategoricalSetValue(v: CategoricalSetValue | string | null | undefined): v is CategoricalSetValue {
  return Array.isArray(v) || v instanceof Set;
}

export function categoricalSetDegree(v?: CategoricalSetValue | null): number {
  if (v == null) {
    return 0;
  }
  return v instanceof Set ? v.size : v.length;
}

export interface UpSetLineProps extends CommonProps {
  /**
   * the value to render
   */
  value: CategoricalSetValue;
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

function generateGradient(colors: string[], x1: number, x2: number) {
  const id = `upset-line-g-${colors.join(',')}`.replace(/[, ]+/gm, '').replace(/[-#$()[\]{}"']+/gm, '-');
  return {
    stroke: `url('#${id}')`,
    def: (
      <defs>
        <linearGradient id={id} x1={x1} x2={x2} gradientUnits="userSpaceOnUse">
          {colors.map((d, i) => (
            <stop key={d} offset={toPercent(i / (colors.length - 1))} stopColor={d} />
          ))}
        </linearGradient>
      </defs>
    ),
  };
}

function UpSetLineLine({
  first,
  last,
  sets,
  color,
}: Pick<UpSetLineProps, 'sets' | 'color'> & { first: number; last: number }): JSX.Element {
  if (first >= last) {
    return <></>;
  }
  let stroke: string | undefined;
  let g: ReactNode = null;
  if (typeof color === 'string') {
    stroke = color;
  } else if (typeof color === 'function') {
    const colors = sets.slice(first, last + 1).map((d) => color(d));
    if (colors.every((d) => d === colors[0])) {
      // single color
      // eslint-disable-next-line prefer-destructuring
      stroke = colors[0];
    } else {
      const r = generateGradient(colors, first * 2, last * 2);
      stroke = r.stroke;
      g = r.def;
    }
  }
  return (
    <svg
      className="lt-upset-line-line"
      viewBox={`0 0 ${(sets.length - 1) * 2} 2`}
      preserveAspectRatio="none"
      style={{ left: toPercent(1 / (sets.length + 1)), width: toPercent(1 - 2 / (sets.length + 1)) }}
    >
      {g}
      <path d={`M${first * 2},1 L${last * 2},1.001`} style={stroke ? { stroke } : undefined} />
    </svg>
  );
}

export function UpSetLine(props: UpSetLineProps): JSX.Element {
  const has = props.value instanceof Set ? props.value : new Set(props.value);
  const { sets } = props;
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
      {props.value != null && (
        <>
          {sets.map((s) => (
            <UpSetDot
              key={s}
              mode={has.has(s)}
              title={(has.has(s) ? i18n.upsetHas : i18n.upsetHasNot)(format(s, props.format))}
              // eslint-disable-next-line no-nested-ternary
              color={typeof props.color === 'string' ? props.color : props.color ? props.color(s) : undefined}
            />
          ))}
          <UpSetLineLine first={first} last={last} sets={sets} color={props.color} />
        </>
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

export function UpSetPartialLine(props: UpSetPartialLineProps): JSX.Element {
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
            title={(has ? i18n.upsetHasAll : partial ? i18n.upsetHasSome : i18n.upsetHasNone)(format(s, props.format))}
            color={typeof props.color === 'string' ? props.color : props.color ? props.color(s) : undefined}
          />
        );
      })}
    </div>
  );
}
