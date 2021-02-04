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

export type MultiCustomizePanelKeys = 'dataSummary';

export interface CustomizeLineUpPanelProps {
  /**
   * hook for adding extra CSS classnames
   */
  classNames?: Partial<Record<MultiCustomizePanelKeys, string>>;
  /**
   * hoop for adding extra styles
   */
  styles?: Partial<Record<MultiCustomizePanelKeys, CSSProperties>>;

  i18n?: Partial<typeof SIDE_PANEL_I18N_EN>;

  components?: Partial<Record<MultiCustomizePanelKeys | 'sidePanel', LineUpLiteComponentLike>>;

  dark?: boolean;
}

export interface LineUpLitePanelProps extends CustomizeLineUpPanelProps {
  className?: string;
  style?: CSSProperties;
  icons?: Partial<ActionIcons>;
}
