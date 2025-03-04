import React from 'react';
import { render } from '@testing-library/react';
import PopulationLineChart from './GraphLineChart';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;
import { ChartData } from '@/models/PopulationData';
import { Prefecture } from '@/models/prefecture';

const mockChartData: ChartData[] = [
  { year: 2000, population: 1000 },
  { year: 2005, population: 1500 },
  { year: 2010, population: 2000 },
];

const mockSelectedPrefectures: Prefecture[] = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 13, prefName: '東京都' },
  { prefCode: 47, prefName: '沖縄県' },
];

export const mockGetLineColor = (index: number) => {
  const colors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#8AC926',
    '#1982C4',
    '#6A4C93',
    '#F94144',
  ];
  return colors[index % colors.length];
};

describe('PopulationLineChart コンポーネント', () => {
  it('正しくレンダリングされているか', () => {
    const { container } = render(
        <PopulationLineChart
            chartData={mockChartData}
            selectedPrefectures={mockSelectedPrefectures}
            getLineColor={mockGetLineColor}
        />
    );
    expect(container).toBeInTheDocument();
  });

  it('ラインカラーが正しく設定されているか', () => {
    const { container } = render(
      <PopulationLineChart
        chartData={mockChartData}
        selectedPrefectures={mockSelectedPrefectures}
        getLineColor={mockGetLineColor}
      />
    );
    const lines = container.querySelectorAll('.recharts-line path');
    lines.forEach((line, index) => {
      expect(line).toHaveAttribute('stroke', mockGetLineColor(index));
    });
  });

  it('ウィンドウサイズが変更された場合に正しく再レンダリングされるか', () => {
    const { container } = render(
      <PopulationLineChart
        chartData={mockChartData}
        selectedPrefectures={mockSelectedPrefectures}
        getLineColor={mockGetLineColor}
      />
    );

    global.dispatchEvent(new Event('resize'));
    expect(container).toBeInTheDocument();
  });
});
