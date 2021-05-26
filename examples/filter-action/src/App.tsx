/**
 * @lineup-lite/example-basic
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useMemo, useCallback, useState } from 'react';
import './styles.css';
import LineUpLite, {
  asTextColumn,
  asNumberColumn,
  asCategoricalColumn,
  LineUpLiteColumn,
  featureDefault,
  actionIconsRemixicon,
  ActionLineUpProps,
} from '@lineup-lite/table';
import { defaultDarkColorScale, defaultColorScale } from '@lineup-lite/components';
import '@lineup-lite/table/dist/table.css';
import { data, Row } from './data';

function useVisibleHelper() {
  const [visible, setVisible] = useState([] as string[]);

  const toggleVisibility = useCallback(
    (col: { id: string }) => {
      setVisible((v) => (v.indexOf(col.id) >= 0 ? v.filter((d) => d !== col.id) : [...v, col.id]));
    },
    [setVisible]
  );
  const isVisible = useCallback((col: { id: string }) => visible.indexOf(col.id) >= 0, [visible]);
  return { toggleVisibility, isVisible };
}

function useFilterAction() {
  const { toggleVisibility, isVisible } = useVisibleHelper();
  return useMemo(() => {
    const f: ActionLineUpProps<Row>['actionFilter'] = (col) => {
      if (!col.canFilter) {
        return undefined;
      }
      const handler = () => toggleVisibility(col);
      return {
        handler,
        children: isVisible(col) ? (
          <div className="filter-dialog">
            {col.render('Summary')}
            <button onClick={handler} type="button">
              Close
            </button>
          </div>
        ) : undefined,
      };
    };
    return f;
  }, [isVisible, toggleVisibility]);
}

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

  const actionFilter = useFilterAction();

  return (
    <LineUpLite<Row>
      data={data}
      columns={columns}
      features={features}
      icons={icons}
      dark={isDarkTheme}
      actionFilter={actionFilter}
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
