import React from 'react';
import { render } from '@testing-library/react';
import GraphTitle from './GraphTitle';

describe('GraphTitle', () => {
  it('正しくレンダリングされているか', () => {
    render(<GraphTitle title="Sample Title" />);
  });

  //
  it('正しいタイトルを表示しているか', () => {
    const { getByText } = render(<GraphTitle title="Sample Title" />);
    expect(getByText('Sample Title')).toBeInTheDocument();
  });

  it('classを正しく適用するか', () => {
    const { container } = render(<GraphTitle title="Sample Title" />);
    const h3Element = container.querySelector('h3');
    expect(h3Element).toHaveClass('text-lg', 'font-semibold', 'mb-4', 'text-center');
  });
});
