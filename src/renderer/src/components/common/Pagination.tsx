import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onNext,
  onPrev,
}) => {
  // Hide pagination entirely if there's only 1 page of data
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2 py-4 mt-2 border-t border-zinc-800/50">
      <span className="text-sm text-zinc-400">
        Page <span className="font-medium text-zinc-200">{currentPage}</span> of{' '}
        <span className="font-medium text-zinc-200">{totalPages}</span>
      </span>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onPrev}
          disabled={!hasPrevPage}
          className="gap-1.5 pl-2.5"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onNext}
          disabled={!hasNextPage}
          className="gap-1.5 pr-2.5"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};