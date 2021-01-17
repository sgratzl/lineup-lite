import LineUpLite, { LineUpLiteVirtual, useDefaultFeatures } from '@lineup-lite/table';
import '@lineup-lite/table/dist/table.css';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../store';
import { IRow } from 'data';
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
  root: {
    flex: '1 1 0',
    display: 'flex',
    position: 'relative',
  },
  tr: {
    marginBottom: 2,
  },
  scrollWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
  },
  vTable: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
}));

export default observer(() => {
  const plugins = React.useMemo(() => useDefaultFeatures<IRow>(), []);
  const store = useStore();
  const classes = useStyles();
  const virtual = store.rows.length > 1000;
  return (
    <div className={clsx(classes.root)}>
      {!virtual ? (
        <div className={classes.scrollWrapper}>
          <LineUpLite<IRow>
            data={store.rows}
            columns={store.columns}
            defaultColumn={store.defaultColumn}
            classNames={{
              tr: classes.tr,
            }}
            plugins={plugins}
          />
        </div>
      ) : (
        <LineUpLiteVirtual<IRow>
          className={classes.vTable}
          data={store.rows}
          columns={store.columns}
          defaultColumn={store.defaultColumn}
          estimatedSize={[21, 42]}
          rowSpacing={2}
          classNames={{
            tr: classes.tr,
          }}
          plugins={plugins}
        />
      )}
    </div>
  );
});
