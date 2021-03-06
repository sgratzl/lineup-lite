/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { CSSProperties, ReactNode } from 'react';
import type { CommonProps } from '@lineup-lite/components';
import type { ActionLineUpProps, AnyObject, LineUpLiteComponentLike, UnknownObject } from '../interfaces';
import type { DATA_SUMMARY_I18N_EN } from './LineUpLiteDataSummary';

export type MultiCustomizePanelKeys = 'dataSummary' | 'tableSummary' | 'th' | 'header';

export interface CustomizeLineUpPanelProps {
  /**
   * hook for adding extra CSS classnames
   */
  classNames?: Partial<Record<MultiCustomizePanelKeys, string>>;
  /**
   * hoop for adding extra styles
   */
  styles?: Partial<Record<MultiCustomizePanelKeys, CSSProperties>>;

  i18n?: Partial<typeof DATA_SUMMARY_I18N_EN>;

  components?: Partial<Record<MultiCustomizePanelKeys | 'panel', LineUpLiteComponentLike>>;

  dark?: boolean;
}

export interface LineUpLitePanelProps<D extends AnyObject = UnknownObject>
  extends CustomizeLineUpPanelProps,
    ActionLineUpProps<D>,
    CommonProps {
  children?: ReactNode;
}
