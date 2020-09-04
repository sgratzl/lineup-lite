export * from './useStats';
export * from './useRowSelectColumn';
export * from './useRowExpandColumn';

export function isSupportColumn(col: any) {
  return col != null && col.support === true;
}
