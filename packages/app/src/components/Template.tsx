/**
 * @lineup-lite/app
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/core/styles';
import { useStore } from '../store';

const useStyles = makeStyles(() => ({
  root: {},
}));

export default observer(() => {
  const store = useStore();
  const classes = useStyles();
  return <div data-id={store} className={classes.root}></div>;
});
