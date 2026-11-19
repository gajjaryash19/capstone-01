import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Users,
  Building2,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import type { EnrichedPredictionCustomer, PredictionSortField, SortDirection } from '../types'

interface PredictionTableProps {
  customers: EnrichedPredictionCustomer[]
  sortField: PredictionSortField
  sortDirection: SortDirection
  onSort: (field: PredictionSortField) => void
  onSelectCustomer: (customer: EnrichedPredictionCustomer) => void
  onResetFilters: () => void
  hasActiveFilters: boolean
}

export function PredictionTable({
  customers,
  sortField,
  sortDirection,
  onSort,
  onSelectCustomer,
  onResetFilters,
  hasActiveFilters,
}: PredictionTableProps) {
  const renderSortableHeader = (field: PredictionSortField, label: string, alignRight = false) => {
    const isSorted = sortField === field
    const ariaSortValue = isSorted ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'

    return (
      <TableHead
        scope="col"
        aria-sort={ariaSortValue}
        className={`px-2.5 sm:px-3 h-9 text-xs font-semibold ${
          alignRight ? 'text-right' : 'text-left'
        }`}
      >
        <button
          type="button"
          onClick={() => onSort(field)}
          className={`inline-flex items-center gap-1 text-xs font-semibold hover:text-foreground transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-xs px-1 py-0.5 -mx-1 ${
            isSorted ? 'text-foreground' : 'text-muted-foreground'
          }`}
          aria-label={`Sort by ${label} (${ariaSortValue})`}
        >
          <span>{label}</span>
          <span className="shrink-0 text-muted-foreground/60 group-hover:text-foreground">
            {isSorted ? (
              sortDirection === 'asc' ? (
                <ArrowUp className="h-3 w-3 text-primary" />
              ) : (
                <ArrowDown className="h-3 w-3 text-primary" />
              )
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-40 group-hover:opacity-100" />
            )}
          </span>
        </button>
      </TableHead>
    )
  }

  const getRiskVariant = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'teal' as const
      case 'moderate':
        return 'warning' as const
      case 'high':
      default:
        return 'destructive' as const
    }
  }

  const getSegmentVariant = (segment: string) => {
    switch (segment) {
      case 'Enterprise':
        return 'border-primary/30 bg-primary/10 text-primary'
      case 'Mid-Market':
        return 'border-sky-500/30 bg-sky-500/10 text-sky-700'
      case 'Growth':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700'
      case 'Standard':
      default:
        return 'border-border bg-muted/60 text-muted-foreground'
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {renderSortableHeader('name', 'Account / Customer')}
              {renderSortableHeader('segment', 'Segment')}
              <TableHead
                scope="col"
                className="px-2.5 sm:px-3 h-9 text-xs font-semibold text-muted-foreground"
              >
                Horizon
              </TableHead>
              {renderSortableHeader('historicalRevenue', 'Historical Spend', true)}
              {renderSortableHeader('predictedClv', 'Predicted CLV', true)}
              {renderSortableHeader('valueDelta', 'Projected Delta', true)}
              {renderSortableHeader('churnProbability', 'Retention Risk')}
              <TableHead
                scope="col"
                className="px-2.5 sm:px-3 h-9 text-xs font-semibold text-right pr-3 sm:pr-4"
              >
                Profile
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2.5">
                    <div className="rounded-full bg-muted/80 p-3 text-muted-foreground">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-foreground">
                        No prediction records match your criteria
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Try loosening your search term or resetting your segment filters.
                      </p>
                    </div>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onResetFilters}
                        className="mt-1 h-7 text-xs cursor-pointer"
                      >
                        Reset filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow
                  key={customer.id}
                  onClick={() => onSelectCustomer(customer)}
                  className="cursor-pointer hover:bg-muted/30 transition-colors group"
                >
                  {/* Account Name & Company */}
                  <TableCell className="px-2.5 sm:px-3 py-2.5 max-w-[220px]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/70 text-primary font-bold text-[10px] border border-primary/20">
                        {customer.avatarInitials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {customer.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <span className="font-mono">{customer.id}</span>
                          <span>•</span>
                          <span className="truncate flex items-center gap-0.5">
                            <Building2 className="h-2.5 w-2.5 inline" />
                            {customer.company}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Segment */}
                  <TableCell className="px-2.5 sm:px-3 py-2.5">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium border ${getSegmentVariant(
                        customer.segment,
                      )}`}
                    >
                      {customer.segment}
                    </span>
                  </TableCell>

                  {/* Horizon */}
                  <TableCell className="px-2.5 sm:px-3 py-2.5">
                    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground border border-border/80">
                      12 Mo
                    </span>
                  </TableCell>

                  {/* Historical Revenue */}
                  <TableCell className="px-2.5 sm:px-3 py-2.5 text-right font-medium tabular-nums text-muted-foreground">
                    {formatCurrency(customer.historicalRevenue)}
                  </TableCell>

                  {/* Predicted CLV */}
                  <TableCell className="px-2.5 sm:px-3 py-2.5 text-right font-bold tabular-nums text-foreground">
                    <span className="text-primary font-semibold">
                      {formatCurrency(customer.predictedClv)}
                    </span>
                  </TableCell>

                  {/* Projected Net Delta */}
                  <TableCell className="px-2.5 sm:px-3 py-2.5 text-right tabular-nums">
                    <div className="flex items-center justify-end gap-1 font-semibold text-xs">
                      {customer.isExpansion ? (
                        <span className="inline-flex items-center text-emerald-600 gap-0.5">
                          <TrendingUp className="h-3 w-3" />
                          <span>+{formatCurrency(customer.valueDelta)}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-amber-600 gap-0.5">
                          <TrendingDown className="h-3 w-3" />
                          <span>{formatCurrency(customer.valueDelta)}</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {customer.isExpansion ? '+' : ''}
                      {customer.valueDeltaPercent}%
                    </div>
                  </TableCell>

                  {/* Retention Risk */}
                  <TableCell className="px-2.5 sm:px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <Badge variant={getRiskVariant(customer.churnRisk)} dot>
                        {customer.churnRisk.toUpperCase()}
                      </Badge>
                      <span className="text-[11px] tabular-nums text-muted-foreground font-mono">
                        {formatPercent(customer.churnProbability * 100, 0)}
                      </span>
                    </div>
                  </TableCell>

                  {/* Action */}
                  <TableCell className="px-2.5 sm:px-3 py-2.5 text-right pr-3 sm:pr-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectCustomer(customer)
                      }}
                      className="h-7 px-2 text-[11px] gap-1 cursor-pointer hover:bg-card"
                      aria-label={`View profile for ${customer.name}`}
                    >
                      <span>View</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
