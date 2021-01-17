/**
 * @lineup-lite/app
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { observer } from 'mobx-react-lite';
import React from 'react';
import { StoreProvider, useStore } from '../store';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Content from '../components/Content';
// import gray from '@material-ui/core/colors/gray';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});
const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    // secondary: gray,
  },
});

const AppWrapper = observer(() => {
  const store = useStore();
  return (
    <ThemeProvider theme={store.ui.theme === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <Content />
    </ThemeProvider>
  );
});

export default function App() {
  return (
    <StoreProvider>
      <AppWrapper />
    </StoreProvider>
  );
}
