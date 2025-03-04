'use client';

import { useEffect, useState } from 'react';
import EmptyState from '@/components/Graph/EmptyState';
import GraphTitle from '@/components/Graph/GraphTitle';
import CategorySelector from '@/components/Graph/CategorySelector';
import PopulationLineChart from '@/components/Graph/GraphLineChart';
import { getLineColor, mergePopulationData } from '@/utils/populationUtils';
import { ChartData, PopulationLabel } from '@/models/PopulationData';
import { Prefecture } from '@/models/prefecture';
import { usePopulationDataCache } from '@/hooks/usePopulationDataCache';

interface PopulationGraphProps {
  selectedPrefectures: Prefecture[];
  requestedPrefectures: Set<number>;
  setRequestedPrefectures: React.Dispatch<React.SetStateAction<Set<number>>>;
}

export default function PopulationGraph({
  selectedPrefectures,
  requestedPrefectures,
  setRequestedPrefectures,
}: PopulationGraphProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(PopulationLabel.TOTAL);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // カスタムフックの呼び出し
  const { fetchPrefectureData } = usePopulationDataCache(
    requestedPrefectures,
    setRequestedPrefectures
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // 都道府県の選択が変更されたらデータを再取得
  useEffect(() => {
    const loadPopulationData = async () => {
      if (selectedPrefectures.length === 0) {
        setChartData([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        // 各都道府県のデータを取得
        const populationDataPromises = selectedPrefectures.map((prefecture) =>
          fetchPrefectureData(prefecture, selectedCategory)
        );

        const populationDataArray = await Promise.all(populationDataPromises);
        const mergedData = mergePopulationData(populationDataArray);
        setChartData(mergedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得中にエラーが発生しました。');
        console.error('人口データ取得エラー:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPopulationData();
  }, [selectedPrefectures, selectedCategory, fetchPrefectureData]);

  if (selectedPrefectures.length === 0) {
    return <EmptyState message="都道府県を選択してください" />;
  }

  return (
    <div data-testid="population-graph">
      <CategorySelector
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <div className="bg-white p-4 border border-gray-200 rounded-lg">
        <GraphTitle title={`都道府県別${selectedCategory}推移`} />
        <GraphContent
          isLoading={isLoading}
          error={error}
          chartData={chartData}
          selectedPrefectures={selectedPrefectures}
        />
      </div>
    </div>
  );
}

// グラフの内容を表示するコンポーネントを分離
interface GraphContentProps {
  isLoading: boolean;
  error: string | null;
  chartData: ChartData[];
  selectedPrefectures: Prefecture[];
}

function GraphContent({ isLoading, error, chartData, selectedPrefectures }: GraphContentProps) {
  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
          role="status"
        ></div>
      </div>
    );
  }

  if (error) {
    return <EmptyState message={error} />;
  }

  return (
    <PopulationLineChart
      chartData={chartData}
      selectedPrefectures={selectedPrefectures}
      getLineColor={getLineColor}
    />
  );
}
