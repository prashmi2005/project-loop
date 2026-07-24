'use client';

import { useEffect, useState, useCallback } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { FeedbackFilters as FiltersBar } from '@/components/feedback/FeedbackFilters';
import { FeedbackTable } from '@/components/feedback/FeedbackTable';
import { Card } from '@/components/ui/card';
import { getFeedback } from '@/services/feedback.service';
import { toast } from 'sonner';
import type { FeedbackFilters, FeedbackItem, FeedbackStatus, PaginationMeta } from '@/types';

export default function InboxPage() {
  const [filters, setFilters] = useState<FeedbackFilters>({});
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getFeedback(filters, page);
      setItems(result.data);
      setMeta(result.meta);
    } catch {
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = (newFilters: FeedbackFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleStatusChange = async (id: string, status: FeedbackStatus) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    toast.success(`Status updated to ${status}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Feedback Inbox"
        description="Browse, filter, and triage all customer feedback in one place."
      />

      <Card className="p-4">
        <FiltersBar filters={filters} onChange={handleFilterChange} />
      </Card>

      <FeedbackTable
        items={items}
        meta={meta}
        loading={loading}
        onPageChange={setPage}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
