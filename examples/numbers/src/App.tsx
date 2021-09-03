import React, { useMemo } from 'react';
import './styles.css';
import LineUpLite, {
  asTextColumn,
  asNumbersColumn,
  asCategoricalColumn,
  LineUpLiteColumn,
  featureDefault,
  actionIconsRemixicon,
} from '@lineup-lite/table';
import '@lineup-lite/table/dist/table.css';
import { data, Row } from './data';

function Table({ isDarkTheme }: { isDarkTheme: boolean }) {
  const columns: LineUpLiteColumn<Row>[] = useMemo(
    () => [
      asTextColumn<Row>('name'),
      asCategoricalColumn<Row>('shirtSize', {
        categories: ['S', 'M', 'L'],
      }),
      asNumbersColumn<Row>('runningTimes'),
    ],
    []
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
