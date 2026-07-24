import { cn } from '@/lib/utils';
import type { Role } from '@/types';

const roleStyles: Record<Role, string> = {
  ADMIN: 'text-rose-600 bg-rose-50 border-rose-200',
  ANALYST: 'text-sky-600 bg-sky-50 border-sky-200',
  VIEWER: 'text-slate-600 bg-slate-100 border-slate-200',
};

interface RoleBadgeProps {
  role: Role;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        roleStyles[role],
        className
      )}
    >
      {role}
    </span>
  );
}
