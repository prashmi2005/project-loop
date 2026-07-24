'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Bot, Clock, RefreshCw, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SentimentBadge } from '@/components/feedback/SentimentBadge';
import { ChannelBadge } from '@/components/feedback/ChannelBadge';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { PageHeader } from '@/components/ui/PageHeader';
import { toast } from 'sonner';
import { getFeedbackById, reclassifyFeedback, updateFeedbackStatus } from '@/services/feedback.service';
import type { FeedbackItem, FeedbackStatus } from '@/types';

export default function FeedbackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [item, setItem] = useState<FeedbackItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [reclassifying, setReclassifying] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getFeedbackById(id);
      setItem(data);
      setLoading(false);
    })();
  }, [id]);

  const handleStatusChange = async (status: FeedbackStatus) => {
    if (!item) return;
    setItem({ ...item, status });
    await updateFeedbackStatus(id, status);
    toast.success(`Status updated to ${status}`);
  };

  const handleReclassify = async () => {
    if (!item) return;
    setReclassifying(true);
    try {
      await reclassifyFeedback(id);
      toast.success('Re-classification complete — no changes detected');
    } finally {
      setReclassifying(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push('/inbox')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to inbox
        </Button>
        <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push('/inbox')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to inbox
        </Button>
        <Card>
          <CardContent className="py-12 text-center text-slate-500">
            Feedback item not found.
          </CardContent>
        </Card>
      </div>
    );
  }

  const date = new Date(item.createdAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Feedback Detail"
        breadcrumbs={[{ label: 'Inbox', href: '/inbox' }, { label: item.id }]}
        actions={
          <Button variant="ghost" onClick={() => router.push('/inbox')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <ChannelBadge channel={item.channel} />
                <SentimentBadge sentiment={item.sentiment} />
                <StatusBadge status={item.status} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed text-slate-800">{item.content}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                <Clock className="h-4 w-4" />
                {date}
              </div>
            </CardContent>
          </Card>

          {/* AI Classification */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50">
                  <Bot className="h-4 w-4 text-sky-600" />
                </div>
                <CardTitle className="text-lg">AI Classification</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-slate-500">Sentiment Score</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${
                          item.sentimentScore > 0
                            ? 'bg-emerald-500'
                            : item.sentimentScore < 0
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.abs(item.sentimentScore)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      {item.sentimentScore > 0 ? '+' : ''}
                      {item.sentimentScore}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Feature Area</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {item.featureArea || '—'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Detected Themes</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.themes.map((t) => (
                    <span
                      key={t.id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-700"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: t.color }}
                      />
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Classification Rationale</p>
                <p className="mt-1 text-sm text-slate-600">
                  This feedback was classified as <strong>{item.sentiment === 'POS' ? 'Positive' : item.sentiment === 'NEG' ? 'Negative' : 'Neutral'}</strong> based on
                  sentiment analysis of the language used. The themes were matched based on
                  keyword detection related to <strong>{item.themes.map((t) => t.name).join(', ')}</strong>.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReclassify}
                disabled={reclassifying}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${reclassifying ? 'animate-spin' : ''}`} />
                {reclassifying ? 'Re-classifying...' : 'Re-classify'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                  <User className="h-4 w-4" /> Customer
                </span>
                <span className="text-sm font-medium text-slate-700">
                  {item.customerLabel || '—'}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-sm text-slate-500">Source Ref</span>
                <span className="text-sm font-medium text-slate-700">
                  {item.sourceRef || '—'}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-sm text-slate-500">Channel</span>
                <ChannelBadge channel={item.channel} showIcon={false} />
              </div>
              <div className="flex items-start justify-between">
                <span className="text-sm text-slate-500">Created</span>
                <span className="text-sm font-medium text-slate-700">{date}</span>
              </div>
              {item.classifiedAt && (
                <div className="flex items-start justify-between">
                  <span className="text-sm text-slate-500">Classified</span>
                  <span className="text-sm font-medium text-slate-700">
                    {new Date(item.classifiedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status workflow */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(['NEW', 'REVIEWED', 'ACTIONED'] as FeedbackStatus[]).map((status) => (
                <Button
                  key={status}
                  variant={item.status === status ? 'default' : 'outline'}
                  className={`w-full justify-start ${
                    item.status === status ? 'bg-sky-600 hover:bg-sky-700' : ''
                  }`}
                  onClick={() => handleStatusChange(status)}
                  disabled={item.status === status}
                >
                  {item.status === status ? '✓ ' : ''}
                  {status === 'NEW' ? 'New' : status === 'REVIEWED' ? 'Reviewed' : 'Actioned'}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
