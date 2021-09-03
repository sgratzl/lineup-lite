/**
 * @lineup-lite/example-components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import './styles.css';
import { UpSetLine, HeatMap1D } from '@lineup-lite/components';
import '@lineup-lite/components/dist/components.css';

export default function App(): JSX.Element {
  const isDarkTheme = window.matchMedia != null && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return (
    <div className="App">
      Hello {isDarkTheme}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <UpSetLine value={['a', 'b']} sets={['a', 'b', 'c']} style={{ flex: '1 1 0' }} />
        <UpSetLine value={['a', 'c']} sets={['a', 'b', 'c']} style={{ flex: '1 1 0' }} />
        <UpSetLine value={['a']} sets={['a', 'b', 'c']} style={{ flex: '1 1 0' }} />
        <UpSetLine value={['b']} sets={['a', 'b', 'c']} style={{ flex: '1 1 0' }} />
        <UpSetLine value={['b', 'c']} sets={['a', 'b', 'c']} style={{ flex: '1 1 0' }} />
        <UpSetLine value={['b', 'c', 'g']} sets={['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']} style={{ flex: '1 1 0' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <HeatMap1D value={[0, 0.5, 1]} style={{ flex: '1 1 0' }} />
        <HeatMap1D value={[0.1, 0.2, 0.1, 0.7, 0.3, 0.5, 1]} style={{ flex: '1 1 0' }} />
      </div>
    </div>
  );
}
