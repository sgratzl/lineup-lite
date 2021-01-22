import 'regenerator-runtime/runtime';
import React from 'react';
import LineUpLite, {
  asTextColumn,
  asNumberColumn,
  asCategoricalColumn,
  LineUpLiteColumn,
  featureDefault,
} from '@lineup-lite/table';
import { defaultDarkColorScale, defaultColorScale } from '@lineup-lite/components';
import '@lineup-lite/table/dist/table.css';
import useThemeContext from '@theme/hooks/useThemeContext';

interface IRow {
  name: string;
  age: number;
  shirtSize: 'S' | 'M' | 'L';
}

export default function GettingStarted() {
  const { isDarkTheme } = useThemeContext();

  const data: IRow[] = React.useMemo(
    () => [
      {
        name: 'Panchito Grenshields',
        age: 10,
        shirtSize: 'S',
      },
      {
        name: 'Rubia Robker',
        age: 25,
        shirtSize: 'M',
      },
      {
        name: 'Micheil Sappell',
        age: 50,
        shirtSize: 'L',
      },
      {
        name: 'Geoffrey Sprason',
        age: 30,
        shirtSize: 'M',
      },
      {
        name: 'Grissel Rounsefull',
        age: 21,
        shirtSize: 'S',
      },
    ],
    []
  );

  const columns: LineUpLiteColumn<IRow>[] = React.useMemo(
    () => [
      asTextColumn<IRow>('name'),
      asNumberColumn<IRow>('age', {
        color: isDarkTheme ? defaultDarkColorScale : defaultColorScale,
      }),
      asCategoricalColumn<IRow>('shirtSize'),
    ],
    [isDarkTheme]
  );

  const features = React.useMemo(() => featureDefault<IRow>(), []);

  return <LineUpLite<IRow> data={data} columns={columns} features={features} />;
}
