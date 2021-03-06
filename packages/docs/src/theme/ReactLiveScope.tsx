/**
 * @lineup-lite/docs
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import * as components from '@lineup-lite/components';
import * as hooks from '@lineup-lite/hooks';
import * as table from '@lineup-lite/table';
import '@lineup-lite/table/dist/table.css';
import * as rtable from 'react-table';

// eslint-disable-next-line no-restricted-globals
// ((typeof window !== 'undefined' ? window : global) as any).regeneratorRuntime = regeneratorRuntime;

// Add react-live imports you need here
const ReactLiveScope = {
  ...rtable,
  ...components,
  ...hooks,
  ...table,
  React,
  ...React,
};
delete ReactLiveScope.default;

export default ReactLiveScope;
