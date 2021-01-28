import React, { useMemo } from 'react';
import './styles.css';
import {
  LineUpLitePaginated,
  asTextColumn,
  asNumberColumn,
  asCategoricalColumn,
  LineUpLiteColumn,
  featureDefault,
  actionIconsRemixicon,
  paginationIconsRemixicon,
} from '@lineup-lite/table';
import { defaultDarkColorScale, defaultColorScale } from '@lineup-lite/components';
import '@lineup-lite/table/dist/table.css';
import { data, Row } from './data';

function Table({ isDarkTheme }: { isDarkTheme: boolean }) {
  const columns: LineUpLiteColumn<Row>[] = useMemo(
    () => [
      { ...asTextColumn<Row>('name'), width: 200 },
      asNumberColumn<Row>('age', {
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
  const icons = useMemo(
    () => ({
      ...actionIconsRemixicon(),
      ...paginationIconsRemixicon(),
    }),
    []
  );

  return <LineUpLitePaginated<Row> data={data} columns={columns} features={features} icons={icons} />;
}

export default function App() {
  const isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return (
    <div className="App">
      <Table isDarkTheme={isDarkTheme} />
    </div>
  );
}
