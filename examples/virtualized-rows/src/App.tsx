/**
 * @lineup-lite/example-virtualized-rows
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useMemo } from 'react';
import './styles.css';
import {
  LineUpLiteVirtual,
  asTextColumn,
  asNumberBoxPlotColumn,
  asCategoricalColumn,
  LineUpLiteColumn,
  featureDefault,
  actionIconsRemixicon,
} from '@lineup-lite/table';
import { defaultDarkColorScale, defaultColorScale } from '@lineup-lite/components';
import '@lineup-lite/table/dist/table.css';
import { data, Row } from './data';

function Table({ isDarkTheme }: { isDarkTheme: boolean }) {
  const columns: LineUpLiteColumn<Row>[] = useMemo(
    () => [
      { ...asTextColumn<Row>('name'), width: 200 },
      asNumberBoxPlotColumn<Row>('age', {
        color: isDarkTheme ? defaultDarkColorScale : defaultColorScale,
      }),
      asCategoricalColumn<Row>('shirtSize', {
        // define the categories to enforce their order
        categories: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
      }),
    ],
    [isDarkTheme]
  );

  const features = useMemo(() => featureDefault<Row>(), []);
  const icons = useMemo(() => actionIconsRemixicon(), []);

  return (
    <LineUpLiteVirtual<Row>
      data={data}
      columns={columns}
      features={features}
      icons={icons}
      estimatedSize={[23, 50] /* row size for estimating who many are visible */}
      style={{ height: '100vh' /* define the table height since it will fill its given space */ }}
      dark={isDarkTheme}
    />
  );
}

export default function App(): JSX.Element {
  const isDarkTheme = window.matchMedia != null && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return (
    <div className="App">
      <Table isDarkTheme={isDarkTheme} />
    </div>
  );
}
