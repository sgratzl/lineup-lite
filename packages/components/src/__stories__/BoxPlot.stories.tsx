/**
 * @upsetjs/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */
import React from 'react';
import { BoxPlot } from '../components/BoxPlot';
import { filtered, stats } from './data';

export default {
  title: 'BoxPlot',
  component: BoxPlot,
};
export const Default = () => {
  return <BoxPlot s={stats} />;
};

export const Filtered = () => {
  return <BoxPlot s={filtered} preFilter={stats} />;
};
