/**
 * @upsetjs/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */
import React from 'react';
import { BoxPlot } from '@lineup-lite/components';
import { filtered, stats } from './data';

export default {
  title: 'Components/BoxPlot',
  component: BoxPlot,
};
export const Default = () => {
  return <BoxPlot s={stats} />;
};

export const Filtered = () => {
  return <BoxPlot s={filtered} preFilter={stats} />;
};
