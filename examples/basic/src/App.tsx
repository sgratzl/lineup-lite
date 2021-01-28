import { useMemo } from 'react';
import './styles.css';
import LineUpLite, {
  asTextColumn,
  asNumberColumn,
  asCategoricalColumn,
  LineUpLiteColumn,
  featureDefault,
} from '@lineup-lite/table';
import { defaultDarkColorScale, defaultColorScale } from '@lineup-lite/components';
import '@lineup-lite/table/dist/table.css';

interface IRow {
  name: string;
  age: number;
  shirtSize: 'S' | 'M' | 'L';
}

export default function App() {
  const isDarkTheme = false;

  const data: IRow[] = useMemo(
    () => [
      {
        name: 'Panchito Green',
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

  const columns: LineUpLiteColumn<IRow>[] = useMemo(
    () => [
      asTextColumn<IRow>('name'),
      asNumberColumn<IRow>('age', {
        color: isDarkTheme ? defaultDarkColorScale : defaultColorScale,
      }),
      asCategoricalColumn<IRow>('shirtSize'),
    ],
    [isDarkTheme]
  );

  const features = useMemo(() => featureDefault<IRow>(), []);

  return (
    <div className="App">
      <LineUpLite<IRow> data={data} columns={columns} features={features} />
    </div>
  );
}
