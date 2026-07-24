import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900">
        <Compass className="h-8 w-8 text-sky-400" />
      </div>
      <h1 className="text-6xl font-bold text-slate-900">404</h1>
      <p className="mt-3 text-lg text-slate-600">Page not found</p>
      <p className="mt-1 max-w-md text-sm text-slate-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
        <Link href="/dashboard">
          <Button className="bg-sky-600 hover:bg-sky-700">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
