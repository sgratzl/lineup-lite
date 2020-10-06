import LineUpLite from '@lineup-lite/table';
import '@lineup-lite/table/dist/table.css';
import '@lineup-lite/hooks/dist/hooks.css';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../store';
import { IRow } from 'data';

const useStyles = makeStyles(() => ({
  root: {
    flex: '1 1 0',
  },
  tr: {
    marginBottom: 2,
  },
}));

export default observer(() => {
  const store = useStore();
  const classes = useStyles();
  return (
    <div data-id={store} className={classes.root}>
      <LineUpLite<IRow>
        data={store.rows}
        columns={store.columns}
        defaultColumn={store.defaultColumn}
        classNames={{
          tr: classes.tr,
        }}
      />
    </div>
  );
});
