'use client';

import { useEffect, useState } from 'react';
import EmptyState from '@/components/Graph/EmptyState';
import GraphTitle from '@/components/Graph/GraphTitle';
import CategorySelector from '@/components/Graph/CategorySelector';
import PopulationLineChart from '@/components/Graph/GraphLineChart';
import { formatPopulationData, getLineColor, mergePopulationData } from '@/utils/populationUtils';
import { ChartData, PopulationLabel, PopulationResponse } from '@/models/PopulationData';
import { Prefecure } from '@/models/prefecure';
import { fetchPopulationData } from '@/utils/api';

interface PopulationGraphProps {
  selectedPrefectures: Prefecure[];
}

export default function PopulationGraph({ selectedPrefectures }: PopulationGraphProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(PopulationLabel.TOTAL);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    const loadPopulationData = async () => {
      if (selectedPrefectures.length === 0) {
        setChartData([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const populationDataPromises = selectedPrefectures.map(async (prefecture) => {
          const response: PopulationResponse = await fetchPopulationData(prefecture.prefCode);

          if (!response || !response.result || !response.result.data) {
            throw new Error(`${prefecture.prefName}のデータが取得できませんでした`);
          }

          const categoryData = response.result.data.find(
            (dataset) => dataset.label === selectedCategory
          );

          if (!categoryData || !categoryData.data) {
            throw new Error(
              `${prefecture.prefName}の${selectedCategory}データが見つかりませんでした`
            );
          }

          return formatPopulationData({
            prefName: prefecture.prefName,
            data: categoryData.data,
          });
        });

        const populationDataArray = await Promise.all(populationDataPromises);
        const mergedData = mergePopulationData(populationDataArray);
        setChartData(mergedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得中にエラーが発生しました。');
      } finally {
        setIsLoading(false);
      }
    };

    loadPopulationData();
  }, [selectedPrefectures, selectedCategory]);

  if (selectedPrefectures.length === 0) {
    return <EmptyState message="都道府県を選択してください" />;
  }

  return (
    <div>
      <CategorySelector
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <div className="bg-white p-4 border border-gray-200 rounded-lg">
        <GraphTitle title={`都道府県別${selectedCategory}推移`} />

        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <EmptyState message={error} />
        ) : (
          <PopulationLineChart
            chartData={chartData}
            selectedPrefectures={selectedPrefectures}
            getLineColor={getLineColor}
          />
        )}
      </div>
    </div>
  );
}
