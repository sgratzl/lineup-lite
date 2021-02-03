/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { CSSProperties } from 'react';
import type { ActionIcons } from '../../icons';
import type { LineUpLiteComponentLike } from '../interfaces';
import type { SIDE_PANEL_I18N_EN } from './LineUpLiteDataSummary';

export type MultiCustomizeSidePanelKeys = 'dataSummary';

export interface CustomizeLineUpSidePanelProps {
  /**
   * hook for adding extra CSS classnames
   */
  classNames?: Partial<Record<MultiCustomizeSidePanelKeys, string>>;
  /**
   * hoop for adding extra styles
   */
  styles?: Partial<Record<MultiCustomizeSidePanelKeys, CSSProperties>>;

  i18n?: Partial<typeof SIDE_PANEL_I18N_EN>;

  components?: Partial<Record<MultiCustomizeSidePanelKeys | 'sidePanel', LineUpLiteComponentLike>>;

  dark?: boolean;
}

export interface LineUpLiteSidePanelProps extends CustomizeLineUpSidePanelProps {
  className?: string;
  style?: CSSProperties;
  icons?: Partial<ActionIcons>;
}
