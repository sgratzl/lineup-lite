/**
 * @lineup-lite/example-basic
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { defaultColorScale, defaultDarkColorScale } from '@lineup-lite/components';
import '@lineup-lite/components/src/style.css';
import { ColorRenderer, ProportionalSymbolRenderer } from '@lineup-lite/hooks';
import '@lineup-lite/hooks/src/style.css';
import LineUpLite, {
  actionIconsRemixicon,
  asCategoricalColumn,
  asCategoricalSetColumn,
  asNumberColumn,
  asNumbersColumn,
  asTextColumn,
  featureDefault,
  LineUpLiteColumn,
  LineUpLitePanel,
  LineUpLiteStateContextProvider,
  ColumnInstance,
  LineUpLiteFilterAction,
  UseFiltersColumnProps,
  ActionIcons,
} from '@lineup-lite/table';
import '@lineup-lite/table/src/style.css';
import React, { useMemo, useCallback, useState } from 'react';
import { data, Row } from './data';
import './styles.css';

function MyCheckBox({ indeterminate, ...rest }: any) {
  return <input type="checkbox" {...rest} style={{ color: 'blue' }} />;
}

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
          <button onClick={showFilterDialog}>Close</button>
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
      asNumberColumn<Row>(
        {
          Header: 'Age',
          id: 'age2',
          accessor: (row) => row.age,
          Cell: ColorRenderer,
        },
        {
          color: isDarkTheme ? defaultDarkColorScale : defaultColorScale,
        }
      ),
      asNumberColumn<Row>(
        {
          Header: 'Age',
          id: 'age3',
          accessor: (row) => row.age,
          Cell: ProportionalSymbolRenderer,
        },
        {
          color: isDarkTheme ? defaultDarkColorScale : defaultColorScale,
        }
      ),
      asCategoricalColumn<Row>('shirtSize', {
        categories: ['S', 'M', 'L'],
      }),
      asCategoricalSetColumn<Row>('hobbies', {
        categories: ['running', 'cooking', 'reading'],
      }),
      asNumbersColumn<Row>('runningTimes'),
    ],
    [isDarkTheme]
  );

  const features = useMemo(() => featureDefault<Row>(), []);
  const icons = useMemo(() => actionIconsRemixicon(), []);

  const filterAction = useCallback((col: ColumnInstance<Row>, icons: ActionIcons) => {
    return (
      <>
        <MyFilterAction col={col} icons={icons} />
      </>
    );
  }, []);

  return (
    <LineUpLiteStateContextProvider>
      <div className="root">
        <div className="lineup">
          <LineUpLite<Row>
            data={data}
            columns={columns}
            features={features}
            icons={icons}
            dark={isDarkTheme}
            selectCheckboxComponent={MyCheckBox}
            actions={filterAction}
            // onStateChange={setInstance}
          />
        </div>
        <LineUpLitePanel className="side-panel" icons={icons} dark={isDarkTheme} actions={filterAction} />
      </div>
    </LineUpLiteStateContextProvider>
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
