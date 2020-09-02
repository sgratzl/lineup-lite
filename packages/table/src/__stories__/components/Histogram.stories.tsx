/**
 * @upsetjs/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */
import React from 'react';
import { Histogram } from '@lineup-lite/components';
import { filtered, stats } from './data';

export default {
  title: 'Components/Histogram',
  component: Histogram,
};

export const Default = () => {
  return <Histogram s={stats} />;
};

export const Filtered = () => {
  return <Histogram s={filtered} preFilter={stats} />;
};
