'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { GenerateReportModal } from '@/components/reports/GenerateReportModal';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowRight, FileText, Plus } from 'lucide-react';
import { getReports } from '@/services/reports.service';
import type { Report } from '@/types';

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getReports();
      setReports(data);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate and view Voice of the Customer reports."
        actions={
          <Button
            className="bg-sky-600 hover:bg-sky-700"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        }
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No reports yet"
          description="Generate your first Voice of the Customer report to get started."
          actionLabel="Generate Report"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <Link key={report.id} href={`/reports/${report.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50">
                      <FileText className="h-6 w-6 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{report.title}</h3>
                      <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                        <span>
                          {report.periodStart} → {report.periodEnd}
                        </span>
                        <span>•</span>
                        <span>
                          {report.contentJson.totalFeedback} items
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="bg-slate-100 text-[10px] font-semibold text-slate-600">
                            {report.generatedBy.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        {report.generatedBy.name} •{' '}
                        {new Date(report.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="h-5 w-5 text-slate-400" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <GenerateReportModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
