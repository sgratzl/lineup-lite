/**
 * @lineup-lite/app
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */
import { FullColumn } from '@lineup-lite/table';

export interface IRow {
  id: string;
  [key: string]: string | Date | number | boolean | null;
}

export type IRows = IRow[];

export type IColumn<T extends IRow = IRow> = FullColumn<T>;

export type IColumns<T extends IRow = IRow> = IColumn<T>[];

export interface ILoadedDataSet {
  rows: IRows;
  columns: IColumns;
  defaultColumn: Partial<IColumn>;
}

export interface IDataSet {
  uid?: string;
  id: string;

  name: string;
  description: string;
  author: string;
  creationDate?: Date;
  load(): Promise<ILoadedDataSet>;
}

export interface IDumpInfo {
  ds: IDataSet;
  rows: IRows;
}
