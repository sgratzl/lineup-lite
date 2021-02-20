/**
 * @lineup-lite/example-basic
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useMemo } from 'react';
import './styles.css';
import LineUpLite, {
  asTextColumn,
  asNumberColumn,
  asCategoricalColumn,
  LineUpLiteColumn,
  featureDefault,
  ActionIcons,
} from '@lineup-lite/table';
import { defaultDarkColorScale, defaultColorScale } from '@lineup-lite/components';
import '@lineup-lite/table/dist/table.css';
import { data, Row } from './data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSortAmountUp,
  faSortAmountDown,
  faTimes,
  faColumns,
  faChevronRight,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

const icons: Partial<ActionIcons> = {
  sortAsc: () => <FontAwesomeIcon icon={faSortAmountUp} />,
  sortDesc: () => <FontAwesomeIcon icon={faSortAmountDown} />,
  clearSelection: () => <FontAwesomeIcon icon={faTimes} />,
  groupBy: () => <FontAwesomeIcon icon={faColumns} />,
  expandGroup: () => <FontAwesomeIcon icon={faChevronRight} />,
  hideColumn: () => <FontAwesomeIcon icon={faTrash} />,
  resetFilter: () => <FontAwesomeIcon icon={faTimes} />,
};

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

  return <LineUpLite<Row> data={data} columns={columns} features={features} icons={icons} dark={isDarkTheme} />;
}

export default function App() {
  const isDarkTheme = window.matchMedia != null && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return (
    <div className="App">
      <Table isDarkTheme={isDarkTheme} />
    </div>
  );
}
