import { USE_EXPAND_COLUMN_I18N_EN, USE_ROW_SELECT_COLUMN_I18N_EN } from '@lineup-lite/hooks';
import {
  BOXPLOT_I18N_EN,
  FILTER_BIN_I18N_EN,
  FILTER_RANGE_I18N_EN,
  TEXT_SUMMARY_I18N_EN,
} from '@lineup-lite/components';

export const LINEUP_LITE_I18N_EN = {
  hideColumn: 'Click to hide this props',
  groupByRemoveColumn: 'Click to not longer group by this column',
  groupByAnotherColumn: 'Click to solely group by this column or use Shift+Click to also group by this column',
  groupByColumn: 'Click to group by this column',
  sortByColumn: 'Click to sort by this column in ascending order',
  sortByColumnDesc: 'Click to sort by this column in descending order',
  sortByRemoveColumn: 'Click to not longer sort by this column',
  sortByAnotherColumn:
    'Click to solely sort by this column in ascending order or use Shift-Click to also by this column',
  sortByAnotherColumnDesc:
    'Click to solely sort by this column in descending order or use Shift-Click to also by this column',

  ...USE_EXPAND_COLUMN_I18N_EN,
  ...USE_ROW_SELECT_COLUMN_I18N_EN,
  ...BOXPLOT_I18N_EN,
  ...FILTER_BIN_I18N_EN,
  ...FILTER_RANGE_I18N_EN,
  ...TEXT_SUMMARY_I18N_EN,
};

export type LineUpLiteI18N = typeof LINEUP_LITE_I18N_EN;
