import { getLineColor, formatPopulationData, mergePopulationData } from './populationUtils';

describe('getLineColor', () => {
    it('正しい indexの色を返す', () => {
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
        colors.forEach((color, index) => {
            expect(getLineColor(index)).toBe(color);
        });
    });

    it('インデックスが色の長さより大きい場合、色をループする', () => {
        expect(getLineColor(10)).toBe('#FF6384');
        expect(getLineColor(11)).toBe('#36A2EB');
    });
});

describe('formatPopulationData', () => {
    it('正しくフォーマットする', () => {
        const input = {
            prefName: 'Tokyo',
            data: [
                { year: 2000, value: 100 },
                { year: 2001, value: 200 },
            ],
        };
        const expectedOutput = [
            { year: 2000, Tokyo: 100 },
            { year: 2001, Tokyo: 200 },
        ];
        expect(formatPopulationData(input)).toEqual(expectedOutput);
    });
});

describe('mergePopulationData', () => {
    it('複数の都道府県データを正しくmergeする', () => {
        const input = [
            [
                { year: 2000, Tokyo: 100 },
                { year: 2001, Tokyo: 200 },
            ],
            [
                { year: 2000, Osaka: 150 },
                { year: 2001, Osaka: 250 },
            ],
        ];
        const expectedOutput = [
            { year: 2000, Tokyo: 100, Osaka: 150 },
            { year: 2001, Tokyo: 200, Osaka: 250 },
        ];
        expect(mergePopulationData(input)).toEqual(expectedOutput);
    });

    it('空の入力配列を正しく処理する', () => {
        expect(mergePopulationData([])).toEqual([]);
    });

    it('重複する年がある場合、正しくマージする', () => {
        const input = [
            [
                { year: 2000, Tokyo: 100 },
                { year: 2001, Tokyo: 200 },
            ],
            [
                { year: 2000, Osaka: 150 },
                { year: 2001, Osaka: 250 },
            ],
            [
                { year: 2000, Kyoto: 50 },
            ],
        ];
        const expectedOutput = [
            { year: 2000, Tokyo: 100, Osaka: 150, Kyoto: 50 },
            { year: 2001, Tokyo: 200, Osaka: 250 },
        ];
        expect(mergePopulationData(input)).toEqual(expectedOutput);
    });
});