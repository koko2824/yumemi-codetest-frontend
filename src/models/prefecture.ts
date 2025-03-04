export interface Prefecture {
  prefCode: number;
  prefName: string;
}

export interface PrefecturesResponse {
  message: string | null;
  result: Prefecture[];
}
