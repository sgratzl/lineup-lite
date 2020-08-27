/**
 * @upsetjs/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */
import React from 'react';
import { BoxPlot } from '../components/BoxPlot';
import { numberStatsGenerator } from '../math/numberStatsGenerator';

export default {
  title: 'BoxPlot',
};

const stats = numberStatsGenerator()(
  Array(100)
    .fill(0)
    .map(() => Math.random())
);

export const Default = () => {
  return <BoxPlot s={stats} />;
};
