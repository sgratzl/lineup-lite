/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { Row } from 'react-table';
import type { UnknownObject } from '../interfaces';

export type RowCompareFunction = (a: Row<UnknownObject>, b: Row<UnknownObject>, columnId: string) => number;
