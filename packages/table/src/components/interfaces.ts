/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ColumnInstance } from 'react-table';
import type { ComponentType, CSSProperties, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import type { CommonProps } from '@lineup-lite/components';
import type { UnknownObject } from '@lineup-lite/hooks';
import type { ActionIcons } from '../icons';
import type { LineUpLiteI18N } from '../i18n';
import type { UseLineUpLiteOptions } from './useLineUpLite';

export type { ColumnInstance, HeaderGroup, Row, Column } from 'react-table';
export type { UnknownObject } from '@lineup-lite/hooks';

export type MultiCustomizeKeys = 'tbody' | 'tr' | 'thead' | 'th' | 'thGroup' | 'td' | 'header';

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

  i18n?: Partial<LineUpLiteI18N>;

  components?: Partial<Record<MultiCustomizeKeys | 'table', LineUpLiteComponentLike>>;

  dark?: boolean;
}

export interface ActionLineUpProps<D extends UnknownObject = UnknownObject> {
  /**
   * customize the icons to use
   */
  icons?: Partial<ActionIcons>;

  /**
   * callback for generating extra toolbar actions for a column
   */
  actions?: (column: ColumnInstance<D>, icons: ActionIcons) => ReactNode;
}

export interface LineUpLiteProps<D extends UnknownObject = UnknownObject>
  extends UseLineUpLiteOptions<D>,
    ActionLineUpProps<D>,
    CustomizeLineUpProps,
    CommonProps {
  icons?: Partial<ActionIcons>;
  i18n?: UseLineUpLiteOptions<D>['i18n'] & CustomizeLineUpProps['i18n'];
  children?: ReactNode;
}
