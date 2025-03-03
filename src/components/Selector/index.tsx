'use client';

import { prefectures } from '@/utils/prefectures';
import Checkbox from '@/components/Selector/Checkbox';

interface PrefectureSelectorProps {
  selectedPrefectures: string[];
  onPrefectureChange: (prefecture: string, isChecked: boolean) => void;
}

export default function PrefectureSelector({
  selectedPrefectures,
  onPrefectureChange,
}: PrefectureSelectorProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">都道府県</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {prefectures.map((prefecture) => (
          <Checkbox
            key={prefecture}
            id={prefecture}
            label={prefecture}
            checked={selectedPrefectures.includes(prefecture)}
            onChange={(e) => onPrefectureChange(prefecture, e.target.checked)}
          />
        ))}
      </div>
    </div>
  );
}
