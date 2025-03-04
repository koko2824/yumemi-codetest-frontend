import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import PrefectureSelector from './index';

const mockPrefectures = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 13, prefName: '東京都' },
  { prefCode: 47, prefName: '沖縄県' },
];

describe('PrefectureSelector コンポーネント', () => {
  test('正しくレンダリングされているか', () => {
    const mockOnChange = jest.fn();
    render(
      <PrefectureSelector
        selectedPrefectures={[]}
        onPrefectureChange={mockOnChange}
        allPrefectures={mockPrefectures}
      />
    );

    // ヘッダーが表示されているか
    expect(screen.getByText('都道府県')).toBeInTheDocument();

    // 全ての都道府県のチェックボックスが表示されているか
    mockPrefectures.forEach((pref) => {
      expect(screen.getByLabelText(pref.prefName)).toBeInTheDocument();
    });
  });

  test('選択済みの都道府県が正しくチェックされているか', () => {
    const mockOnChange = jest.fn();
    const selectedPref = mockPrefectures[0];

    render(
      <PrefectureSelector
        selectedPrefectures={[selectedPref]}
        onPrefectureChange={mockOnChange}
        allPrefectures={mockPrefectures}
      />
    );

    // 選択済みの都道府県がチェックされているこか
    expect(screen.getByLabelText(selectedPref.prefName)).toBeChecked();

    // 他の都道府県がチェックされていないか
    mockPrefectures.slice(1).forEach((pref) => {
      expect(screen.getByLabelText(pref.prefName)).not.toBeChecked();
    });
  });

  test('チェックボックスをクリックした際にonPrefectureChangeが呼ばれる', () => {
    const mockOnChange = jest.fn();
    render(
      <PrefectureSelector
        selectedPrefectures={[]}
        onPrefectureChange={mockOnChange}
        allPrefectures={mockPrefectures}
      />
    );

    const checkbox = screen.getByLabelText('北海道');
    fireEvent.click(checkbox);

    // コールバックが正しい引数で呼ばれるか
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(mockPrefectures[0], true);
  });

  test('複数の都道府県を選択した際に正しくチェックされているか', () => {
    const mockOnChange = jest.fn();
    const selectedPrefs = [mockPrefectures[0], mockPrefectures[2]];

    render(
      <PrefectureSelector
        selectedPrefectures={selectedPrefs}
        onPrefectureChange={mockOnChange}
        allPrefectures={mockPrefectures}
      />
    );

    // 選択済みの都道府県がチェックされているか
    selectedPrefs.forEach((pref) => {
      expect(screen.getByLabelText(pref.prefName)).toBeChecked();
    });

    // 他の都道府県がチェックされていないか
    const unselectedPref = mockPrefectures[1];
    expect(screen.getByLabelText(unselectedPref.prefName)).not.toBeChecked();
  });

  test('チェックボックスをクリックした際に選択が解除されるか', () => {
    const mockOnChange = jest.fn();
    const selectedPref = mockPrefectures[0];

    render(
      <PrefectureSelector
        selectedPrefectures={[selectedPref]}
        onPrefectureChange={mockOnChange}
        allPrefectures={mockPrefectures}
      />
    );

    const checkbox = screen.getByLabelText(selectedPref.prefName);
    fireEvent.click(checkbox);

    // コールバックが正しい引数で呼ばれるか
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(selectedPref, false);
  });
});
