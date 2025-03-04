'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartData } from '@/models/PopulationData';
import { Prefecture } from '@/models/prefecture';

interface PopulationLineChartProps {
  chartData: ChartData[];
  selectedPrefectures: Prefecture[];
  getLineColor: (index: number) => string;
}

export default function PopulationLineChart({
  chartData,
  selectedPrefectures,
  getLineColor,
}: PopulationLineChartProps) {
  return (
    <div className="h-[400px] w-full" style={{ minWidth: '300px', minHeight: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" tickFormatter={(year) => `${year}年`} />
          <YAxis
            tickFormatter={(value: number) =>
              new Intl.NumberFormat('ja-JP', {
                notation: 'compact',
                compactDisplay: 'short',
              }).format(value)
            }
            label={{ value: '人口', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value: number) =>
              new Intl.NumberFormat('ja-JP').format(value as number) + '人'
            }
            labelFormatter={(label: number) => `${label}年`}
          />
          <Legend />
          {selectedPrefectures.map((prefecture, index) => (
            <Line
              key={prefecture.prefCode}
              type="monotone"
              dataKey={prefecture.prefName}
              stroke={getLineColor(index)}
              activeDot={{ r: 8 }}
              name={prefecture.prefName}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
