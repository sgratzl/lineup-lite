/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

export * from './components';
export { LineUpLite as default } from './components';
export * from './icons';
export * from './i18n';
export {
  asCategoricalColumn,
  asCategoricalSetColumn,
  asDateColumn,
  asNumberBoxPlotColumn,
  asStackedNumberColumn,
  asDivergingNumberColumn,
  asNumbersColumn,
  asTextColumn,
  asNumberColumn,
  deriveColumn,
  deriveColumns,
  LineUpLiteColumn,
  asNumbersLineChartColumn,
  asColumn,
} from '@lineup-lite/hooks';

export type { TableInstance, Cell } from 'react-table';
