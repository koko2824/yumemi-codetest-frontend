export interface Prefecure {
  prefCode: number;
  prefName: string;
}

export interface PrefecturesResponse {
  message: string | null;
  result: Prefecure[];
}
