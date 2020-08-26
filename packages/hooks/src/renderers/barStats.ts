import { BarRendererOptions } from './BarRenderer';
import { CellProps } from 'react-table';
import { UseStatsColumnProps } from '../hooks';
import { INumberStats, defaultScale, defaultConstantColorScale, resolveNumberFormatter } from '../math';
import { resolve } from './utils';

export function deriveNumberOptions<D extends object, P extends CellProps<D, number>>(
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
