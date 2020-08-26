/**
 * @lineup-lite/app
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { IDataSet, IElem } from '../interfaces';
import data from './data.json';

const elems: IElem[] = data.map((d) => ({
  name: d.name,
}));

const got: IDataSet = {
  id: 'got_small',
  name: 'Game of Thrones Characters (small)',
  description: 'Game of Thrones characters data from https://github.com/ jeffreylancaster/game-of-thrones',
  author: 'Samuel Gratzl',
  load: () => {
    return Promise.resolve({
      elems,
    });
  },
};

export default got;
