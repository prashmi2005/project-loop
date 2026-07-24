'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50">
        <ShieldAlert className="h-8 w-8 text-rose-600" />
      </div>
      <h1 className="text-5xl font-bold text-slate-900">403</h1>
      <p className="mt-3 text-lg font-semibold text-slate-700">Access Denied</p>
      <p className="mt-1 max-w-md text-sm text-slate-500">
        You don&apos;t have permission to access this page. Contact your workspace admin if you
        believe this is an error.
      </p>
      <Link href="/dashboard">
        <Button className="mt-8 bg-sky-600 hover:bg-sky-700">Back to Dashboard</Button>
      </Link>
    </div>
  );
}
