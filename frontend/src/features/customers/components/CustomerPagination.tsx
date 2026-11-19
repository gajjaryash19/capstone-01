import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface CustomerPaginationProps {
  page: number
  totalPages: number
  pageSize: number
  totalItems: number
  startIndex: number
  endIndex: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function CustomerPagination({
  page,
  totalPages,
  pageSize,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  onPageSizeChange,
}: CustomerPaginationProps) {
  if (totalItems === 0) return null

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      if (page > 3) pages.push('...')

      const start = Math.max(2, page - 1)
      const end = Math.min(totalPages - 1, page + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (page < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/80 text-xs">
      {/* Left: Results count and page size selector */}
      <div className="flex items-center gap-3 text-muted-foreground w-full sm:w-auto justify-between sm:justify-start">
        <span className="tabular-nums">
          Showing <strong className="text-foreground font-medium">{startIndex}</strong> to{' '}
          <strong className="text-foreground font-medium">{endIndex}</strong> of{' '}
          <strong className="text-foreground font-medium">{totalItems}</strong> customers
        </span>

        <div className="flex items-center gap-1.5 pl-2 border-l border-border/60">
          <label htmlFor="page-size-select" className="text-[11px] text-muted-foreground shrink-0">
            Per page:
          </label>
          <select
            id="page-size-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Select number of items per page"
            className="h-7 rounded-sm border border-border bg-card px-2 text-[11px] text-foreground hover:border-border-strong focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Right: Pagination Controls */}
      <nav aria-label="Customer Directory Pagination" className="flex items-center gap-1 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="h-8 px-2.5 text-xs gap-1 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="hidden xs:inline">Prev</span>
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-1.5 text-muted-foreground">
                  ...
                </span>
              )
            }

            const pageNum = p as number
            const isCurrent = pageNum === page

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                aria-current={isCurrent ? 'page' : undefined}
                aria-label={`Go to page ${pageNum}`}
                className={cn(
                  'h-8 min-w-[2rem] px-2 text-xs rounded-md font-medium transition-colors cursor-pointer',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isCurrent
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="h-8 px-2.5 text-xs gap-1 cursor-pointer disabled:cursor-not-allowed"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </nav>
    </div>
  )
}
