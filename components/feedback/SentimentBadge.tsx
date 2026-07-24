import { cn } from '@/lib/utils';
import type { Sentiment } from '@/types';
import { Smile, Meh, Frown } from 'lucide-react';

const sentimentConfig: Record<
  Sentiment,
  { label: string; className: string; icon: typeof Smile }
> = {
  POS: { label: 'Positive', className: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: Smile },
  NEU: { label: 'Neutral', className: 'text-amber-700 bg-amber-50 border-amber-200', icon: Meh },
  NEG: { label: 'Negative', className: 'text-rose-700 bg-rose-50 border-rose-200', icon: Frown },
};

interface SentimentBadgeProps {
  sentiment: Sentiment;
  showIcon?: boolean;
  className?: string;
}

export function SentimentBadge({ sentiment, showIcon = true, className }: SentimentBadgeProps) {
  const config = sentimentConfig[sentiment];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </span>
  );
}
