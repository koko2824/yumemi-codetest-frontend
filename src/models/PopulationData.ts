export interface ChartData {
  year: number;
  [prefecture: string]: number;
}

export const PopulationLabel = {
  TOTAL: '総人口',
  YOUNG: '年少人口',
  PRODUCTION: '生産年齢人口',
  ELDERLY: '老年人口',
} as const;

export type PopulationLabel = (typeof PopulationLabel)[keyof typeof PopulationLabel];

// 実際のAPIレスポンスに合わせて型を修正
export interface PopulationDataset {
  label: string;
  data: {
    year: number;
    value: number;
    rate?: number;
  }[];
}

export interface PopulationData {
  boundaryYear: number;
  data: PopulationDataset[];
}

export interface PopulationResponse {
  message: string | null;
  result: PopulationData;
}
