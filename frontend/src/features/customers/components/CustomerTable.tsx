import { memo } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, Users, Building2 } from 'lucide-react'
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
import { formatCurrency, formatDate, formatNumber } from '@/lib/formatters'
import { prefetchRoute } from '@/lib/router/prefetch'
import type { CustomerRecord, CustomerSortField, SortDirection } from '../types'

interface CustomerTableProps {
  customers: CustomerRecord[]
  sortField: CustomerSortField
  sortDirection: SortDirection
  onSort: (field: CustomerSortField) => void
  onSelectCustomer: (customer: CustomerRecord) => void
  onResetFilters: () => void
  hasActiveFilters: boolean
}

interface CustomerTableRowProps {
  customer: CustomerRecord
  onSelectCustomer: (customer: CustomerRecord) => void
  getSegmentBadge: (segment: string) => string
  getRiskBadge: (risk: string) => React.ReactNode
}

const CustomerTableRow = memo(function CustomerTableRow({
  customer,
  onSelectCustomer,
  getSegmentBadge,
  getRiskBadge,
}: CustomerTableRowProps) {
  return (
    <TableRow
      key={customer.id}
      onClick={() => onSelectCustomer(customer)}
      onPointerEnter={() => prefetchRoute('customerProfile')}
      className="cursor-pointer transition-colors duration-150 ease-out hover:bg-surface-elevated/60 group focus-visible:bg-surface-elevated/60 outline-none"
      tabIndex={0}
      role="button"
      aria-label={`View customer details for ${customer.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelectCustomer(customer)
        }
      }}
    >
      {/* Customer: Avatar, Name, ID & Company */}
      <TableCell className="px-2 sm:px-2.5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-foreground font-semibold text-xs border border-border shadow-2xs">
            {customer.avatarInitials}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-foreground truncate group-hover:text-foreground transition-colors flex items-center gap-1.5 text-xs">
              <span>{customer.name}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="font-mono">{customer.id}</span>
              <span className="text-muted-foreground/50">•</span>
              <span className="truncate flex items-center gap-0.5">
                <Building2 className="h-2.5 w-2.5 inline" />
                {customer.company}
              </span>
            </div>
          </div>
        </div>
      </TableCell>

      {/* Segment Badge */}
      <TableCell className="px-2 sm:px-2.5 py-3 whitespace-nowrap">
        <span
          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono border ${getSegmentBadge(
            customer.segment,
          )}`}
        >
          {customer.segment}
        </span>
      </TableCell>

      {/* Predicted CLV */}
      <TableCell className="px-2 sm:px-2.5 py-3 text-right font-mono font-semibold tabular-nums text-foreground">
        <span className="text-foreground">{formatCurrency(customer.predictedClv)}</span>
      </TableCell>

      {/* Historical Revenue */}
      <TableCell className="px-2 sm:px-2.5 py-3 text-right font-mono font-medium tabular-nums text-muted-foreground">
        {formatCurrency(customer.historicalRevenue)}
      </TableCell>

      {/* Total Orders */}
      <TableCell className="px-2 sm:px-2.5 py-3 text-right font-mono tabular-nums text-muted-foreground">
        {formatNumber(customer.totalOrders)}
      </TableCell>

      {/* Average Order Value */}
      <TableCell className="px-2 sm:px-2.5 py-3 text-right font-mono tabular-nums text-foreground">
        {formatCurrency(customer.averageOrderValue)}
      </TableCell>

      {/* Last Purchase */}
      <TableCell className="px-2 sm:px-2.5 py-3 text-muted-foreground whitespace-nowrap text-[11px] font-mono">
        {formatDate(customer.lastPurchaseDate)}
      </TableCell>

      {/* Churn Risk */}
      <TableCell className="px-2 sm:px-2.5 py-3 whitespace-nowrap">
        {getRiskBadge(customer.churnRisk)}
      </TableCell>

      {/* Action / Detail Access */}
      <TableCell className="px-2 sm:px-2.5 py-3 text-right pr-3">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onSelectCustomer(customer)
          }}
          className="h-7 px-2 text-[11px] gap-1 cursor-pointer hover:bg-surface-elevated border-border"
          aria-label={`Inspect ${customer.name}`}
        >
          <span>View</span>
          <ExternalLink className="h-3 w-3 text-muted-foreground" />
        </Button>
      </TableCell>
    </TableRow>
  )
})

function CustomerTableComponent({
  customers,
  sortField,
  sortDirection,
  onSort,
  onSelectCustomer,
  onResetFilters,
  hasActiveFilters,
}: CustomerTableProps) {
  // Column sort button helper
  const renderSortableHeader = (
    field: CustomerSortField,
    label: string,
    alignRight: boolean = false,
  ) => {
    const isSorted = sortField === field
    const ariaSortValue = isSorted ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'

    return (
      <TableHead
        scope="col"
        aria-sort={ariaSortValue}
        className={`px-2 sm:px-2.5 h-9 text-xs font-semibold ${
          alignRight ? 'text-right' : 'text-left'
        }`}
      >
        <button
          type="button"
          onClick={() => onSort(field)}
          className={`inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider hover:text-foreground transition-all duration-150 active:scale-95 cursor-pointer group outline-hidden focus-visible:ring-1 focus-visible:ring-ring rounded-xs px-1 py-0.5 -mx-1 select-none ${
            isSorted ? 'text-foreground font-semibold' : 'text-muted-foreground'
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

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return (
          <Badge variant="neutral" dot className="font-mono text-[10px]">
            LOW
          </Badge>
        )
      case 'moderate':
        return (
          <Badge variant="warning" dot className="font-mono text-[10px]">
            MODERATE
          </Badge>
        )
      case 'high':
      default:
        return (
          <Badge variant="destructive" dot className="font-mono text-[10px]">
            HIGH
          </Badge>
        )
    }
  }

  const getSegmentBadge = (segment: string) => {
    switch (segment) {
      case 'Enterprise':
        return 'border-foreground/30 bg-surface-elevated text-foreground font-semibold'
      case 'Mid-Market':
        return 'border-border bg-muted/60 text-foreground/90 font-medium'
      case 'Growth':
        return 'border-border bg-muted/40 text-muted-foreground font-medium'
      case 'Standard':
      default:
        return 'border-border/60 bg-muted/20 text-muted-foreground/80'
    }
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card shadow-xs">
      <div className="overflow-x-auto">
        <Table className="w-full text-xs">
          <TableHeader className="bg-surface-elevated/40">
            <TableRow className="hover:bg-transparent">
              {renderSortableHeader('name', 'Customer')}
              {renderSortableHeader('segment', 'Segment')}
              {renderSortableHeader('predictedClv', 'Predicted CLV', true)}
              {renderSortableHeader('historicalRevenue', 'Hist. Revenue', true)}
              {renderSortableHeader('totalOrders', 'Orders', true)}
              {renderSortableHeader('averageOrderValue', 'AOV', true)}
              {renderSortableHeader('lastPurchaseDate', 'Last Purchase')}
              {renderSortableHeader('churnRisk', 'Churn Risk')}
              <TableHead scope="col" className="text-right px-2 sm:px-2.5 pr-3">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Action
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
                    <Users className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm font-semibold text-foreground">
                      No customers match your criteria
                    </p>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      {hasActiveFilters
                        ? 'Try clearing your search query or loosening segment, risk, or CLV tier filters.'
                        : 'No accounts are available in this cohort.'}
                    </p>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onResetFilters}
                        className="mt-2 text-xs cursor-pointer border-border-strong"
                      >
                        Reset All Filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <CustomerTableRow
                  key={customer.id}
                  customer={customer}
                  onSelectCustomer={onSelectCustomer}
                  getSegmentBadge={getSegmentBadge}
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

export const CustomerTable = memo(CustomerTableComponent)
export default CustomerTable
