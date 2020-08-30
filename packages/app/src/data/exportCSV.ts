/**
 * @lineup-lite/app
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { unparse, parse } from 'papaparse';
import Store from '../store/Store';
import { IDataSet } from './interfaces';

export function exportCSV(store: Store) {
  return unparse([
    ['Name'],
    ...store.elems.map((c) => {
      return [c.name];
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

function findNameAttr(fields: string[]) {
  const fs = fields.map((f) => f.toLowerCase());
  if (fs.includes('name')) {
    return fields[fs.indexOf('name')];
  }
  if (fs.includes('id')) {
    return fields[fs.indexOf('id')];
  }
  return fields[0]; // first one
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
        const fields = results.meta.fields;
        const nameAttr = findNameAttr(fields);
        resolve({
          id: name,
          name,
          creationDate: new Date(),
          author: 'User',
          description: `imported from ${name}`,
          load: () => {
            const elems = results.data.map((e, i) => ({
              name: safeName(e[nameAttr], i),
            }));
            return Promise.resolve({
              elems,
            });
          },
        });
      },
    });
  });
}
