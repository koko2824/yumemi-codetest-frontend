export interface PopulationData {
  year: number;
  [prefecture: string]: number;
}

const PopulationLabel = {
  TOTAL: '総人口',
  YOUNG: '年少人口',
  PRODUCTION: '生産年齢人口',
  ELDERLY: '老年人口',
};

export type PopulationLabel = (typeof PopulationLabel)[keyof typeof PopulationLabel];

export interface PopulationDataV2 {
  boundaryYear: number;
  data: [
    {
      label: PopulationLabel;
      data: [
        {
          year: number;
          value: number;
        },
      ];
    },
  ];
}
