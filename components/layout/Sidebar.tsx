'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Bell,
  Inbox,
  LayoutDashboard,
  MessageSquareText,
  Settings,
  Sparkles,
  Upload,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { RoleBadge } from '@/components/ui/RoleBadge';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Inbox', href: '/inbox', icon: Inbox },
  { label: 'Ingest', href: '/ingest', icon: Upload },
  { label: 'Trends', href: '/trends', icon: BarChart3 },
  { label: 'Ask LOOP', href: '/ask', icon: Sparkles },
  { label: 'Reports', href: '/reports', icon: MessageSquareText },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const initials = user
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div className="flex h-full flex-col bg-slate-900 text-slate-300">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500">
          <Workflow className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">LOOP</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" style={{ width: '1.125rem', height: '1.125rem' }} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-slate-800 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <Avatar className="h-9 w-9 border border-slate-700">
            <AvatarFallback className="bg-slate-800 text-sm font-semibold text-sky-400">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-medium text-white">
              {user?.name || 'User'}
            </div>
            <div className="mt-0.5">
              {user && <RoleBadge role={user.role} className="border-slate-700 bg-slate-800 text-slate-300" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
