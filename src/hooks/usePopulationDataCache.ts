'use client';

import { useRef, useCallback } from 'react';
import { ChartData, PopulationResponse } from '@/models/PopulationData';
import { Prefecture } from '@/models/prefecture';
import { fetchPopulationData } from '@/utils/apiUtils';
import { formatPopulationData } from '@/utils/populationUtils';

interface CacheData {
  [key: string]: ChartData[];
}

export function usePopulationDataCache(
  requestedPrefectures: Set<number>,
  setRequestedPrefectures: React.Dispatch<React.SetStateAction<Set<number>>>
) {
  // キャッシュをコンポーネントのライフサイクル全体で保持
  const cacheRef = useRef<CacheData>({});

  // 人口データを取得する関数
  const fetchPrefectureData = useCallback(
    async (prefecture: Prefecture, category: string) => {
      const cacheKey = `${prefecture.prefCode}-${category}`;

      // キャッシュにデータがあれば、それを使用
      if (cacheRef.current[cacheKey]) {
        return cacheRef.current[cacheKey];
      }

      // APIからデータを取得
      const response: PopulationResponse = await fetchPopulationData(prefecture.prefCode);
      if (!response?.result?.data) {
        throw new Error(`${prefecture.prefName}のデータが取得できませんでした`);
      }

      // カテゴリーに対応するデータを取得
      const categoryData = response.result.data.find((dataset) => dataset.label === category);

      if (!categoryData?.data) {
        throw new Error(`${prefecture.prefName}の${category}データが見つかりませんでした`);
      }

      const formattedData = formatPopulationData({
        prefName: prefecture.prefName,
        data: categoryData.data,
      });

      // キャッシュに保存
      cacheRef.current[cacheKey] = formattedData;

      // 新しい都道府県のデータを取得した場合、リクエスト済みとして記録
      if (!requestedPrefectures.has(prefecture.prefCode)) {
        setRequestedPrefectures((prev) => new Set([...prev, prefecture.prefCode]));
      }

      return formattedData;
    },
    [requestedPrefectures, setRequestedPrefectures]
  );

  return { fetchPrefectureData };
}
