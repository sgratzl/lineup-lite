/**
 * @lineup-lite/app
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { toJS } from 'mobx';
import { loadFile } from '../dump';
import Store from '../store/Store';
import { IDataSet, IElem } from './interfaces';
import { loadJSON } from '../dump';

export function exportJSON(store: Store) {
  const r = {
    elements: toJS(store.elems),
  };
  return JSON.stringify(r, null, 2);
}

export function fromDump(dump: any, id: string): IDataSet {
  return {
    id,
    name: dump.name,
    author: dump.author ?? 'Unknown',
    description: dump.description,
    creationDate: new Date(),
    load: () => {
      const elems = dump.elements;
      return Promise.resolve({
        elems,
      });
    },
  };
}

export function fromJSON(arr: ReadonlyArray<{ name: string; sets: string[] }>, id: string): IDataSet {
  const elems: (IElem & { sets: string[] })[] = arr.map((e, i) => Object.assign({}, { name: i.toString() }, e));
  return {
    id,
    name: id,
    author: 'Unknown',
    description: '',
    creationDate: new Date(),
    load: () => {
      return Promise.resolve({
        elems,
      });
    },
  };
}

export function importJSON(file: File | string): Promise<IDataSet> {
  if (typeof file === 'string') {
    return loadJSON<any>(file).then((dump) => {
      const name = file.includes('/') ? file.slice(file.lastIndexOf('/') + 1) : file;
      if (dump.$schema === 'https://lineup-lite.js.org/schema.1.0.0.json') {
        return fromDump(dump, name);
      }
      return fromJSON(dump, name);
    });
  }
  return loadFile<any>(file).then((dump) => {
    if (dump.$schema === 'https:///lineup-lite.js.org/schema.1.0.0.json') {
      return fromDump(dump, file.name);
    }
    return fromJSON(dump, file.name);
  });
}
