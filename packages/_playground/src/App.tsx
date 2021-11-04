/* eslint-disable jsx-a11y/label-has-associated-control */
/**
 * @lineup-lite/example-basic
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import '@lineup-lite/components/src/style.css';
import '@lineup-lite/hooks/src/style.css';
import LineUpLite, {
  actionIconsRemixicon,
  ActionLineUpProps,
  asTextColumn,
  asNumberBoxPlotColumn,
  featureFilterColumns,
  featureFlexLayout,
  featureRowRank,
  featureRowSelect,
  featureSortAndGroupBy,
  LineUpLiteColumn,
  LineUpLitePanel,
  LineUpLiteStateContextProvider,
} from '@lineup-lite/table';
import { asLineChartColumn } from '@lineup-lite/hooks';
import type { TextGroupByOptions } from '@lineup-lite/hooks';
import '@lineup-lite/table/src/style.css';
import React, { useCallback, useMemo, useState } from 'react';
import { data, Row } from './data';
import './styles.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MyCheckBox({ indeterminate, ...rest }: any) {
  return <input type="checkbox" {...rest} style={{ color: 'blue' }} />;
}

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

function TextGroupByOptionsBlock({
  setGroupingOptions,
  groupingOptions,
  onClose,
}: {
  groupingOptions?: TextGroupByOptions;
  setGroupingOptions(v: TextGroupByOptions | undefined): void;
  onClose(): void;
}) {
  const values = (groupingOptions?.values ?? []) as (RegExp | string)[];

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fData = new FormData(e.currentTarget);
      const type = fData.get('type') as TextGroupByOptions['type'];
      if (!type) {
        setGroupingOptions(undefined);
        onClose();
        return;
      }

      const currentValues = (fData.get('values') ?? '')
        .toString()
        .split('\n')
        .map((d) => d.trim())
        .filter(Boolean);
      if (type === 'regex') {
        setGroupingOptions({
          type,
          values: currentValues.map((d) => new RegExp(d)),
        });
      } else {
        setGroupingOptions({
          type,
          values: currentValues,
        });
      }
      onClose();
    },
    [onClose, setGroupingOptions]
  );

  return (
    <form className="groupby-dialog" onSubmit={onSubmit}>
      <label>
        <input type="radio" name="type" value="value" defaultChecked={groupingOptions?.type === 'value'} />
        By Value
      </label>
      <label>
        <input type="radio" name="type" value="regex" defaultChecked={groupingOptions?.type === 'regex'} />
        By Regex
      </label>
      <label>
        <input type="radio" name="type" value="startsWith" defaultChecked={groupingOptions?.type === 'startsWith'} />
        By Starts With
      </label>
      <textarea
        required
        name="values"
        defaultValue={values.map((d) => (d instanceof RegExp ? d.source : d)).join('\n')}
        rows={5}
        style={{ height: '5em' }}
      />
      <button type="submit">Close</button>
    </form>
  );
}

function useGroupByAction() {
  const { toggleVisibility, isVisible } = useVisibleHelper();
  return useMemo(() => {
    const f: ActionLineUpProps<Row>['actionGroupBy'] = (col, helper) => {
      if (!col.canGroupBy || !col.setGroupingOptions || col.id !== 'name' || col.isGrouped) {
        return undefined;
      }
      const handler = () => toggleVisibility(col);
      return {
        handler,
        children: isVisible(col) ? (
          <TextGroupByOptionsBlock
            groupingOptions={col.groupingOptions}
            setGroupingOptions={col.setGroupingOptions}
            onClose={() => {
              helper.toggleGroupBy();
              handler();
            }}
          />
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
      { ...asNumberBoxPlotColumn<Row>('runningTimes'), id: 'r2' },
      asLineChartColumn<Row>('runningTimes'),
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

  const actionFilter = useFilterAction();
  const actionGroupBy = useGroupByAction();

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
            actionFilter={actionFilter}
            actionGroupBy={actionGroupBy}
          />
        </div>
        <LineUpLitePanel
          className="side-panel"
          icons={icons}
          dark={isDarkTheme}
          actionFilter={actionFilter}
          actionGroupBy={actionGroupBy}
        />
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
