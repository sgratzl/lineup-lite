/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { CellProps } from 'react-table';
import { INumberStats, defaultScale, defaultConstantColorScale, resolveNumberFormatter } from '@lineup-lite/components';
import type { BarRendererOptions } from './BarRenderer';
import type { UseStatsColumnProps } from '../hooks';
import { resolve } from './utils';
import type { UnknownObject } from '../interfaces';

export default function deriveNumberOptions<D extends UnknownObject, P extends CellProps<D, unknown>>(
  props: P,
  options: BarRendererOptions = {}
): {
  scale: (v: number) => number;
  color: (v: number) => string;
  format: (v: number) => string;
} {
  const col = props.column as Partial<UseStatsColumnProps>;
  const stats = col.statsValue as INumberStats | undefined;
  return {
    scale: resolve(options.scale, stats?.scale, () => defaultScale),
    color: resolve(options.color, stats?.color, () => defaultConstantColorScale),
    format: resolveNumberFormatter(resolve(options.format, stats?.format, () => ({}))),
  };
}
