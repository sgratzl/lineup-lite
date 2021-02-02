/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { HeaderGroup } from 'react-table';
import type { ActionIcons } from '../icons';
import type { LineUpLiteI18N } from '../i18n';
import type { UseLineUpLiteOptions } from './useLineUpLite';
import type { ComponentType, CSSProperties, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import type { LineUpLiteDataSummaryProps } from './panel';

export type MultiCustomizeKeys =
  | 'tbody'
  | 'tr'
  | 'thead'
  | 'th'
  | 'thGroup'
  | 'td'
  | 'header'
  | 'sidePanel'
  | 'dataSummary'
  | 'sortHierarchy'
  | 'groupHierarchy';

export type LineUpLiteComponentLike = ComponentType<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>>;

export interface CustomizeLineUpProps {
  /**
   * hook for adding extra CSS classnames
   */
  classNames?: Partial<Record<MultiCustomizeKeys, string>>;
  /**
   * hoop for adding extra styles
   */
  styles?: Partial<Record<MultiCustomizeKeys, CSSProperties>>;

  i18n?: Partial<LineUpLiteI18N> & LineUpLiteDataSummaryProps['i18n'];

  components?: Partial<Record<MultiCustomizeKeys | 'table', LineUpLiteComponentLike>>;
}

export interface ActionLineUpProps<D extends object> {
  /**
   * customize the icons to use
   */
  icons?: Partial<ActionIcons>;

  /**
   * callback for generating extra toolbar actions for a column
   */
  actions?: (column: HeaderGroup<D>) => ReactNode;
}

export interface LineUpLiteProps<D extends object>
  extends UseLineUpLiteOptions<D>,
    ActionLineUpProps<D>,
    CustomizeLineUpProps {
  className?: string;
  style?: CSSProperties;
  dark?: boolean;
  icons?: Partial<ActionIcons>;
  i18n?: UseLineUpLiteOptions<D>['i18n'] & CustomizeLineUpProps['i18n'];
  onStateChange?: (state: any) => void;
}

export interface LineUpLiteStateInfo {
  visibleColumnCount: number;
  sortedColumnCount: number;
  groupedColumnCount: number;
}
