import Link from 'next/link';
import { Workflow } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900">
                <Workflow className="h-6 w-6 text-sky-400" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">LOOP</span>
            </Link>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
