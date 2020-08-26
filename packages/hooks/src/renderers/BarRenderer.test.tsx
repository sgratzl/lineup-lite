/// <reference types="jest" />
import '../setupTests';
import React from 'react';
import { render } from '@testing-library/react';
import { BarRenderer } from './BarRenderer';

test('renders learn react link', () => {
  const f =
  const { getByText } = render(<BarRenderer />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
