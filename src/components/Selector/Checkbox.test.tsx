import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Checkbox from './Checkbox';

describe('Checkbox コンポーネント', () => {
  test('正しくレンダリングされること', () => {
    const mockOnChange = jest.fn();
    render(
      <Checkbox
        id="test-checkbox"
        label="テストチェックボックス"
        checked={false}
        onChange={mockOnChange}
      />
    );

    const checkbox = screen.getByLabelText('テストチェックボックス');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  test('クリック: onChangeが呼ばれること', () => {
    const mockOnChange = jest.fn();
    render(
      <Checkbox
        id="test-checkbox"
        label="テストチェックボックス"
        checked={false}
        onChange={mockOnChange}
      />
    );

    const checkbox = screen.getByLabelText('テストチェックボックス');
    fireEvent.click(checkbox);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });
});
test('チェックボックスがチェックされていること', () => {
  const mockOnChange = jest.fn();
  render(
    <Checkbox
      id="test-checkbox"
      label="テストチェックボックス"
      checked={true}
      onChange={mockOnChange}
    />
  );

  const checkbox = screen.getByLabelText('テストチェックボックス');
  expect(checkbox).toBeChecked();
});

test('ラベルが正しく表示されること', () => {
  const mockOnChange = jest.fn();
  render(
    <Checkbox
      id="test-checkbox"
      label="テストチェックボックス"
      checked={false}
      onChange={mockOnChange}
    />
  );

  const label = screen.getByText('テストチェックボックス');
  expect(label).toBeInTheDocument();
});
