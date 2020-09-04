/**
 * @lineup-lite/app
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

// import got_small from './got_small';
export { listLocal, saveLocal, deleteLocal } from './db';

export * from './interfaces';

export function listStatic() {
  return [];
}
