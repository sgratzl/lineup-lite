/**
 * @lineup-lite/app
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import 'core-js/stable';
import 'regenerator-runtime';
import './index.css';

import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { optimizeScheduler } from 'mobx-react-lite';
import Skeleton from './components/Skeleton';

optimizeScheduler(ReactDOM.unstable_batchedUpdates as any);

const App = lazy(() => import('./components/App'));

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<Skeleton />}>
      <App />
    </Suspense>
  </React.StrictMode>,
  document.querySelector('#app')
);

// register service worker
if (process.env.PRODUCTION && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.warn('SW registration failed: ', registrationError);
      });
  });
}
