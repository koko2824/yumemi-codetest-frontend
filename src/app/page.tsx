'use client';

import { useEffect, useState } from 'react';
import PrefectureSelector from '@/components/Selector';
import PopulationGraph from '@/components/Graph';
import { fetchPrefectures } from '@/utils/api';
import { Prefecure } from '@/models/prefecure';

export default function Home() {
  const [selectedPrefectures, setSelectedPrefectures] = useState<Prefecure[]>([]);
  const [allPrefectures, setAllPrefectures] = useState<Prefecure[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPrefectures = async () => {
      setIsLoading(true);
      try {
        const response = await fetchPrefectures();
        setAllPrefectures(response.result);
      } catch (error) {
        console.error('都道府県データの取得に失敗しました', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrefectures();
  }, []);

  const handlePrefectureChange = (prefecture: Prefecure, isChecked: boolean) => {
    if (isChecked) {
      setSelectedPrefectures((prev) => [...prev, prefecture]);
    } else {
      setSelectedPrefectures((prev) => prev.filter((p) => p !== prefecture));
    }
  };

  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">都道府県データを読み込み中...</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">都道府県別人口推移</h2>
        <PrefectureSelector
          selectedPrefectures={selectedPrefectures}
          onPrefectureChange={handlePrefectureChange}
          allPrefectures={allPrefectures}
        />
      </div>
      <div className="mt-8">
        <PopulationGraph selectedPrefectures={selectedPrefectures} />
      </div>
    </main>
  );
}
