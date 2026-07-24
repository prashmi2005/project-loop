'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Bell, LogOut, Menu, Search, Settings, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/auth-context';
import { RoleBadge } from '@/components/ui/RoleBadge';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/inbox': 'Feedback Inbox',
  '/ingest': 'Ingest Feedback',
  '/trends': 'Themes & Trends',
  '/ask': 'Ask LOOP',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/forbidden': 'Access Denied',
};

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname.startsWith('/inbox/')) return 'Feedback Detail';
    if (pathname.startsWith('/trends/')) return 'Theme Detail';
    if (pathname.startsWith('/reports/')) return 'Report Detail';
    return pageTitles[pathname] || 'LOOP';
  };

  const initials = user
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-slate-900">{getTitle()}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search feedback..."
            className="w-64 pl-9"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                router.push('/inbox');
              }
            }}
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => router.push('/inbox')}
        >
          <Bell className="h-5 w-5 text-slate-500" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-sky-500" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-slate-100">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-sky-100 text-xs font-semibold text-sky-700">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
                <div className="pt-1">
                  {user && <RoleBadge role={user.role} />}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <UserIcon className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="text-rose-600 focus:text-rose-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
