'use client';

import { useEffect, useState } from 'react';
import EmptyState from '@/components/Graph/EmptyState';
import GraphTitle from '@/components/Graph/GraphTitle';
import PopulationLineChart from '@/components/Graph/GraphLineChart';
import { generateMockData, getLineColor } from '@/utils/populationUtils';
import { PopulationData } from '@/models/PopulationData';

interface PopulationGraphProps {
  selectedPrefectures: string[];
}

export default function PopulationGraph({ selectedPrefectures }: PopulationGraphProps) {
  const [chartData, setChartData] = useState<PopulationData[]>([]);

  useEffect(() => {
    // Generate base data with years
    const baseData = generateMockData().map((yearData) => {
      const newYearData: PopulationData = { year: yearData.year };

      // Add population data for each selected prefecture
      selectedPrefectures.forEach((prefecture) => {
        // Generate random population data between 1-10 million
        newYearData[prefecture] = Math.floor(Math.random() * 9000000) + 1000000;
      });

      return newYearData;
    });

    setChartData(baseData);
  }, [selectedPrefectures]);

  if (selectedPrefectures.length === 0) {
    return <EmptyState message="都道府県を選択してください" />;
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
