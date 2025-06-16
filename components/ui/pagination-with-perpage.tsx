'use client';

import React from 'react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationWithPerPageProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  baseUrl: string;
  className?: string;
}

export function PaginationWithPerPage({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPerPageChange,
  baseUrl,
  className
}: PaginationWithPerPageProps) {
  const perPageOptions = [10, 20, 30, 50, 100];
  
  const getPageUrl = (page: number, newPerPage?: number) => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('per_page', (newPerPage || perPage).toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalItems);

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4", className)}>
      {/* Items info and per-page selector */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          Showing {startItem}-{endItem} of {totalItems} items
        </span>
        <div className="flex items-center gap-2">
          <span>Show:</span>
          <Select
            value={perPage.toString()}
            onValueChange={(value) => {
              const newPerPage = parseInt(value);
              onPerPageChange(newPerPage);
              // Navigate to first page with new per-page value
              window.location.href = getPageUrl(1, newPerPage);
            }}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {perPageOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>per page</span>
        </div>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* Previous button */}
          <Button
            variant="outline"
            size="sm"
            asChild={currentPage > 1}
            disabled={currentPage <= 1}
            className="h-8 w-8 p-0"
          >
            {currentPage > 1 ? (
              <Link href={getPageUrl(currentPage - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>

          {/* Page numbers */}
          {generatePageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <Button variant="ghost" size="sm" disabled className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  asChild={currentPage !== page}
                  disabled={currentPage === page}
                  className="h-8 w-8 p-0"
                >
                  {currentPage !== page ? (
                    <Link href={getPageUrl(page as number)}>
                      {page}
                    </Link>
                  ) : (
                    <span>{page}</span>
                  )}
                </Button>
              )}
            </React.Fragment>
          ))}

          {/* Next button */}
          <Button
            variant="outline"
            size="sm"
            asChild={currentPage < totalPages}
            disabled={currentPage >= totalPages}
            className="h-8 w-8 p-0"
          >
            {currentPage < totalPages ? (
              <Link href={getPageUrl(currentPage + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}