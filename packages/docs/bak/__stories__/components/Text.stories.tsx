/**
 * @upsetjs/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */
import React from 'react';
import { FilterTextSummary, TextSummary } from '@lineup-lite/components';
import '@lineup-lite/components/dist/components.css';
import { text, noop } from './data';

const Stories = {
  title: 'Components/Text',
  component: TextSummary,
};
export default Stories;

export const Text = () => {
  return <TextSummary s={text.stats} style={{ width: 300, height: 100, outline: '1px solid black' }} />;
};

export const TextFiltered = () => {
  return (
    <FilterTextSummary
      setFilter={noop}
      filterValue={text.filter2}
      s={text.filtered2}
      preFilter={text.stats}
      style={{ width: 300, height: 100, outline: '1px solid black' }}
    />
  );
};
