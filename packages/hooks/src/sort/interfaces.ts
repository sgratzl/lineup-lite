/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { Row } from 'react-table';
import type { UnknownObject } from '../interfaces';
import type { AnyObject } from '../types';

export type RowCompareFunction<O extends AnyObject = UnknownObject> = (
  a: Row<UnknownObject>,
  b: Row<UnknownObject>,
  columnId: string,
  options?: O
) => number;
