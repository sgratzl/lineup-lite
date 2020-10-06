/**
 * @lineup-lite/app
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { asStringColumn } from '@lineup-lite/hooks';
import { unparse, parse } from 'papaparse';
import Store from '../store/Store';
import { IDataSet } from './interfaces';

export function exportCSV(store: Store) {
  return unparse([
    ['ID'],
    ...store.rows.map((c) => {
      return [c.id];
    }),
  ]);
}

function deriveDataSetName(file: File | string) {
  let name: string = '';
  if (typeof file === 'string') {
    // url
    name = file.includes('/') ? file.slice(file.lastIndexOf('/') + 1) : file;
  } else {
    name = file.name;
  }
  return name.includes('.') ? name.slice(0, name.lastIndexOf('.')) : name;
}

function findIDAttr(fields: string[]) {
  const fs = fields.map((f) => f.toLowerCase());
  if (fs.includes('id')) {
    return fields[fs.indexOf('id')];
  }
  if (fs.includes('name')) {
    return fields[fs.indexOf('name')];
  }
  return null;
}

function safeName(name: string | undefined | number, i: number) {
  if (name != null) {
    return name.toString();
  }
  return i.toString();
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
        const nameAttr = findIDAttr(fields);
        resolve({
          id: name,
          name,
          creationDate: new Date(),
          author: 'User',
          description: `imported from ${name}`,
          load: () => {
            const rows = results.data.map((e, i) => ({
              id: nameAttr == null ? i.toString() : safeName(e[nameAttr], i),
              // TODO other columns
            }));
            return Promise.resolve({
              rows,
              columns: [asStringColumn({ accessor: 'id', Header: 'ID' })],
              defaultColumn: {},
            });
          },
        });
      },
    });
  });
}
