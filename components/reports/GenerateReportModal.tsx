'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { generateReport } from '@/services/reports.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface GenerateReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  'Collecting feedback for period...',
  'Analyzing sentiment shifts...',
  'Clustering themes...',
  'Extracting notable quotes...',
  'Generating recommended actions...',
  'Finalizing report...',
];

export function GenerateReportModal({ open, onOpenChange }: GenerateReportModalProps) {
  const router = useRouter();
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const setQuickRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setPeriodStart(start.toISOString().split('T')[0]);
    setPeriodEnd(end.toISOString().split('T')[0]);
  };

  const setThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    setPeriodStart(start.toISOString().split('T')[0]);
    setPeriodEnd(now.toISOString().split('T')[0]);
  };

  const handleGenerate = async () => {
    if (!periodStart || !periodEnd) {
      toast.error('Please select a date range');
      return;
    }
    setGenerating(true);
    setProgress(0);
    setCurrentStep(0);

    // Animate steps
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      setProgress(((i + 1) / steps.length) * 100);
      await new Promise((r) => setTimeout(r, 300));
    }

    try {
      const report = await generateReport(periodStart, periodEnd);
      toast.success('Report generated successfully!');
      onOpenChange(false);
      // Navigate to the report (it's in mock data, but we'll just go to reports list)
      router.push('/reports');
    } catch {
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
      setProgress(0);
      setCurrentStep(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
          <DialogDescription>
            Create a Voice of the Customer report for a specific period.
          </DialogDescription>
        </DialogHeader>

        {!generating ? (
          <div className="space-y-4">
            {/* Quick ranges */}
            <div>
              <Label className="mb-2 block">Quick select</Label>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setQuickRange(7)}>
                  Last 7 days
                </Button>
                <Button variant="outline" size="sm" onClick={() => setQuickRange(30)}>
                  Last 30 days
                </Button>
                <Button variant="outline" size="sm" onClick={setThisMonth}>
                  This month
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="periodStart">Start date</Label>
                <Input
                  id="periodStart"
                  type="date"
                  value={periodStart}
                  onChange={(e) => setPeriodStart(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="periodEnd">End date</Label>
                <Input
                  id="periodEnd"
                  type="date"
                  value={periodEnd}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  {i < currentStep ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : i === currentStep ? (
                    <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-slate-200" />
                  )}
                  <span
                    className={
                      i <= currentStep ? 'text-slate-700' : 'text-slate-400'
                    }
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-sky-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {!generating && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!periodStart || !periodEnd}
              className="bg-sky-600 hover:bg-sky-700"
            >
              Generate Report
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
