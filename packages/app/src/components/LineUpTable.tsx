import {
  asCategoricalColumn,
  asDateColumn,
  asNumberColumn,
  asStringColumn,
  BoxPlotRenderer,
  ColorRenderer,
  ProportionalSymbolRenderer,
  UseStatsColumnOptions,
} from '@lineup-lite/hooks';
import LineUpLite from '@lineup-lite/table';
import '@lineup-lite/table/dist/table.css';
import '@lineup-lite/hooks/dist/hooks.css';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import React from 'react';
import {
  Column,
  ColumnInstance,
  Row,
  UseFiltersColumnOptions,
  UseGlobalFiltersColumnOptions,
  UseGroupByColumnOptions,
  UseResizeColumnsColumnOptions,
} from 'react-table';
import { generateData } from '../data/genData';
import { useStore } from '../store';

declare type FullColumn<D extends object> = Column<D> &
  UseGroupByColumnOptions<D> &
  UseResizeColumnsColumnOptions<D> &
  UseFiltersColumnOptions<D> &
  UseGlobalFiltersColumnOptions<D> &
  UseStatsColumnOptions<D> & {
    aggregateValue?(value: any, row: Row<D>, column: ColumnInstance<D>): any;
  };

const useStyles = makeStyles(() => ({
  root: {
    flex: '1 1 0',
  },
  tr: {
    marginBottom: 2,
  },
  td: {
    marginRight: 1,
  },
}));

export interface IRow {
  string: string;
  number: number;
  number1: number;
  number2: number;
  date: Date;
  cat: 'c1' | 'c2' | 'c3';
}

const columns: FullColumn<IRow>[] = [
  asStringColumn({
    Header: 'String',
    accessor: 'string',
    minWidth: 100,
  }),
  asNumberColumn(
    {
      Header: 'Number',
      accessor: 'number',
      minWidth: 100,
    },
    { min: 0, max: 10 }
  ),
  asNumberColumn(
    {
      Header: 'Number',
      accessor: 'number1',
      minWidth: 100,
      Cell: ColorRenderer,
      Summary: BoxPlotRenderer,
      Aggregated: BoxPlotRenderer,
    },
    { min: 0, max: 10 }
  ),
  asNumberColumn(
    {
      Header: 'Number',
      accessor: 'number2',
      minWidth: 100,
      Cell: ProportionalSymbolRenderer,
    },
    { min: 0, max: 10 }
  ),
  asCategoricalColumn({
    Header: 'Cat',
    accessor: 'cat',
    minWidth: 100,
  }),
  asDateColumn({
    Header: 'Date',
    accessor: 'date',
    minWidth: 100,
  }),
];

export default observer(() => {
  const store = useStore();
  const classes = useStyles();

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400,
    }),
    []
  );
  const data = React.useMemo(
    () =>
      generateData({
        number: 3,
        date: 1,
      }) as IRow[],
    []
  );
  return (
    <div data-id={store} className={classes.root}>
      <LineUpLite<IRow>
        data={data}
        columns={columns}
        defaultColumn={defaultColumn}
        classNames={{
          tr: classes.tr,
          td: classes.td,
        }}
      />
    </div>
  );
});
