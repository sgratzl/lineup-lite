/**
 * @lineup-lite/app
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { unparse, parse } from 'papaparse';
import Store from '../store/Store';
import { IDataSet } from './interfaces';
import { fromJSON } from './exportJSON';
import { deriveDataSetName } from './utils';

export function exportCSV(store: Store) {
  return unparse([
    ['ID'],
    ...store.rows.map((c) => {
      // TODO
      return [c.id];
    }),
  ]);
}

export function importCSV(file: File | string): Promise<IDataSet> {
  const name = deriveDataSetName(file);
  return new Promise<IDataSet>((resolve) => {
    parse<{ [key: string]: string | number }>(file, {
      download: typeof file === 'string',
      dynamicTyping: true,
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const fields = results.meta.fields!;
        resolve(fromJSON(name, results.data, fields));
      },
    });
  });
}
