import {
  asCategoricalColumn,
  asDateColumn,
  asNumberColumn,
  asStringColumn,
  BoxPlotRenderer,
  ColorRenderer,
  ProportionalSymbolRenderer,
} from '@lineup-lite/hooks';
import {
  defaultDarkColorScale,
  defaultConstantDarkColorScale,
  defaultColorScale,
  defaultConstantColorScale,
} from '@lineup-lite/components';
import { generateData } from './genData';
import { IDataSet, IRow, IColumn } from '../interfaces';

export interface IRandomRow extends IRow {
  string: string;
  number: number;
  number1: number;
  number2: number;
  date: Date;
  cat: 'c1' | 'c2' | 'c3';
}

const defaultColumn: Partial<IColumn<IRandomRow>> = {
  minWidth: 30,
  width: 150,
  maxWidth: 400,
  canHide: false,
};

const rows = (generateData({
  number: 3,
  date: 1,
}) as IRandomRow[]).map((row) => {
  row.id = row.string;
  return row;
});

const random: IDataSet = {
  id: 'random',
  author: 'Samuel Gratzl',
  description: 'Randomly generated dataset',
  name: 'Random',
  creationDate: new Date(),
  load: ({ darkTheme }) => {
    const columns: IColumn<IRandomRow>[] = [
      asStringColumn({
        Header: 'ID',
        accessor: 'id',
        minWidth: 100,
      }),
      asCategoricalColumn({
        Header: 'Cat',
        accessor: 'cat',
        minWidth: 100,
      }),
      asNumberColumn(
        {
          Header: 'Number',
          accessor: 'number',
          minWidth: 100,
        },
        { min: 0, max: 10, color: darkTheme ? defaultDarkColorScale : defaultColorScale }
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
        { min: 0, max: 10, color: darkTheme ? defaultDarkColorScale : defaultColorScale }
      ),
      asNumberColumn(
        {
          Header: 'Number',
          accessor: 'number2',
          minWidth: 100,
          Cell: ProportionalSymbolRenderer,
        },
        { min: 0, max: 10, color: darkTheme ? defaultDarkColorScale : defaultColorScale }
      ),
      asDateColumn(
        {
          Header: 'Date',
          accessor: 'date',
          minWidth: 100,
        },
        {
          color: darkTheme ? defaultConstantDarkColorScale : defaultConstantColorScale,
        }
      ),
    ];
    return Promise.resolve({
      rows,
      defaultColumn: defaultColumn as Partial<IColumn>,
      columns: columns as IColumn[],
    });
  },
};

export default random;
