import React from 'react';
import './styles.css';
import { UpSetLine } from '@lineup-lite/components';
import '@lineup-lite/components/dist/components.css';

export default function App() {
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
    </div>
  );
}
