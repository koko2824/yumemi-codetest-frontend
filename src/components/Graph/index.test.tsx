import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import PopulationGraph from './index';
import { fetchPopulationData } from '@/utils/api';
import { PopulationLabel } from '@/models/PopulationData';

jest.mock('@/utils/api');
jest.mock('recharts', () => ({
  ...jest.requireActual('recharts'),
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div style={{ width: 800, height: 600 }}>{children}</div>
  ),
}));

const mockFetchPopulationData = fetchPopulationData as jest.MockedFunction<
  typeof fetchPopulationData
>;
const mockSetRequestedPrefectures = jest.fn();
const mockRequestedPrefectures = new Set<number>();

// モックデータを作成する関数
const createMockPopulationData = (prefCode: number) => {
  return {
    message: null,
    result: {
      boundaryYear: 2020,
      data: [
        {
          label: PopulationLabel.TOTAL,
          data: [
            { year: 2020, value: 1000 + prefCode },
            { year: 2019, value: 900 + prefCode },
          ],
        },
        {
          label: PopulationLabel.YOUNG,
          data: [
            { year: 2020, value: 500 + prefCode },
            { year: 2019, value: 450 + prefCode },
          ],
        },
        {
          label: PopulationLabel.PRODUCTION,
          data: [
            { year: 2020, value: 700 + prefCode },
            { year: 2019, value: 650 + prefCode },
          ],
        },
        {
          label: PopulationLabel.ELDERLY,
          data: [
            { year: 2020, value: 300 + prefCode },
            { year: 2019, value: 250 + prefCode },
          ],
        },
      ],
    },
  };
};

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

    // デフォルトでは各都道府県コードに対応するモックデータを返すように設定
    mockFetchPopulationData.mockImplementation((prefCode) => {
      return Promise.resolve(createMockPopulationData(prefCode));
    });
  });

  it('正しくレンダリングされるか', async () => {
    render(
      <PopulationGraph
        selectedPrefectures={selectedPrefectures}
        requestedPrefectures={mockRequestedPrefectures}
        setRequestedPrefectures={mockSetRequestedPrefectures}
      />
    );
    await waitFor(() => expect(screen.getByTestId('population-graph')).toBeInTheDocument());
  });

  it('都道府県が選択されていない場合、空の状態が表示される', async () => {
    render(
      <PopulationGraph
        selectedPrefectures={[]}
        requestedPrefectures={mockRequestedPrefectures}
        setRequestedPrefectures={mockSetRequestedPrefectures}
      />
    );
    expect(screen.getByText('都道府県を選択してください')).toBeInTheDocument();
  });

  it('正しいグラフタイトルを表示する', async () => {
    mockFetchPopulationData.mockResolvedValueOnce({
      message: null,
      result: { boundaryYear: 2020, data: [{ label: PopulationLabel.TOTAL, data: [] }] },
    });

    render(
      <PopulationGraph
        selectedPrefectures={selectedPrefectures}
        requestedPrefectures={mockRequestedPrefectures}
        setRequestedPrefectures={mockSetRequestedPrefectures}
      />
    );

    await waitFor(() => expect(screen.getByText('都道府県別総人口推移')).toBeInTheDocument());
  });

  it('カテゴリーを変更すると、新しいデータが取得される', async () => {
    mockFetchPopulationData.mockResolvedValueOnce({
      message: null,
      result: {
        boundaryYear: 2020,
        data: [
          {
            label: PopulationLabel.TOTAL,
            data: [{ year: 2020, value: 1000 }],
          },
          {
            label: PopulationLabel.YOUNG,
            data: [{ year: 2020, value: 500 }],
          },
        ],
      },
    });
    const { getByText } = render(
      <PopulationGraph
        selectedPrefectures={[{ prefCode: 1, prefName: '北海道' }]}
        requestedPrefectures={mockRequestedPrefectures}
        setRequestedPrefectures={mockSetRequestedPrefectures}
      />
    );

    await waitFor(() => expect(screen.getByText('都道府県別総人口推移')).toBeInTheDocument());

    // カテゴリーを変更
    fireEvent.click(getByText(PopulationLabel.YOUNG));
    await waitFor(() => expect(screen.getByText('都道府県別年少人口推移')).toBeInTheDocument());
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

    render(
      <PopulationGraph
        selectedPrefectures={selectedPrefectures}
        requestedPrefectures={mockRequestedPrefectures}
        setRequestedPrefectures={mockSetRequestedPrefectures}
      />
    );
    await waitFor(() => expect(screen.getByTestId('population-graph')).toBeInTheDocument());
  });
});
