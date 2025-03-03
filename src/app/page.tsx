'use client';

import { useState } from 'react';
import PrefectureSelector from '@/components/Selector';
import PopulationGraph from '@/components/Graph';

export default function Home() {
  const [selectedPrefectures, setSelectedPrefectures] = useState<string[]>([]);

  const handlePrefectureChange = (prefecture: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedPrefectures((prev) => [...prev, prefecture]);
    } else {
      setSelectedPrefectures((prev) => prev.filter((p) => p !== prefecture));
    }
  };

  return (
    <main>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">都道府県別人口推移</h2>
        <PrefectureSelector
          selectedPrefectures={selectedPrefectures}
          onPrefectureChange={handlePrefectureChange}
        />
      </div>
      <div className="mt-8">
        <PopulationGraph selectedPrefectures={selectedPrefectures} />
      </div>
    </main>
  );
}
