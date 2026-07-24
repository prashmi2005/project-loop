'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/PageHeader';
import { SentimentBadge } from '@/components/feedback/SentimentBadge';
import { ChannelBadge } from '@/components/feedback/ChannelBadge';
import { AppPagination } from '@/components/ui/AppPagination';
import { ArrowDown, ArrowUp, ArrowLeft } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getThemeById, getThemeFeedback, getThemeTrends } from '@/services/themes.service';
import type { FeedbackItem, Theme } from '@/types';

export default function ThemeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const themeId = params.themeId as string;
  const [theme, setTheme] = useState<Theme | null>(null);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [trends, setTrends] = useState<Record<string, number[]>>({});
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    (async () => {
      const [t, fb, tr] = await Promise.all([
        getThemeById(themeId),
        getThemeFeedback(themeId),
        getThemeTrends(),
      ]);
      setTheme(t);
      setFeedback(fb);
      setTrends(tr);
    })();
  }, [themeId]);

  if (!theme) {
    return <div className="h-64 animate-pulse rounded-xl bg-slate-200" />;
  }

  const trendData = trends[theme.id] || [];
  const weekLabels = ['W-7', 'W-6', 'W-5', 'W-4', 'W-3', 'W-2', 'W-1', 'W-0'];
  const chartData = weekLabels.map((week, i) => ({
    week,
    count: trendData[i] || 0,
  }));

  const totalPages = Math.ceil(feedback.length / pageSize);
  const paginated = feedback.slice((page - 1) * pageSize, page * pageSize);
  const isUp = theme.trend > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={theme.name}
        description={theme.description}
        breadcrumbs={[{ label: 'Trends', href: '/trends' }, { label: theme.name }]}
        actions={
          <Button variant="ghost" onClick={() => router.push('/trends')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trends
          </Button>
        }
      />

      {/* Theme stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: theme.color }}
              />
              <span className="text-sm text-slate-500">Total Feedback</span>
            </div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{theme.count}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <span className="text-sm text-slate-500">Trend</span>
            <div
              className={`mt-2 flex items-center gap-1 text-2xl font-bold ${
                isUp ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {isUp ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
              {Math.abs(theme.trend)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <span className="text-sm text-slate-500">Theme Color</span>
            <div className="mt-2 flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-lg"
                style={{ backgroundColor: theme.color }}
              />
              <code className="text-sm text-slate-600">{theme.color}</code>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Volume chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Volume Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTheme" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={theme.color} stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Area
                type="monotone"
                dataKey="count"
                stroke={theme.color}
                strokeWidth={2}
                fill="url(#colorTheme)"
                name="Feedback count"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Feedback list */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          Feedback for this theme ({feedback.length})
        </h2>
        <div className="space-y-2">
          {paginated.map((item) => (
            <Link
              key={item.id}
              href={`/inbox/${item.id}`}
              className="block rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              <p className="line-clamp-2 text-sm font-medium text-slate-900">{item.content}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <ChannelBadge channel={item.channel} showIcon={false} />
                <SentimentBadge sentiment={item.sentiment} showIcon={false} />
                <span className="text-xs text-slate-400">
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
        <AppPagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-4" />
      </div>
    </div>
  );
}
