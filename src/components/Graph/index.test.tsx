import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PopulationGraph from './index';
import { fetchPopulationData } from '@/utils/api';
import { PopulationLabel } from '@/models/PopulationData';

jest.mock('@/utils/api');

const mockFetchPopulationData = fetchPopulationData as jest.MockedFunction<
  typeof fetchPopulationData
>;

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('PopulationGraph', () => {
  const selectedPrefectures = [
    { prefCode: 1, prefName: '北海道' },
    { prefCode: 13, prefName: '東京都' },
    { prefCode: 47, prefName: '沖縄県' },
  ];

  beforeEach(() => {
    mockFetchPopulationData.mockClear();
  });

  it('正しくレンダリングされるか', () => {
    render(<PopulationGraph selectedPrefectures={selectedPrefectures} />);
  });

  it('ロード中にスピナーを表示する', async () => {
    mockFetchPopulationData.mockResolvedValueOnce({
      message: null,
      result: { boundaryYear: 2020, data: [{ label: PopulationLabel.TOTAL, data: [] }] },
    });
    render(<PopulationGraph selectedPrefectures={selectedPrefectures} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('データ取得に失敗した時、メッセージを表示する', async () => {
    mockFetchPopulationData.mockRejectedValueOnce(new Error('データの取得に失敗しました'));

    render(<PopulationGraph selectedPrefectures={selectedPrefectures} />);
    await waitFor(() => expect(screen.getByText('データの取得に失敗しました')).toBeInTheDocument());
  });

  it('都道府県が選択されていない場合、空の状態が表示される', () => {
    render(<PopulationGraph selectedPrefectures={[]} />);
    expect(screen.getByText('都道府県を選択してください')).toBeInTheDocument();
  });

  it('正しいグラフタイトルを表示する', async () => {
    mockFetchPopulationData.mockResolvedValueOnce({
      message: null,
      result: { boundaryYear: 2020, data: [{ label: PopulationLabel.TOTAL, data: [] }] },
    });

    render(<PopulationGraph selectedPrefectures={selectedPrefectures} />);
    await waitFor(() => expect(screen.getByText('都道府県別総人口推移')).toBeInTheDocument());
  });

  it('正しいデータが取得された場合、グラフが表示される', async () => {
    const selectedPrefectures = [{ prefCode: 1, prefName: '北海道' }];

    mockFetchPopulationData.mockResolvedValueOnce({
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

    render(<PopulationGraph selectedPrefectures={selectedPrefectures} />);
    await waitFor(() => expect(screen.getByTestId('population-graph')).toBeInTheDocument());
  });
});
