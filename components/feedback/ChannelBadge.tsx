import { cn } from '@/lib/utils';
import type { Channel } from '@/types';
import {
  LifeBuoy,
  Star,
  ClipboardList,
  PhoneCall,
  MessagesSquare,
  AtSign,
} from 'lucide-react';

const channelConfig: Record<
  Channel,
  { label: string; icon: typeof LifeBuoy; className: string }
> = {
  support_ticket: {
    label: 'Support Ticket',
    icon: LifeBuoy,
    className: 'text-sky-700 bg-sky-50 border-sky-200',
  },
  app_review: {
    label: 'App Review',
    icon: Star,
    className: 'text-violet-700 bg-violet-50 border-violet-200',
  },
  nps_survey: {
    label: 'NPS Survey',
    icon: ClipboardList,
    className: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  sales_call: {
    label: 'Sales Call',
    icon: PhoneCall,
    className: 'text-amber-700 bg-amber-50 border-amber-200',
  },
  community_post: {
    label: 'Community Post',
    icon: MessagesSquare,
    className: 'text-teal-700 bg-teal-50 border-teal-200',
  },
  social_mention: {
    label: 'Social Mention',
    icon: AtSign,
    className: 'text-rose-700 bg-rose-50 border-rose-200',
  },
};

interface ChannelBadgeProps {
  channel: Channel;
  showIcon?: boolean;
  className?: string;
}

export function ChannelBadge({ channel, showIcon = true, className }: ChannelBadgeProps) {
  const config = channelConfig[channel] ?? {
    label: channel ?? 'Unknown',
    icon: MessagesSquare,
    className: 'text-slate-700 bg-slate-50 border-slate-200',
  };
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

export { channelConfig };
