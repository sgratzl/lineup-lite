/**
 * @lineup-lite/app
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import Dexie from 'dexie';
import { IDataSet } from './interfaces';
import Store from '../store/Store';

const SCHEMA_VERSION = 1;

export interface IStoredDump {
  uid?: string;
  name: string;
  creationDate: number;
}

declare type LineUpLiteDB = Dexie & {
  datasets: Dexie.Table<IStoredDump, number>;
};

let db: LineUpLiteDB | null = null;

function getDB(): Promise<LineUpLiteDB> {
  if (db) {
    return Promise.resolve(db);
  }
  return import('dexie')
    .then((dexie) => {
      //
      // Declare Database
      //
      class LineUpLiteDBImpl extends dexie.default {
        datasets: Dexie.Table<IStoredDump, number>;

        constructor() {
          super('LineUp Lite App DB');
          this.version(SCHEMA_VERSION).stores({
            datasets: '++uid,id,name,creationDate',
          });
          // hack for linting
          this.datasets = (this as any).datasets || undefined;
        }
      }

      return new LineUpLiteDBImpl();
    })
    .then((impl) => (db = impl));
}

function asDataSet(dump: IStoredDump): IDataSet {
  dump.uid = dump.uid!;
  // dump.creationDate = new Date(dump.creationDate);
  return dump as any;
}

function byCreationDate(arr: IStoredDump[]) {
  return arr.sort((a, b) => b.creationDate - a.creationDate);
}

export function listLocal(): Promise<IDataSet[]> {
  return getDB()
    .then((db) => (db.datasets ? db.datasets.toArray() : []))
    .then(byCreationDate)
    .then((d) => d.map(asDataSet));
}

export function deleteLocal(dataset: IDataSet): Promise<any> {
  return getDB().then((db) =>
    db.transaction('rw', db.datasets, () => Promise.all([db.datasets.where('uid').equals(dataset.uid!).delete()]))
  );
}

export function saveLocal(_store: Store): Promise<IDataSet> {
  const dump: IStoredDump = Object.assign({
    creationDate: Date.now(),
  });
  dump.name = `${dump.name} - Local`;
  return getDB()
    .then((db) => db.datasets.add(dump))
    .then((uid) => asDataSet(Object.assign(dump, { uid })));
}
