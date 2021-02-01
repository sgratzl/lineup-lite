/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { ComponentType, useCallback, useContext } from 'react';
import type { ColumnInstance } from 'react-table';
import { LINEUP_LITE_I18N_EN } from '../../i18n';
import { LineUpLiteContext } from '../contexts';
import { clsx } from '../utils';

export function LineUpLiteHideAction(
  props: ColumnInstance<any> & { canHide?: boolean; canResize?: boolean; icon: ComponentType }
) {
  const c = useContext(LineUpLiteContext);
  const i18n = c?.i18n ?? LINEUP_LITE_I18N_EN;
  const { toggleHidden } = props;
  const hide = useCallback(() => toggleHidden(true), [toggleHidden]);
  return props.canResize && props.canHide !== false ? (
    <button
      {...props.getToggleHiddenProps({
        className: clsx('lt-action', 'lt-action-hide', !props.isVisible && 'lt-action-active'),
      })}
      onClick={hide}
      title={i18n.hideColumn}
    >
      {<props.icon />}
    </button>
  ) : null;
}
