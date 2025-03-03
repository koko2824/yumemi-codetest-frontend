import { PrefecturesResponse } from '@/models/prefecure';
import { PopulationResponse } from '@/models/PopulationData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

// featch用 汎用関数
export async function fetchFromApi<T>(endpoint: string): Promise<T> {
  try {
    const headers = new Headers();
    headers.set('X-API-KEY', API_KEY);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });

    if (!response.ok) {
      throw new Error(`APIエラー: ${response.status} - ${response.statusText}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('APIリクエスト中に予期せぬエラーが発生しました');
  }
}

// 都道府県データの取得
export async function fetchPrefectures() {
  return fetchFromApi<PrefecturesResponse>('/prefectures');
}

// 人口データの取得
export async function fetchPopulationData(prefCode: number) {
  return fetchFromApi<PopulationResponse>(`/population/composition/perYear?prefCode=${prefCode}`);
}
