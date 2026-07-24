import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function AppPagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {start > 1 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 min-w-[2rem]"
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
          {start > 2 && <span className="px-1 text-slate-400">...</span>}
        </>
      )}
      {pages.map((p) => (
        <Button
          key={p}
          variant={p === page ? 'default' : 'ghost'}
          size="sm"
          className={cn(
            'h-8 min-w-[2rem]',
            p === page && 'bg-sky-600 hover:bg-sky-700'
          )}
          onClick={() => onPageChange(p)}
        >
          {p}
        </Button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-slate-400">...</span>}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 min-w-[2rem]"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
