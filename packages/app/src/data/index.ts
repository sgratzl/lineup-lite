/**
 * @lineup-lite/app
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import random from './random';
export { listLocal, saveLocal, deleteLocal } from './db';

export * from './interfaces';

export function listStatic() {
  return [random];
}
