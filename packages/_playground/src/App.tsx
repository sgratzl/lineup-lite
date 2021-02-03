/**
 * @lineup-lite/example-basic
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useMemo } from 'react';
import './styles.css';
import LineUpLite, {
  asTextColumn,
  asNumberColumn,
  asCategoricalColumn,
  asCategoricalSetColumn,
  asNumbersColumn,
  LineUpLiteColumn,
  featureDefault,
  actionIconsRemixicon,
} from '@lineup-lite/table';
import { defaultDarkColorScale, defaultColorScale } from '@lineup-lite/components';
import { ColorRenderer, ProportionalSymbolRenderer } from '@lineup-lite/hooks';
import '@lineup-lite/components/src/style.css';
import '@lineup-lite/hooks/src/style.css';
import '@lineup-lite/table/src/style.css';
import { data, Row } from './data';

function Table({ isDarkTheme }: { isDarkTheme: boolean }) {
  const columns: LineUpLiteColumn<Row>[] = useMemo(
    () => [
      asTextColumn<Row>('name'),
      asNumberColumn<Row>('age', {
        color: isDarkTheme ? defaultDarkColorScale : defaultColorScale,
      }),
      asNumberColumn<Row>(
        {
          Header: 'Age',
          id: 'age2',
          accessor: (row) => row.age,
          Cell: ColorRenderer,
        },
        {
          color: isDarkTheme ? defaultDarkColorScale : defaultColorScale,
        }
      ),
      asNumberColumn<Row>(
        {
          Header: 'Age',
          id: 'age3',
          accessor: (row) => row.age,
          Cell: ProportionalSymbolRenderer,
        },
        {
          color: isDarkTheme ? defaultDarkColorScale : defaultColorScale,
        }
      ),
      asCategoricalColumn<Row>('shirtSize', {
        categories: ['S', 'M', 'L'],
      }),
      asCategoricalSetColumn<Row>('hobbies', {
        categories: ['running', 'cooking', 'reading'],
      }),
      asNumbersColumn<Row>('runningTimes'),
    ],
    [isDarkTheme]
  );

  const features = useMemo(() => featureDefault<Row>(), []);
  const icons = useMemo(() => actionIconsRemixicon(), []);

  return <LineUpLite<Row> data={data} columns={columns} features={features} icons={icons} dark={isDarkTheme} />;
}

export default function App() {
  const isDarkTheme = window.matchMedia != null && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return (
    <div className="App">
      <Table isDarkTheme={isDarkTheme} />
    </div>
  );
}
