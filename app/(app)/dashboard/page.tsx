'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  Inbox,
  MessageSquarePlus,
  Smile,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/dashboard/StatCard';
import { VolumeChart } from '@/components/charts/VolumeChart';
import { SentimentChart } from '@/components/charts/SentimentChart';
import { TopThemesChart } from '@/components/charts/TopThemesChart';
import { SentimentBadge } from '@/components/feedback/SentimentBadge';
import { ChannelBadge } from '@/components/feedback/ChannelBadge';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/lib/auth-context';
import type { FeedbackItem } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>({
    totalFeedback: 0,
    newThisWeek: 0,
    percentNegative: 0,
    avgScore: 0.0,
    topTheme: '—',
    recentFeedback: [],
    sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 },
    volumeOverTime: [],
    themes: [],
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (res.ok) {
          const data = await res.json();
          // Ensure arrays are always arrays to avoid runtime crashes
          setStats({
            ...data,
            recentFeedback: Array.isArray(data.recentFeedback) ? data.recentFeedback : [],
            themes: Array.isArray(data.themes) ? data.themes : [],
            volumeOverTime: Array.isArray(data.volumeOverTime) ? data.volumeOverTime : [],
            sentimentBreakdown: data.sentimentBreakdown ?? { positive: 0, neutral: 0, negative: 0 },
          });
        } else {
          const errData = await res.json().catch(() => ({}));
          setError(errData.error || `Failed to load stats (${res.status})`);
        }
      } catch (err: any) {
        console.error("Failed to load dashboard statistics", err);
        setError(err?.message || 'Network error loading dashboard');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <AlertCircle className="h-10 w-10 text-rose-500" />
        <p className="text-slate-700 font-medium">Failed to load dashboard</p>
        <p className="text-sm text-slate-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here&apos;s what&apos;s happening with your workspace customer feedback.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          icon={MessageSquarePlus}
          label="Total Feedback"
          value={stats.totalFeedback}
          trend={12}
          trendLabel="vs last period"
          iconClassName="bg-sky-50 text-sky-600"
        />
        <StatCard
          icon={Inbox}
          label="New This Week"
          value={stats.newThisWeek}
          trend={8}
          trendLabel="vs last week"
          iconClassName="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={AlertCircle}
          label="% Negative"
          value={`${stats.percentNegative}%`}
          trend={-3}
          trendLabel="improving"
          iconClassName="bg-rose-50 text-rose-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Top Theme"
          value={stats.topTheme || '—'}
          trend={8}
          trendLabel="vs last period"
          iconClassName="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon={Smile}
          label="Avg Sentiment"
          value={stats.avgScore >= 0 ? `+${stats.avgScore}` : stats.avgScore}
          trend={4}
          trendLabel="score out of 100"
          iconClassName="bg-violet-50 text-violet-600"
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Feedback Volume</CardTitle>
            <CardDescription>Daily feedback volume trends</CardDescription>
          </CardHeader>
          <CardContent>
            <VolumeChart data={stats.volumeOverTime} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sentiment Breakdown</CardTitle>
            <CardDescription>Across all feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <SentimentChart data={stats.sentimentBreakdown} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Top Themes</CardTitle>
            <CardDescription>Most discussed topics by volume</CardDescription>
          </CardHeader>
          <CardContent>
            <TopThemesChart data={stats.themes} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Feedback</CardTitle>
            <CardDescription>Latest items from all channels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.recentFeedback.length === 0 ? (
              <EmptyState icon={Inbox} title="No feedback yet" />
            ) : (
              stats.recentFeedback.map((item: FeedbackItem) => (
                <Link
                  key={item.id}
                  href={`/inbox`}
                  className="block rounded-lg border border-slate-100 p-3 transition-colors hover:border-slate-200 hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-2 text-sm text-slate-700">{item.content}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <ChannelBadge channel={item.channel as any} showIcon={false} />
                    <SentimentBadge sentiment={item.sentiment as any} showIcon={false} />
                  </div>
                </Link>
              ))
            )}
            <Link href="/inbox">
              <Button variant="outline" className="w-full">
                View all feedback
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
