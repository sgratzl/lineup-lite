import React, { useMemo } from 'react';
import './styles.css';
import LineUpLite, {
  asTextColumn,
  asNumberColumn,
  asCategoricalColumn,
  LineUpLiteColumn,
  featureDefault,
  actionIconsRemixicon,
  LineUpLiteI18N,
} from '@lineup-lite/table';
import { defaultDarkColorScale, defaultColorScale } from '@lineup-lite/components';
import '@lineup-lite/table/dist/table.css';
import { data, Row } from './data';

function Table({ isDarkTheme }: { isDarkTheme: boolean }) {
  const columns: LineUpLiteColumn<Row>[] = useMemo(
    () => [
      asTextColumn<Row>('name'),
      asNumberColumn<Row>('age', {
        color: isDarkTheme ? defaultDarkColorScale : defaultColorScale,
      }),
      asCategoricalColumn<Row>('shirtSize', {
        categories: ['S', 'M', 'L'],
      }),
    ],
    [isDarkTheme]
  );

  const features = useMemo(() => featureDefault<Row>(), []);
  const icons = useMemo(() => actionIconsRemixicon(), []);

  const i18n: Partial<LineUpLiteI18N> = useMemo(
    () => ({
      groupByRemoveColumn: 'Hier klicken um nicht mehr nach dieser Spalte zu gruppieren',
      groupByAnotherColumn:
        'Hier klicken um nur noch nach dieser Spalte zu gruppieren oder die Shift-Taste gedrückt halten um zusätzlich nach dieser Spalte zu gruppieren',
      groupByColumn: 'Hier klicken um nach dieser Spalte zu gruppieren',
      filterTextPlaceholder: 'Spalte filtern nach...',
    }),
    []
  );

  return (
    <LineUpLite<Row> data={data} columns={columns} features={features} icons={icons} dark={isDarkTheme} i18n={i18n} />
  );
}

export default function App() {
  const isDarkTheme = window.matchMedia != null && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return (
    <div className="App">
      <Table isDarkTheme={isDarkTheme} />
    </div>
  );
}
