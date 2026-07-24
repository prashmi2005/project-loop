'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { volumeOverTime } from '@/lib/mock-data';

interface VolumeChartProps {
  data?: Array<{ date: string; count: number }>;
}

export function VolumeChart({ data: propData }: VolumeChartProps) {
  const rawData = propData || volumeOverTime;
  const data = rawData.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: '#64748b' }}
          tickLine={false}
          axisLine={false}
          interval={1}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#64748b' }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '13px',
          }}
          labelStyle={{ fontWeight: 600, color: '#0f172a' }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#0ea5e9"
          strokeWidth={2}
          fill="url(#colorVolume)"
          name="Feedback volume"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
