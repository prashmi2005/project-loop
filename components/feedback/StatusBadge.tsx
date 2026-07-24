import { cn } from '@/lib/utils';
import type { FeedbackStatus } from '@/types';

const statusConfig: Record<FeedbackStatus, { label: string; className: string; dotClass: string }> = {
  NEW: { label: 'New', className: 'text-sky-700 bg-sky-50 border-sky-200', dotClass: 'bg-sky-500' },
  REVIEWED: { label: 'Reviewed', className: 'text-amber-700 bg-amber-50 border-amber-200', dotClass: 'bg-amber-500' },
  ACTIONED: { label: 'Actioned', className: 'text-emerald-700 bg-emerald-50 border-emerald-200', dotClass: 'bg-emerald-500' },
};

interface StatusBadgeProps {
  status: FeedbackStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        config.className,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dotClass)} />
      {config.label}
    </span>
  );
}

export { statusConfig };
