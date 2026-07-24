import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  iconClassName?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendLabel,
  iconClassName,
}: StatCardProps) {
  const showTrend = trend !== undefined;
  const isUp = (trend ?? 0) > 0;
  const isDown = (trend ?? 0) < 0;
  const isFlat = trend === 0;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              iconClassName || 'bg-sky-50 text-sky-600'
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {showTrend && (
          <div
            className={cn(
              'flex items-center gap-0.5 text-xs font-semibold',
              isUp && 'text-emerald-600',
              isDown && 'text-rose-600',
              isFlat && 'text-slate-400'
            )}
          >
            {isUp && <ArrowUp className="h-3 w-3" />}
            {isDown && <ArrowDown className="h-3 w-3" />}
            {isFlat && <Minus className="h-3 w-3" />}
            {Math.abs(trend!)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="mt-0.5 text-sm text-slate-500">{label}</div>
        {trendLabel && (
          <div className="mt-1 text-xs text-slate-400">{trendLabel}</div>
        )}
      </div>
    </Card>
  );
}
