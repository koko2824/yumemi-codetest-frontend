'use client';

import { useEffect, useState } from 'react';
import PrefectureSelector from '@/components/Selector';
import PopulationGraph from '@/components/Graph';
import { fetchPrefectures } from '@/utils/api';
import { Prefecture } from '@/models/prefecture';

export default function Home() {
  const [selectedPrefectures, setSelectedPrefectures] = useState<Prefecture[]>([]);
  const [allPrefectures, setAllPrefectures] = useState<Prefecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestedPrefectures, setRequestedPrefectures] = useState<Set<number>>(new Set());

  useEffect(() => {
    const loadPrefectures = async () => {
      setIsLoading(true);
      try {
        const response = await fetchPrefectures();
        setAllPrefectures(response.result);
      } catch (err) {
        console.error('都道府県データの取得エラー:', err);
        setError('都道府県データの取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    loadPrefectures();
  }, []);

  const handlePrefectureChange = (prefecture: Prefecture, isChecked: boolean) => {
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

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-lg text-red-600 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            再読み込み
          </button>
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
        <PopulationGraph
          selectedPrefectures={selectedPrefectures}
          requestedPrefectures={requestedPrefectures}
          setRequestedPrefectures={setRequestedPrefectures}
        />
      </div>
    </main>
  );
}
