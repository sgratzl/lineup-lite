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
  ColumnInstance,
  ActionIcons,
  LineUpLiteFilterAction,
  UseFiltersColumnProps,
} from '@lineup-lite/table';
import { defaultDarkColorScale, defaultColorScale } from '@lineup-lite/components';
import '@lineup-lite/table/dist/table.css';
import { data, Row } from './data';

function MyFilterAction(props: { col: ColumnInstance<Row>; icons: ActionIcons }) {
  const col = (props.col as unknown) as ColumnInstance<Row> & UseFiltersColumnProps<Row>;

  const [visible, setVisible] = useState(false);
  const showFilterDialog = useCallback(() => {
    setVisible(!visible);
  }, [visible, setVisible]);

  return (
    <>
      <LineUpLiteFilterAction {...col} iconFilter={props.icons.filterColumn} toggleFilterColumn={showFilterDialog} />
      {visible && (
        <div className="filter-dialog">
          {col.render('Summary')}
          <button onClick={showFilterDialog} type="button">
            Close
          </button>
        </div>
      )}
    </>
  );
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

  const filterAction = useCallback((col: ColumnInstance<Row>, givenIcons: ActionIcons) => {
    return (
      <>
        <MyFilterAction col={col} icons={givenIcons} />
      </>
    );
  }, []);

  return (
    <LineUpLite<Row>
      data={data}
      columns={columns}
      features={features}
      icons={icons}
      dark={isDarkTheme}
      actions={filterAction}
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
