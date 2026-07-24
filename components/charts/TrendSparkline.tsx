'use client';

import { Line, LineChart, ResponsiveContainer } from 'recharts';

interface TrendSparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

export function TrendSparkline({ data, color = '#0ea5e9', height = 40 }: TrendSparklineProps) {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
