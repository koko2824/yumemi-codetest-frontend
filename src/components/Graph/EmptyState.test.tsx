import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmptyState from './EmptyState';

describe('EmptyState コンポーネント', () => {
  test('メッセージが表示されているか', () => {
    const message = 'No data available';
    render(<EmptyState message={message} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  test('正しいクラスが適用されているか', () => {
    const message = 'No data available';
    const { container } = render(<EmptyState message={message} />);
    expect(container.firstChild).toHaveClass(
      'flex justify-center items-center h-64 bg-gray-50 border border-gray-200 rounded-lg'
    );
    expect(screen.getByText(message)).toHaveClass('text-gray-500');
  });
});
