'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/PageHeader';
import { TrendSparkline } from '@/components/charts/TrendSparkline';
import { ArrowDown, ArrowUp, Flame } from 'lucide-react';
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { themes, themeTrends } from '@/lib/mock-data';
import type { Theme } from '@/types';

export default function TrendsPage() {
  const [allThemes, setAllThemes] = useState<Theme[]>([]);
  const [trends, setTrends] = useState<Record<string, number[]>>({});

  useEffect(() => {
    setAllThemes(themes);
    setTrends(themeTrends);
  }, []);

  const spikingThemes = allThemes.filter((t) => t.trend > 20);

  // Build multi-line chart data
  const weekLabels = ['W-7', 'W-6', 'W-5', 'W-4', 'W-3', 'W-2', 'W-1', 'W-0'];
  const chartData = weekLabels.map((week, i) => {
    const row: Record<string, string | number> = { week };
    for (const theme of allThemes) {
      row[theme.name] = trends[theme.id]?.[i] || 0;
    }
    return row;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Themes & Trends"
        description="Track how feedback themes evolve over time and spot emerging issues."
      />

      {/* Spiking section */}
      {spikingThemes.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-lg text-amber-900">Spiking Themes</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {spikingThemes.map((t) => (
                <Link
                  key={t.id}
                  href={`/trends/${t.id}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-amber-300 hover:bg-amber-100"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: t.color }}
                  />
                  {t.name}
                  <span className="flex items-center gap-0.5 text-amber-600">
                    <ArrowUp className="h-3 w-3" />
                    {t.trend}%
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Theme cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {allThemes.map((theme) => {
          const trendData = trends[theme.id] || [];
          const isUp = theme.trend > 0;
          return (
            <Link key={theme.id} href={`/trends/${theme.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: theme.color }}
                      />
                      <span className="text-sm font-semibold text-slate-900">
                        {theme.name}
                      </span>
                    </div>
                    <span
                      className={`flex items-center gap-0.5 text-xs font-semibold ${
                        isUp ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {Math.abs(theme.trend)}%
                    </span>
                  </div>
                  <div className="mt-3 text-2xl font-bold text-slate-900">{theme.count}</div>
                  <div className="text-xs text-slate-500">feedback items</div>
                  <div className="mt-3">
                    <TrendSparkline data={trendData} color={theme.color} height={36} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Multi-line chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Theme Volumes Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
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
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                iconType="circle"
              />
              {allThemes.map((theme) => (
                <Line
                  key={theme.id}
                  type="monotone"
                  dataKey={theme.name}
                  stroke={theme.color}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
