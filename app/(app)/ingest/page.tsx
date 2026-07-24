'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/ui/PageHeader';
import { SentimentBadge } from '@/components/feedback/SentimentBadge';
import { ChannelBadge } from '@/components/feedback/ChannelBadge';
import { Bot, FileUp, Loader2, Radio, Sparkles, Upload } from 'lucide-react';
import { createFeedback, simulateChannel, uploadCsv } from '@/services/feedback.service';
import { toast } from 'sonner';
import type { Channel, FeedbackItem } from '@/types';

export default function IngestPage() {
  const [tab, setTab] = useState('single');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ingest Feedback"
        description="Add feedback manually, upload a CSV, or simulate a channel."
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="single">
            <Sparkles className="mr-2 h-4 w-4" />
            Single Entry
          </TabsTrigger>
          <TabsTrigger value="csv">
            <FileUp className="mr-2 h-4 w-4" />
            CSV Upload
          </TabsTrigger>
          <TabsTrigger value="simulator">
            <Radio className="mr-2 h-4 w-4" />
            Channel Simulator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <SingleEntryTab />
        </TabsContent>
        <TabsContent value="csv">
          <CsvUploadTab />
        </TabsContent>
        <TabsContent value="simulator">
          <SimulatorTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SingleEntryTab() {
  const [content, setContent] = useState('');
  const [channel, setChannel] = useState<Channel>('support_ticket');
  const [customerLabel, setCustomerLabel] = useState('');
  const [sourceRef, setSourceRef] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<FeedbackItem | null>(null);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Please enter feedback content');
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const created = await createFeedback({ content, channel, customerLabel, sourceRef });
      setResult(created);
      toast.success('Feedback classified successfully!');
      setContent('');
      setCustomerLabel('');
      setSourceRef('');
    } catch {
      toast.error('Failed to classify feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Feedback Content</Label>
            <Textarea
              id="content"
              placeholder="Paste or type the customer feedback here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Channel</Label>
              <Select value={channel} onValueChange={(v) => setChannel(v as Channel)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="support_ticket">Support Ticket</SelectItem>
                  <SelectItem value="app_review">App Review</SelectItem>
                  <SelectItem value="nps_survey">NPS Survey</SelectItem>
                  <SelectItem value="sales_call">Sales Call</SelectItem>
                  <SelectItem value="community_post">Community Post</SelectItem>
                  <SelectItem value="social_mention">Social Mention</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerLabel">Customer Label</Label>
              <Input
                id="customerLabel"
                placeholder="e.g. Acme Corp"
                value={customerLabel}
                onChange={(e) => setCustomerLabel(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sourceRef">Source Reference</Label>
            <Input
              id="sourceRef"
              placeholder="e.g. TKT-1234"
              value={sourceRef}
              onChange={(e) => setSourceRef(e.target.value)}
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-sky-600 hover:bg-sky-700"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Classifying with AI...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Submit & Classify
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-sky-600" />
            <CardTitle className="text-lg">AI Classification Result</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {submitting && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
              <p className="mt-3 text-sm text-slate-500">Analyzing feedback with AI...</p>
            </div>
          )}
          {!submitting && !result && (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
              <Bot className="h-10 w-10" />
              <p className="mt-3 text-sm">Submit feedback to see AI classification results.</p>
            </div>
          )}
          {!submitting && result && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-500">Content</p>
                <p className="mt-1 text-sm text-slate-800">{result.content}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <ChannelBadge channel={result.channel} />
                <SentimentBadge sentiment={result.sentiment} />
                <span className="text-xs text-slate-500">
                  Score: {result.sentimentScore > 0 ? '+' : ''}
                  {result.sentimentScore}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Detected Themes</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.themes.map((t) => (
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
                <p className="text-xs font-medium text-slate-500">Feature Area</p>
                <p className="mt-1 text-sm text-slate-700">{result.featureArea}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CsvUploadTab() {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ success: number; failed: number; total: number } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a CSV file first');
      return;
    }
    setUploading(true);
    try {
      const res = await uploadCsv(file);
      setResult(res);
      toast.success(`Imported ${res.success} items successfully`);
      setFile(null);
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">CSV Upload</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center"
        >
          <Upload className="h-10 w-10 text-slate-400" />
          <p className="mt-3 text-sm font-medium text-slate-700">
            {file ? `Selected file: ${file.name}` : "Select a CSV file to upload"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            File must contain 'content' and 'channel' columns
          </p>
          
          <div className="mt-6 flex flex-col items-center gap-3">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-file-input"
            />
            <Label
              htmlFor="csv-file-input"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 cursor-pointer"
            >
              <FileUp className="mr-2 h-4 w-4" />
              Choose File
            </Label>

            {file && (
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-sky-600 hover:bg-sky-700"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing CSV...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload & Process
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold text-slate-700">Expected columns:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {['content', 'channel', 'customer_label', 'source_ref'].map((col) => (
              <code
                key={col}
                className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600"
              >
                {col}
              </code>
            ))}
          </div>
        </div>

        {result && (
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Import Summary</p>
            <div className="mt-3 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-600">{result.success}</div>
                <div className="text-xs text-slate-500">Imported</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-rose-600">{result.failed}</div>
                <div className="text-xs text-slate-500">Failed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{result.total}</div>
                <div className="text-xs text-slate-500">Total</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SimulatorTab() {
  const channels: { channel: Channel; label: string; icon: typeof Radio }[] = [
    { channel: 'support_ticket', label: 'Support Tickets', icon: Radio },
    { channel: 'app_review', label: 'App Reviews', icon: Radio },
    { channel: 'nps_survey', label: 'NPS Surveys', icon: Radio },
    { channel: 'sales_call', label: 'Sales Calls', icon: Radio },
    { channel: 'community_post', label: 'Community Posts', icon: Radio },
  ];
  const [simulating, setSimulating] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { generated: number; channel: string }>>({});

  const handleSimulate = async (channel: Channel) => {
    setSimulating(channel);
    try {
      const res = await simulateChannel(channel);
      setResults((prev) => ({ ...prev, [channel]: res }));
      toast.success(`Generated ${res.generated} ${channel.replace(/_/g, ' ')} items`);
    } catch {
      toast.error('Simulation failed');
    } finally {
      setSimulating(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Channel Simulator</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-slate-500">
          Simulate incoming feedback from a specific channel. Each click generates 10–20 realistic items.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {channels.map(({ channel, label, icon: Icon }) => (
            <div key={channel} className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleSimulate(channel)}
                disabled={simulating === channel}
              >
                {simulating === channel ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icon className="mr-2 h-4 w-4" />
                )}
                {label}
              </Button>
              {results[channel] && (
                <p className="text-xs text-emerald-600">
                  ✓ {results[channel].generated} items generated
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
