/**
 * @upsetjs/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */
import React from 'react';
import { Histogram, FilterRangeHistogram } from '@lineup-lite/components';
import '@lineup-lite/components/dist/components.css';
import { number, categorical, date, noop } from './data';

export default {
  title: 'Components/Histogram',
  component: Histogram,
};

export const Number = () => {
  return <Histogram s={number.stats} style={{ width: 300, height: 100 }} />;
};

export const NumberFiltered = () => {
  return <Histogram s={number.filtered} preFilter={number.stats} style={{ width: 300, height: 100 }} />;
};

export const NumberRangeFiltered = () => {
  return (
    <FilterRangeHistogram
      setFilter={noop}
      filterValue={number.filter2}
      s={number.filtered2}
      preFilter={number.stats}
      style={{ width: 300, height: 100 }}
    />
  );
};

export const Categorical = () => {
  return <Histogram s={categorical.stats} style={{ width: 300, height: 100 }} />;
};

export const CategoricalFiltered = () => {
  return <Histogram s={categorical.filtered} preFilter={categorical.stats} style={{ width: 300, height: 100 }} />;
};

export const Date = () => {
  return <Histogram s={date.stats} style={{ width: 300, height: 100 }} />;
};

export const DateFiltered = () => {
  return <Histogram s={date.filtered} preFilter={date.stats} style={{ width: 300, height: 100 }} />;
};

export const DateRangeFiltered = () => {
  return (
    <FilterRangeHistogram
      setFilter={noop}
      filterValue={date.filter2}
      s={date.filtered2}
      preFilter={date.stats}
      style={{ width: 300, height: 100 }}
    />
  );
};
