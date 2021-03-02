/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import type { CellProps } from 'react-table';
import type { UnknownObject } from '../interfaces';

export default function GroupValueRenderer<D extends UnknownObject, P extends CellProps<D, unknown>>(
  props: P
): JSX.Element {
  const value = ((props.row as unknown) as { groupByVal?: string }).groupByVal ?? props.value;
  return <div className="lt-group">{String(value)}</div>;
}
