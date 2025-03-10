'use client';

import Checkbox from '@/components/Selector/Checkbox';
import { Prefecture } from '@/models/prefecture';

interface PrefectureSelectorProps {
  selectedPrefectures: Prefecture[];
  onPrefectureChange: (prefecture: Prefecture, isChecked: boolean) => void;
  allPrefectures: Prefecture[];
}

export default function PrefectureSelector({
  selectedPrefectures,
  onPrefectureChange,
  allPrefectures,
}: PrefectureSelectorProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">都道府県</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {allPrefectures.map((prefecture) => (
          <Checkbox
            key={prefecture.prefCode}
            id={prefecture.prefName}
            label={prefecture.prefName}
            checked={selectedPrefectures.includes(prefecture)}
            onChange={(e) => onPrefectureChange(prefecture, e.target.checked)}
          />
        ))}
      </div>
    </div>
  );
}
