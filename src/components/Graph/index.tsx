'use client';

import { useEffect, useState } from 'react';
import EmptyState from '@/components/Graph/EmptyState';
import GraphTitle from '@/components/Graph/GraphTitle';
import PopulationLineChart from '@/components/Graph/GraphLineChart';
import { formatPopulationData, getLineColor, mergePopulationData } from '@/utils/populationUtils';
import { ChartData, PopulationResponse } from '@/models/PopulationData';
import { Prefecure } from '@/models/prefecure';
import { fetchPopulationData } from '@/utils/api';

interface PopulationGraphProps {
  selectedPrefectures: Prefecure[];
}

export default function PopulationGraph({ selectedPrefectures }: PopulationGraphProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

          const totalPopulation = response.result.data.find(
            (dataset) => dataset.label === '総人口'
          );

          if (!totalPopulation || !totalPopulation.data) {
            throw new Error(`${prefecture.prefName}の総人口データが見つかりませんでした`);
          }

          return formatPopulationData({
            prefName: prefecture.prefName,
            data: totalPopulation.data,
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
  }, [selectedPrefectures]);

  if (selectedPrefectures.length === 0) {
    return <EmptyState message="都道府県を選択してください" />;
  }

  if (isLoading) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg">
        <GraphTitle title="都道府県別総人口推移" />
        <div className="h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <EmptyState message={error} />;
  }

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg">
      <GraphTitle title="都道府県別総人口推移" />
      <PopulationLineChart
        chartData={chartData}
        selectedPrefectures={selectedPrefectures}
        getLineColor={getLineColor}
      />
    </div>
  );
}
