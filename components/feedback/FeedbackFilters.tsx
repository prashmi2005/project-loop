'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import type { Channel, FeedbackFilters, FeedbackStatus, Sentiment } from '@/types';
import { themes } from '@/lib/mock-data';

interface FeedbackFiltersProps {
  filters: FeedbackFilters;
  onChange: (filters: FeedbackFilters) => void;
}

export function FeedbackFilters({ filters, onChange }: FeedbackFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {/* Search */}
      <div className="space-y-1.5">
        <Label className="text-xs text-slate-500">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search feedback..."
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>
      </div>

      {/* Channel */}
      <div className="space-y-1.5">
        <Label className="text-xs text-slate-500">Channel</Label>
        <Select
          value={filters.channel || 'all'}
          onValueChange={(v) => onChange({ ...filters, channel: v === 'all' ? '' : (v as Channel) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All channels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All channels</SelectItem>
            <SelectItem value="support_ticket">Support Ticket</SelectItem>
            <SelectItem value="app_review">App Review</SelectItem>
            <SelectItem value="nps_survey">NPS Survey</SelectItem>
            <SelectItem value="sales_call">Sales Call</SelectItem>
            <SelectItem value="community_post">Community Post</SelectItem>
            <SelectItem value="social_mention">Social Mention</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sentiment */}
      <div className="space-y-1.5">
        <Label className="text-xs text-slate-500">Sentiment</Label>
        <Select
          value={filters.sentiment || 'all'}
          onValueChange={(v) => onChange({ ...filters, sentiment: v === 'all' ? '' : (v as Sentiment) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All sentiments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sentiments</SelectItem>
            <SelectItem value="POS">Positive</SelectItem>
            <SelectItem value="NEU">Neutral</SelectItem>
            <SelectItem value="NEG">Negative</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div className="space-y-1.5">
        <Label className="text-xs text-slate-500">Status</Label>
        <Select
          value={filters.status || 'all'}
          onValueChange={(v) => onChange({ ...filters, status: v === 'all' ? '' : (v as FeedbackStatus) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="REVIEWED">Reviewed</SelectItem>
            <SelectItem value="ACTIONED">Actioned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Theme */}
      <div className="space-y-1.5">
        <Label className="text-xs text-slate-500">Theme</Label>
        <Select
          value={filters.themeId || 'all'}
          onValueChange={(v) => onChange({ ...filters, themeId: v === 'all' ? '' : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All themes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All themes</SelectItem>
            {themes.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date from */}
      <div className="space-y-1.5">
        <Label className="text-xs text-slate-500">Date from</Label>
        <Input
          type="date"
          value={filters.dateFrom || ''}
          onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
        />
      </div>

      {/* Date to */}
      <div className="space-y-1.5">
        <Label className="text-xs text-slate-500">Date to</Label>
        <Input
          type="date"
          value={filters.dateTo || ''}
          onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
        />
      </div>

      {/* Clear */}
      <div className="flex items-end">
        <button
          onClick={() => onChange({})}
          className="text-xs font-medium text-sky-600 hover:text-sky-700"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
