/**
 * @upsetjs/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */
import React from 'react';
import { BoxPlot, FilterRangeBoxPlot } from '@lineup-lite/components';
import '@lineup-lite/components/dist/components.css';
import { number, noop } from './data';

export default {
  title: 'Components/BoxPlot',
  component: BoxPlot,
};
export const Default = () => {
  return <BoxPlot s={number.stats} style={{ width: 300, height: 100 }} />;
};

export const Filtered = () => {
  return <BoxPlot s={number.filtered} preFilter={number.stats} style={{ width: 300, height: 100 }} />;
};

export const FilteredRange = () => {
  return (
    <FilterRangeBoxPlot
      setFilter={noop}
      filterValue={number.filter2}
      s={number.filtered2}
      preFilter={number.stats}
      style={{ width: 300, height: 100 }}
    />
  );
};
