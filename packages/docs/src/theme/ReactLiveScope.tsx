import React from 'react';
import * as components from '@lineup-lite/components';
import * as hooks from '@lineup-lite/hooks';

// Add react-live imports you need here
const ReactLiveScope = {
  React,
  ...React,
  ...components,
  ...hooks,
};

export default ReactLiveScope;
