/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { BarRendererOptions } from './BarRenderer';
import type { CellProps } from 'react-table';
import type { UseStatsColumnProps } from '../hooks';
import { INumberStats, defaultScale, defaultConstantColorScale, resolveNumberFormatter } from '@lineup-lite/components';
import { resolve } from './utils';

export function deriveNumberOptions<D extends object, P extends CellProps<D, any>>(
  props: P,
  options: BarRendererOptions = {}
) {
  const col = props.column as Partial<UseStatsColumnProps>;
  const stats = col.statsValue as INumberStats | undefined;
  return {
    scale: resolve(options.scale, stats?.scale, () => defaultScale),
    color: resolve(options.color, stats?.color, () => defaultConstantColorScale),
    format: resolveNumberFormatter(resolve(options.format, stats?.format, () => ({}))),
  };
}
