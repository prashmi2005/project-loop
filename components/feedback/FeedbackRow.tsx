'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye } from 'lucide-react';
import { SentimentBadge } from '@/components/feedback/SentimentBadge';
import { ChannelBadge } from '@/components/feedback/ChannelBadge';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import type { FeedbackItem, FeedbackStatus } from '@/types';

interface FeedbackRowProps {
  item: FeedbackItem;
  onStatusChange: (id: string, status: FeedbackStatus) => void;
}

export function FeedbackRow({ item, onStatusChange }: FeedbackRowProps) {
  const date = new Date(item.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 hover:bg-slate-50">
      <Link href={`/inbox/${item.id}`} className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <p className="line-clamp-2 text-sm font-medium text-slate-900">{item.content}</p>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <ChannelBadge channel={item.channel} showIcon={false} />
          <SentimentBadge sentiment={item.sentiment} showIcon={false} />
          <StatusBadge status={item.status} />
          {item.themes.map((t) => (
            <span
              key={t.id}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: t.color }}
              />
              {t.name}
            </span>
          ))}
          <span className="text-xs text-slate-400">{date}</span>
        </div>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/inbox/${item.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange(item.id, 'NEW')}>
            Mark as New
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange(item.id, 'REVIEWED')}>
            Mark as Reviewed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange(item.id, 'ACTIONED')}>
            Mark as Actioned
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
