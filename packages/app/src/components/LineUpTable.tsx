import LineUpLite, { LineUpLiteVirtual } from '@lineup-lite/table';
import '@lineup-lite/table/dist/table.css';
import '@lineup-lite/hooks/dist/hooks.css';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../store';
import { IRow } from 'data';
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
  root: {
    flex: '1 1 0',
  },
  tr: {
    marginBottom: 2,
  },
  virtual: {
    display: 'flex',
  },
  vtable: {
    flex: '1 1 0',
  },
}));

export default observer(() => {
  const store = useStore();
  const classes = useStyles();
  const virtual = store.rows.length > 1000;
  return (
    <div data-id={store} className={clsx(classes.root, virtual && classes.virtual)}>
      {!virtual ? (
        <LineUpLite<IRow>
          data={store.rows}
          columns={store.columns}
          defaultColumn={store.defaultColumn}
          classNames={{
            tr: classes.tr,
          }}
        />
      ) : (
        <LineUpLiteVirtual<IRow>
          className={classes.vtable}
          data={store.rows}
          columns={store.columns}
          defaultColumn={store.defaultColumn}
          estimatedSize={23}
          classNames={{
            tr: classes.tr,
          }}
        />
      )}
    </div>
  );
});
