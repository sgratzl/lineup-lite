/**
 * @upsetjs/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */
import React from 'react';
import { CategoricalColor, DateLabel, NumberBar, NumberColor, NumberSymbol } from '@lineup-lite/components';
import '@lineup-lite/components/dist/components.css';
import { categorical, number, date } from './data';

export default {
  title: 'Components/Primitives',
  component: NumberBar,
};

export const Bar = () => {
  return (
    <NumberBar
      value={number.arr[0]}
      format={number.stats.format}
      scale={number.stats.scale}
      color={number.stats.color}
      style={{ width: 100, outline: '1px solid black' }}
    />
  );
};

export const Color = () => {
  return (
    <NumberColor
      value={number.arr[0]}
      format={number.stats.format}
      scale={number.stats.scale}
      color={number.stats.color}
      style={{ width: 100, outline: '1px solid black' }}
    />
  );
};

export const Symbol = () => {
  return (
    <NumberSymbol
      value={number.arr[0]}
      format={number.stats.format}
      scale={number.stats.scale}
      color={number.stats.color}
      style={{ width: 100, outline: '1px solid black' }}
    />
  );
};

export const Categorical = () => {
  return (
    <CategoricalColor
      value={categorical.arr[0]}
      color={categorical.stats.color}
      style={{ width: 100, outline: '1px solid black' }}
    />
  );
};

export const Date = () => {
  return (
    <DateLabel value={date.arr[0]} format={date.stats.format} style={{ width: 100, outline: '1px solid black' }} />
  );
};
