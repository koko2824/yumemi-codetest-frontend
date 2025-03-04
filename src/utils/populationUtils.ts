import { ChartData } from '@/models/PopulationData';

// Generate a unique color for each prefecture
export const getLineColor = (index: number) => {
  const colors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#8AC926',
    '#1982C4',
    '#6A4C93',
    '#F94144',
  ];
  return colors[index % colors.length];
};

interface formatPopulationDataProps {
  prefName: string;
  data: {
    year: number;
    value: number;
  }[];
}

export const formatPopulationData = ({ prefName, data }: formatPopulationDataProps) => {
  return data.map((item) => ({
    year: item.year,
    [prefName]: item.value,
  }));
};

interface PrefectureDataPoint {
  year: number;
  [prefName: string]: number | string;
}

interface YearData {
  year: number;
  [prefName: string]: number;
}

// 複数の都道府県データをマージする関数
export const mergePopulationData = (dataArray: PrefectureDataPoint[][]): ChartData[] => {
  if (!dataArray.length) return [];

  // 全ての年を取得して重複を排除
  const allYears = [...new Set(dataArray.flatMap((data) => data.map((item) => item.year)))].sort();

  // 各年ごとにデータをマージ
  return allYears.map((year) => {
    const yearData: YearData = { year };

    // 各都道府県のデータを追加
    dataArray.forEach((prefData) => {
      const matchingYearData = prefData.find((item) => item.year === year);
      if (matchingYearData) {
        Object.keys(matchingYearData).forEach((key) => {
          if (key !== 'year') {
            yearData[key] = matchingYearData[key] as number;
          }
        });
      }
    });

    return yearData;
  });
};
