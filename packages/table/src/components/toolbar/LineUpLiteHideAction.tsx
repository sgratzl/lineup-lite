/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { ComponentType, ReactNode, useCallback } from 'react';
import type { ColumnInstance } from 'react-table';
import type { CommonProps } from '@lineup-lite/components';
import { LINEUP_LITE_I18N_EN } from '../../i18n';
import { useLineUpLiteTableContext } from '../contexts';
import { clsx } from '../utils';
import type { UnknownObject } from '../interfaces';

export default function LineUpLiteHideAction<D extends UnknownObject = UnknownObject>(
  props: ColumnInstance<D> &
    CommonProps & {
      children?: ReactNode;
      canHide?: boolean;
      canResize?: boolean;
      icon: ComponentType;
    }
): JSX.Element {
  const c = useLineUpLiteTableContext();
  const i18n = c?.i18n ?? LINEUP_LITE_I18N_EN;
  const { toggleHidden } = props;
  const hide = useCallback(() => toggleHidden(true), [toggleHidden]);
  return props.canResize && props.canHide !== false ? (
    <button
      {...props.getToggleHiddenProps({
        className: clsx('lt-action', 'lt-action-hide', !props.isVisible && 'lt-action-active', props.className),
        style: props.style,
      })}
      type="button"
      onClick={hide}
      title={i18n.hideColumn}
    >
      <props.icon />
      {props.children}
    </button>
  ) : (
    <></>
  );
}
