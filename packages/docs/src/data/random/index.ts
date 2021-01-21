import {
  defaultColorScale,
  defaultConstantColorScale,
  defaultConstantDarkColorScale,
  defaultDarkColorScale,
} from '@lineup-lite/components';
import {
  asCategoricalColumn,
  asDateColumn,
  asNumberColumn,
  asStringColumn,
  BoxPlotRenderer,
  ColorRenderer,
  FullColumn,
  ProportionalSymbolRenderer,
} from '@lineup-lite/hooks';
import { generateData } from './genData';

export interface IRandomRow {
  string: string;
  number: number;
  number1: number;
  number2: number;
  date: Date;
  cat: 'c1' | 'c2' | 'c3';
}

const defaultColumn: Partial<FullColumn<IRandomRow>> = {
  minWidth: 30,
  width: 150,
  maxWidth: 400,
  // canHide: false, // TODO
};

export default function create(darkTheme: boolean) {
  const columns: FullColumn<IRandomRow>[] = [
    asStringColumn({
      Header: 'String',
      accessor: 'string',
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

  const rows = generateData({
    number: 3,
    date: 1,
  }) as IRandomRow[];

  return Promise.resolve({
    rows,
    defaultColumn: defaultColumn,
    columns,
  });
}
