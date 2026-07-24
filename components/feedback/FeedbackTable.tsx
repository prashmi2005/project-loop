'use client';

import { FeedbackRow } from '@/components/feedback/FeedbackRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';
import { AppPagination } from '@/components/ui/AppPagination';
import { Inbox } from 'lucide-react';
import type { FeedbackItem, FeedbackStatus, PaginationMeta } from '@/types';

interface FeedbackTableProps {
  items: FeedbackItem[];
  meta: PaginationMeta | null;
  loading: boolean;
  onPageChange: (page: number) => void;
  onStatusChange: (id: string, status: FeedbackStatus) => void;
}

export function FeedbackTable({
  items,
  meta,
  loading,
  onPageChange,
  onStatusChange,
}: FeedbackTableProps) {
  if (loading) {
    return <TableSkeleton rows={6} />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No feedback found"
        description="Try adjusting your filters to see more results."
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {meta ? `Showing ${items.length} of ${meta.total} items` : `${items.length} items`}
        </p>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <FeedbackRow key={item.id} item={item} onStatusChange={onStatusChange} />
        ))}
      </div>
      {meta && (
        <AppPagination
          page={meta.page}
          totalPages={meta.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
