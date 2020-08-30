/**
 * @lineup-lite/app
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

export interface IElem {
  name: string;
}

export declare type IElems = readonly IElem[];

export interface ILoadedDataSet {
  elems: IElems;
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
  elems: IElems;
}
