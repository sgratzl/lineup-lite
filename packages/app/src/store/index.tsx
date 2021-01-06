/**
 * @lineup-lite/app
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import Store from './Store';
import { useLocalStore } from 'mobx-react-lite';

const storeContext = React.createContext<Store | null>(null);

export const StoreProvider: React.FC = ({ children }) => {
  const store = useLocalStore(() => new Store());
  return <storeContext.Provider value={store}> {children} </storeContext.Provider>;
};

export const useStore = () => {
  const store = React.useContext(storeContext);
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return store;
};
