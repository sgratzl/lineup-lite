/**
 * @lineup-lite/app
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    overflow: 'auto',
    position: 'relative',
    width: '15vw',
    borderLeft: `1px solid ${theme.palette.primary.main}`,
  },
  root: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default observer(() => {
  const classes = useStyles();
  return (
    <Paper className={classes.wrapper}>
      <div className={classes.root}></div>
    </Paper>
  );
});
