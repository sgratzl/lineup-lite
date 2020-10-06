import React from 'react';
import { CellProps } from 'react-table';

export function GroupValueRenderer<D extends object, P extends CellProps<D, any>>(props: P) {
  const value = (props.row as any).groupByVal ?? props.value;
  return <div className="lt-group">{value}</div>;
}
