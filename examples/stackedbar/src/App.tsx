/**
 * @lineup-lite/example-basic
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useMemo } from 'react';
import './styles.css';
import { defaultConstantColorScale, defaultConstantDarkColorScale } from '@lineup-lite/components';
import LineUpLite, {
  asTextColumn,
  asStackedNumberColumn,
  LineUpLiteColumn,
  featureDefault,
  actionIconsRemixicon,
} from '@lineup-lite/table';
import '@lineup-lite/table/table.css';
import { data, Row } from './data';

function Table({ isDarkTheme }: { isDarkTheme: boolean }) {
  const columns: LineUpLiteColumn<Row>[] = useMemo(
    () => [
      asTextColumn<Row>('name'),
      asStackedNumberColumn<Row>(
        'Stacked Bar',
        [
          {
            col: 'a',
            weight: 1,
          },
          {
            col: 'b',
            weight: 1,
          },
          {
            col: 'c',
            weight: 1,
          },
        ],
        {
          color: isDarkTheme ? defaultConstantDarkColorScale : defaultConstantColorScale,
          min: 0,
        }
      ),
    ],
    [isDarkTheme]
  );

  const features = useMemo(() => featureDefault<Row>(), []);
  const icons = useMemo(() => actionIconsRemixicon(), []);

  return <LineUpLite<Row> data={data} columns={columns} features={features} icons={icons} dark={isDarkTheme} />;
}

export default function App(): JSX.Element {
  const isDarkTheme = window.matchMedia != null && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return (
    <div className="App">
      <Table isDarkTheme={isDarkTheme} />
    </div>
  );
}
