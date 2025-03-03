import { PrefecureData } from '@/models/prefecureData';
import { PopulationDataV2 } from '@/models/PopulationData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

// featch用 汎用関数
export async function fetchFromApi<T>(endpoint: string): Promise<T> {
  try {
    const headers = new Headers();
    headers.set('X-API-KEY', API_KEY);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });

    if (!response.ok) {
      throw new Error(`APIエラー: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

interface prefecturesResponse {
  message: string | null;
  result: PrefecureData[];
}

// 都道府県データの取得
export async function fetchPrefectures() {
  return fetchFromApi<prefecturesResponse>('/prefectures');
}

interface populationResponse {
  message: string | null;
  result: PopulationDataV2[];
}

// 人口データの取得
export async function fetchPopulationData(prefCode: number) {
  return fetchFromApi<populationResponse>(`/population/composition/perYear?prefCode=${prefCode}`);
}
