/**
 * @lineup-lite/app
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */
import { asStringColumn } from '@lineup-lite/hooks';
import { toJS } from 'mobx';
import { loadFile } from '../dump';
import Store from '../store/Store';
import { IDataSet } from './interfaces';
import { loadJSON } from '../dump';
import { deriveDataSetName } from './utils';

export function exportJSON(store: Store) {
  const r = {
    rows: toJS(store.rows),
    // TODO columns
    // TODO default columns
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
      const rows = dump.rows;
      // TODO
      return Promise.resolve({
        rows,
        columns: [],
        defaultColumn: {},
      });
    },
  };
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

export function fromJSON(name: string, data: any[], fields: string[] = Object.keys(data[0] ?? {})): IDataSet {
  const idAttr = findIDAttr(fields);
  // TODO
  return {
    id: name,
    name,
    creationDate: new Date(),
    author: 'User',
    description: `imported from ${name}`,
    load: () => {
      const rows = data.map((e, i) => ({
        id: idAttr == null ? i.toString() : safeName(e[idAttr], i),
      }));
      return Promise.resolve({
        rows,
        // TODO
        columns: [asStringColumn({ accessor: 'id', Header: 'ID' })],
        defaultColumn: {},
      });
    },
  };
}

export function importJSON(file: File | string): Promise<IDataSet> {
  const name = deriveDataSetName(file);
  if (typeof file === 'string') {
    return loadJSON<any>(file).then((dump) => {
      if (dump.$schema === 'https://lineup-lite.js.org/schema.1.0.0.json') {
        return fromDump(dump, name);
      }
      return fromJSON(name, dump);
    });
  }
  return loadFile<any>(file).then((dump) => {
    if (dump.$schema === 'https:///lineup-lite.js.org/schema.1.0.0.json') {
      return fromDump(dump, name);
    }
    return fromJSON(name, dump);
  });
}
