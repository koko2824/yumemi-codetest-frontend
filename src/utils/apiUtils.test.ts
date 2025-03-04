import { fetchFromApi, fetchPrefectures, fetchPopulationData } from './apiUtils';
import { PrefecturesResponse } from '@/models/prefecture';
import { PopulationResponse } from '@/models/PopulationData';

global.fetch = jest.fn();

describe('API utility functions', () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchFromApi 関数', () => {
    it('データを取得する', async () => {
      const mockData = { data: 'test' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      const result = await fetchFromApi('/test-endpoint');
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/test-endpoint`, {
        headers: new Headers({ 'X-API-KEY': API_KEY }),
      });
    });

    it('レスポンスが正常でない時はエラーを返す', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(fetchFromApi('/test-endpoint')).rejects.toThrow('APIエラー: 404 - Not Found');
    });

    it('fetchに失敗するとエラーを返す', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

      await expect(fetchFromApi('/test-endpoint')).rejects.toThrow('Network Error');
    });
  });

  describe('fetchPrefectures 関数', () => {
    it('データを取得する', async () => {
      const mockData: PrefecturesResponse = { message: null, result: [] };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      const result = await fetchPrefectures();
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/prefectures`, {
        headers: new Headers({ 'X-API-KEY': API_KEY }),
      });
    });

    // レスポンスが正常でない時はエラーを返す
    it('レスポンスが正常でない時はエラーを返す', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(fetchPrefectures()).rejects.toThrow('APIエラー: 404 - Not Found');
    });
  });

  describe('fetchPopulationData 関数', () => {
    it('データを取得する', async () => {
      const mockData: PopulationResponse = {
        message: null,
        result: { boundaryYear: 2020, data: [] },
      };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      const prefCode = 1;
      const result = await fetchPopulationData(prefCode);
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/population/composition/perYear?prefCode=${prefCode}`,
        {
          headers: new Headers({ 'X-API-KEY': API_KEY }),
        }
      );
    });

    it('レスポンスが正常でない時はエラーを返す', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });
      await expect(fetchPopulationData(1)).rejects.toThrow('APIエラー: 404 - Not Found');
    });
  });
});
