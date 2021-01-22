import React from 'react';
import LineUpLite, {
  asTextColumn,
  asNumberColumn,
  asCategoricalColumn,
  LineUpLiteColumn,
  useDefaultFeatures,
} from '@lineup-lite/table';
import '@lineup-lite/table/dist/table.css';

interface IRow {
  name: string;
  age: number;
  shirtSize: 'S' | 'M' | 'L';
}

export default function GettingStarted() {
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
    () => [asTextColumn('name'), asNumberColumn('age'), asCategoricalColumn('shirtSize')],
    []
  );

  const features = React.useMemo(() => useDefaultFeatures(), []);

  return <LineUpLite data={data} columns={columns} plugins={features} />;
}
