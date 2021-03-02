/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { IBoxPlot } from '@sgratzl/boxplots';
import React from 'react';
import { defaultColorScale, defaultScale } from '../math';
import type { CommonProps } from './common';
import { clsx, toLocaleString } from './utils';
import { BoxPlotChartVertical, BoxPlotProps, BoxPlotScaled } from './BoxPlot';

export interface BoxPlotArrayProps extends CommonProps {
  /**
   * the value to render
   */
  value: readonly Omit<IBoxPlot, 'items'>[];
  /**
   * optional scale to convert the number in the 0..1 range
   */
  scale?: (v: number) => number;
  /**
   * value or value to color function
   */
  color?: string | ((v: number, index: number) => string);
  /**
   * label for value to label function
   */
  format?: string | ((v: number, index: number) => string);

  i18n?: BoxPlotProps['i18n'];
}

export function BoxPlotArray(props: BoxPlotArrayProps): JSX.Element {
  const f = props.format;
  const c = props.color;
  const scale = props.scale ?? defaultScale;
  return (
    <div
      className={clsx('lt-heatmap-1d', props.className)}
      style={props.style}
      title={typeof props.format === 'string' ? props.format : undefined}
    >
      {(props.value ?? []).map((v, i) => {
        const s: BoxPlotScaled = {
          ...v,
          format: typeof f !== 'function' ? toLocaleString : (d: number) => f(d, i),
          color: typeof c === 'function' ? (d: number) => c(d, i) : defaultColorScale,
          scale,
        };
        // eslint-disable-next-line react/no-array-index-key
        return <BoxPlotChartVertical className="lt-heatmap-1d-cell" key={i} s={s} i18n={props.i18n} />;
      })}
    </div>
  );
}
