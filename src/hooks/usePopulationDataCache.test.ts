import { renderHook, act } from '@testing-library/react';
import { usePopulationDataCache } from './usePopulationDataCache';
import { fetchPopulationData } from '@/utils/apiUtils';
import { PopulationLabel } from '@/models/PopulationData';

jest.mock('@/utils/apiUtils');
const mockFetchPopulationData = fetchPopulationData as jest.MockedFunction<
  typeof fetchPopulationData
>;

describe('usePopulationDataCache', () => {
  const mockPrefecture = { prefCode: 1, prefName: '北海道' };
  const mockCategory = PopulationLabel.TOTAL;

  beforeEach(() => {
    jest.clearAllMocks();
    // モックの戻り値をデフォルトで設定
    mockFetchPopulationData.mockResolvedValue({
      message: null,
      result: {
        boundaryYear: 2020,
        data: [
          {
            label: PopulationLabel.TOTAL,
            data: [
              { year: 2020, value: 1000 },
              { year: 2019, value: 900 },
            ],
          },
        ],
      },
    });
  });

  it('キャッシュにデータがない場合、APIからデータを取得する', async () => {
    const mockSetRequestedPrefectures = jest.fn();
    const { result } = renderHook(() =>
      usePopulationDataCache(new Set(), mockSetRequestedPrefectures)
    );

    let data;
    await act(async () => {
      data = await result.current.fetchPrefectureData(mockPrefecture, mockCategory);
    });

    expect(mockFetchPopulationData).toHaveBeenCalledWith(mockPrefecture.prefCode);
    expect(mockSetRequestedPrefectures).toHaveBeenCalled();
    expect(data).toEqual([
      { year: 2020, 北海道: 1000 },
      { year: 2019, 北海道: 900 },
    ]);
  });

  it('キャッシュにデータがある場合、APIリクエストをスキップする', async () => {
    const mockSetRequestedPrefectures = jest.fn();
    // 初期キャッシュを設定するために空のSetを渡す
    const { result } = renderHook(() =>
      usePopulationDataCache(new Set(), mockSetRequestedPrefectures)
    );

    // 1回目の呼び出し - APIリクエストが発生
    await act(async () => {
      await result.current.fetchPrefectureData(mockPrefecture, mockCategory);
    });

    // 2回目の呼び出し - キャッシュから取得
    // 2回目の呼び出し - キャッシュから取得
    let cachedData: Array<{ year: number; [prefName: string]: number }>;
    await act(async () => {
      cachedData = await result.current.fetchPrefectureData(mockPrefecture, mockCategory);

      expect(mockFetchPopulationData).toHaveBeenCalledTimes(1);
      expect(cachedData).toEqual([
        { year: 2020, 北海道: 1000 },
        { year: 2019, 北海道: 900 },
      ]);
    });
  });
});
