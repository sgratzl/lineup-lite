/**
 * @upsetjs/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */
import React from 'react';
import { BoxPlot } from '@lineup-lite/components';
import '@lineup-lite/components/dist/components.css';
import { filtered, stats } from './data';

export default {
  title: 'Components/BoxPlot',
  component: BoxPlot,
};
export const Default = () => {
  return <BoxPlot s={stats} style={{ width: 300, height: 100 }} />;
};

export const Filtered = () => {
  return <BoxPlot s={filtered} preFilter={stats} style={{ width: 300, height: 100 }} />;
};
