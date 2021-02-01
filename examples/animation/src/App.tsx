/**
 * @lineup-lite/example-animation
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
  actionIconsRemixicon,
  LineUpLiteComponentLike,
} from '@lineup-lite/table';
import { defaultDarkColorScale, defaultColorScale } from '@lineup-lite/components';
import '@lineup-lite/table/dist/table.css';
import { data, Row } from './data';
import FlipMove from 'react-flip-move';

const BodyWrapper: LineUpLiteComponentLike = ({ children, style, ref, ...rest }) => {
  return (
    <FlipMove enterAnimation="fade" leaveAnimation="fade" {...rest} ref={ref as any} style={style as any}>
      {children}
    </FlipMove>
  );
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
  const icons = useMemo(() => actionIconsRemixicon(), []);
  const components = useMemo(
    () => ({
      tbody: BodyWrapper,
    }),
    []
  );

  return (
    <LineUpLite<Row>
      data={data}
      columns={columns}
      features={features}
      icons={icons}
      dark={isDarkTheme}
      components={components}
    />
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
