'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { sentimentBreakdown } from '@/lib/mock-data';

const COLORS = {
  positive: '#10b981',
  neutral: '#f59e0b',
  negative: '#f43f5e',
};

interface SentimentChartProps {
  data?: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export function SentimentChart({ data: propData }: SentimentChartProps) {
  const counts = propData || sentimentBreakdown;
  const data = [
    { name: 'Positive', value: counts.positive, color: COLORS.positive },
    { name: 'Neutral', value: counts.neutral, color: COLORS.neutral },
    { name: 'Negative', value: counts.negative, color: COLORS.negative },
  ];
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  return (
    <div className="flex items-center justify-center">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '13px',
            }}
            formatter={(value: number) => [`${value} (${Math.round((value / total) * 100)}%)`, '']}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
