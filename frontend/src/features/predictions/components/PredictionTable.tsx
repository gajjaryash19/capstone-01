import { memo } from 'react'
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

interface PredictionTableRowProps {
  customer: EnrichedPredictionCustomer
  onSelectCustomer: (customer: EnrichedPredictionCustomer) => void
  getSegmentBadgeStyle: (segment: string) => string
  getRiskBadge: (risk: string) => string
}

const PredictionTableRow = memo(function PredictionTableRow({
  customer,
  onSelectCustomer,
  getSegmentBadgeStyle,
  getRiskBadge,
}: PredictionTableRowProps) {
  const isPositiveDelta = customer.valueDelta >= 0

  return (
    <TableRow
      key={customer.id}
      onClick={() => onSelectCustomer(customer)}
      tabIndex={0}
      role="row"
      aria-label={`Inspect predictions for ${customer.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelectCustomer(customer)
        }
      }}
      className="hover:bg-surface-elevated/60 transition-colors duration-150 ease-out cursor-pointer group border-b border-border/70 focus-visible:bg-surface-elevated/60 outline-none"
    >
      {/* Account Identity */}
      <TableCell className="px-2.5 sm:px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-elevated font-mono text-[11px] font-semibold text-foreground border border-border">
            {customer.avatarInitials}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-xs text-foreground group-hover:text-foreground transition-colors truncate">
              {customer.name}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="font-mono text-muted-foreground/80">{customer.id}</span>
              <span className="truncate flex items-center gap-1">
                <Building2 className="h-2.5 w-2.5" />
                {customer.company}
              </span>
            </div>
          </div>
        </div>
      </TableCell>

      {/* Segment Badge */}
      <TableCell className="px-2.5 sm:px-3 py-3">
        <span
          className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] border ${getSegmentBadgeStyle(
            customer.segment,
          )}`}
        >
          {customer.segment}
        </span>
      </TableCell>

      {/* Horizon */}
      <TableCell className="px-2.5 sm:px-3 py-3 font-mono text-xs text-muted-foreground">
        12 Months
      </TableCell>

      {/* Historical Spend */}
      <TableCell className="px-2.5 sm:px-3 py-3 text-right font-mono text-xs tabular-nums text-muted-foreground">
        {formatCurrency(customer.historicalRevenue)}
      </TableCell>

      {/* Predicted CLV */}
      <TableCell className="px-2.5 sm:px-3 py-3 text-right font-mono text-xs font-semibold tabular-nums text-foreground">
        {formatCurrency(customer.predictedClv)}
      </TableCell>

      {/* Projected Delta */}
      <TableCell className="px-2.5 sm:px-3 py-3 text-right font-mono text-xs tabular-nums">
        <div className="inline-flex items-center gap-1 font-medium text-foreground">
          {isPositiveDelta ? (
            <>
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
              <span>+{formatCurrency(customer.valueDelta)}</span>
            </>
          ) : (
            <>
              <TrendingDown className="h-3 w-3 text-muted-foreground" />
              <span>{formatCurrency(customer.valueDelta)}</span>
            </>
          )}
          <span className="text-[10px] text-muted-foreground">
            ({isPositiveDelta ? '+' : ''}
            {formatPercent(customer.valueDeltaPercent, 0)})
          </span>
        </div>
      </TableCell>

      {/* Churn Propensity & Risk */}
      <TableCell className="px-2.5 sm:px-3 py-3">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] uppercase border ${getRiskBadge(
              customer.churnRisk,
            )}`}
          >
            {customer.churnRisk}
          </span>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {formatPercent(customer.churnProbability * 100, 1)}
          </span>
        </div>
      </TableCell>

      {/* Profile Link Action */}
      <TableCell className="px-2.5 sm:px-3 py-3 text-right pr-3 sm:pr-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onSelectCustomer(customer)
          }}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          title="Open customer intelligence profile"
          aria-label={`Open customer intelligence profile for ${customer.name}`}
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </TableCell>
    </TableRow>
  )
})

function PredictionTableComponent({
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
          className={`inline-flex items-center gap-1 text-xs font-semibold hover:text-foreground transition-all duration-150 active:scale-95 cursor-pointer group select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-xs px-1 py-0.5 -mx-1 ${
            isSorted ? 'text-foreground' : 'text-muted-foreground'
          }`}
          aria-label={`Sort by ${label} (${ariaSortValue})`}
        >
          <span>{label}</span>
          <span className="shrink-0 text-muted-foreground/60 group-hover:text-foreground">
            {isSorted ? (
              sortDirection === 'asc' ? (
                <ArrowUp className="h-3 w-3 text-foreground" />
              ) : (
                <ArrowDown className="h-3 w-3 text-foreground" />
              )
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-40 group-hover:opacity-100" />
            )}
          </span>
        </button>
      </TableHead>
    )
  }

  const getSegmentBadgeStyle = (segment: string) => {
    switch (segment) {
      case 'Enterprise':
        return 'border-foreground/30 bg-surface-elevated text-foreground font-semibold'
      case 'Mid-Market':
        return 'border-border bg-muted/60 text-foreground/90 font-medium'
      case 'Growth':
        return 'border-border bg-muted/40 text-muted-foreground font-medium'
      case 'Standard':
      default:
        return 'border-border/60 bg-muted/20 text-muted-foreground/80 font-normal'
    }
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'border-red-500/30 bg-red-500/10 text-red-400 font-semibold'
      case 'moderate':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-400 font-medium'
      case 'low':
      default:
        return 'border-border bg-muted/40 text-muted-foreground font-medium'
    }
  }

  return (
    <div className="rounded-lg border border-border bg-surface shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-elevated/70 border-b border-border">
              {renderSortableHeader('name', 'Customer')}
              {renderSortableHeader('segment', 'Segment')}
              <TableHead
                scope="col"
                className="px-2.5 sm:px-3 h-9 text-xs font-semibold text-muted-foreground"
              >
                Horizon
              </TableHead>
              {renderSortableHeader('historicalRevenue', 'Past Spend', true)}
              {renderSortableHeader('predictedClv', 'Predicted CLV', true)}
              {renderSortableHeader('valueDelta', 'Projected Change', true)}
              {renderSortableHeader('churnProbability', 'Churn Risk')}
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
                    <div className="rounded-2xl bg-surface-elevated p-3 text-muted-foreground border border-border">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-foreground">No customers found</p>
                      <p className="text-[11px] text-muted-foreground">
                        Try adjusting your search or clearing your filters.
                      </p>
                    </div>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onResetFilters}
                        className="text-xs mt-1 cursor-pointer bg-surface-elevated border-border"
                      >
                        Reset filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <PredictionTableRow
                  key={customer.id}
                  customer={customer}
                  onSelectCustomer={onSelectCustomer}
                  getSegmentBadgeStyle={getSegmentBadgeStyle}
                  getRiskBadge={getRiskBadge}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export const PredictionTable = memo(PredictionTableComponent)
export default PredictionTable
