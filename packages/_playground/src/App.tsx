/**
 * @lineup-lite/example-basic
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { defaultDivergingColorScale, defaultDivergingDarkColorScale } from '@lineup-lite/components';
import '@lineup-lite/components/src/style.css';
import '@lineup-lite/hooks/src/style.css';
import LineUpLite, {
  actionIconsRemixicon,
  asTextColumn,
  asDivergingNumberColumn,
  LineUpLiteColumn,
  LineUpLitePanel,
  LineUpLiteStateContextProvider,
  ColumnInstance,
  LineUpLiteFilterAction,
  UseFiltersColumnProps,
  featureFlexLayout,
  featureFilterColumns,
  featureRowRank,
  featureSortAndGroupBy,
  featureRowSelect,
  ActionIcons,
} from '@lineup-lite/table';
import '@lineup-lite/table/src/style.css';
import React, { useMemo, useCallback, useState } from 'react';
import { data, Row } from './data';
import './styles.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MyCheckBox({ indeterminate, ...rest }: any) {
  return <input type="checkbox" {...rest} style={{ color: 'blue' }} />;
}

function MyFilterAction(props: { col: ColumnInstance<Row>; icons: ActionIcons }) {
  const col = props.col as unknown as ColumnInstance<Row> & UseFiltersColumnProps<Row>;

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


function MyGroupingOptionAction(props: { col: ColumnInstance<Row>; icons: ActionIcons }) {
  const col = props.col as unknown as ColumnInstance<Row> & UseFiltersColumnProps<Row>;

  const [visible, setVisible] = useState(false);
  const showGroupingDialog = useCallback(() => {
    setVisible(!visible);
  }, [visible, setVisible]);

  return (
    <>
      <LineUpLiteFilterAction {...col} iconFilter={props.icons.filterColumn} toggleFilterColumn={showGroupingDialog} />
      {visible && (
        <div className="filter-dialog">
          {col.render('Summary')}
          <button onClick={showGroupingDialog} type="button">
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
      asDivergingNumberColumn<Row>('test', {
        color: isDarkTheme ? defaultDivergingDarkColorScale : defaultDivergingColorScale,
        min: -1,
        max: 1,
      }),
    ],
    [isDarkTheme]
  );

  const features = useMemo(
    () => [
      featureFilterColumns,
      featureSortAndGroupBy<Row>(),
      featureRowSelect<Row>(),
      featureRowRank,
      featureFlexLayout,
    ],
    []
  );
  const icons = useMemo(() => actionIconsRemixicon(), []);

  const filterAction = useCallback((col: ColumnInstance<Row>, givenIcons: ActionIcons) => {
    return (
      <>
        <MyFilterAction col={col} icons={givenIcons} />
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

export default function App(): JSX.Element {
  const isDarkTheme = window.matchMedia != null && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return (
    <div className="App">
      <Table isDarkTheme={isDarkTheme} />
    </div>
  );
}
