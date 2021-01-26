import regeneratorRuntime from 'regenerator-runtime';
import 'regenerator-runtime/runtime';
import React from 'react';
import * as components from '@lineup-lite/components';
import * as hooks from '@lineup-lite/hooks';
import * as table from '@lineup-lite/table';
import '@lineup-lite/table/dist/table.css';
import * as rtable from 'react-table';

// eslint-disable-next-line no-restricted-globals
((typeof window !== 'undefined' ? window : global) as any).regeneratorRuntime = regeneratorRuntime;

// Add react-live imports you need here
const ReactLiveScope = {
  regeneratorRuntime,
  ...rtable,
  ...components,
  ...hooks,
  ...table,
  React,
  ...React,
};
delete ReactLiveScope.default;

export default ReactLiveScope;
