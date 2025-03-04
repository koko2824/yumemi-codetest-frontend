import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategorySelector from './CategorySelector';
import { PopulationLabel } from '@/models/PopulationData';

describe('CategorySelector コンポーネント', () => {
  const mockOnCategoryChange = jest.fn();
  const selectedCategory = PopulationLabel.TOTAL;

  beforeEach(() => {
    render(
      <CategorySelector
        selectedCategory={selectedCategory}
        onCategoryChange={mockOnCategoryChange}
      />
    );
  });

  test('カテゴリーとレンダリングされているか', () => {
    expect(screen.getByText('カテゴリー')).toBeInTheDocument();
    Object.values(PopulationLabel).forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  test('選択されているカテゴリーが正しいか', () => {
    const selectedButton = screen.getByText(selectedCategory);
    expect(selectedButton).toHaveClass('bg-blue-500 text-white');
  });

  test('カテゴリーボタンがクリックされた際にonCategoryChangeが呼ばれるか', () => {
    const categoryButton = screen.getByText(PopulationLabel.YOUNG);
    fireEvent.click(categoryButton);
    expect(mockOnCategoryChange).toHaveBeenCalledWith(PopulationLabel.YOUNG);
  });
});
