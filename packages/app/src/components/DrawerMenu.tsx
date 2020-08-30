/**
 * @lineup-lite/app
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../store';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import Copyright from 'mdi-material-ui/Copyright';
import License from 'mdi-material-ui/License';
import Information from 'mdi-material-ui/Information';
import ListSubheader from '@material-ui/core/ListSubheader';

declare const __VERSION__: string;

const useStyles = makeStyles(() => ({
  grow: {
    flexGrow: 1,
  },
}));

export default observer(() => {
  const classes = useStyles();
  const store = useStore();
  return (
    <>
      <Divider />
      <List>
        <ListSubheader>Options</ListSubheader>
        <ListItem button onClick={store.ui.toggleZen}>
          <ListItemIcon>
            <Switch checked={store.ui.zen} />
          </ListItemIcon>
          <ListItemText>Zen Mode</ListItemText>
        </ListItem>
        <ListItem button onClick={store.ui.toggleTheme}>
          <ListItemIcon>
            <Switch checked={store.ui.theme === 'dark'} />
          </ListItemIcon>
          <ListItemText>Dark Theme</ListItemText>
        </ListItem>
      </List>
      <div className={classes.grow} />
      <Divider />
      <List dense disablePadding>
        <ListSubheader>About</ListSubheader>
        <ListItem>
          <ListItemIcon>
            <Information />
          </ListItemIcon>
          <ListItemText>v{__VERSION__}</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <License />
          </ListItemIcon>
          <ListItemText>
            <Link
              href="https://github.com/sgratzl/lineup-lite/blob/master/LICENSE.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              MPL-2.0
            </Link>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Copyright />
          </ListItemIcon>
          <ListItemText>
            <Link href="https://www.sgratzl.com" target="_blank" rel="noopener noreferrer">
              Samuel Gratzl
            </Link>
            {', 2020'}
          </ListItemText>
        </ListItem>
      </List>
    </>
  );
});
