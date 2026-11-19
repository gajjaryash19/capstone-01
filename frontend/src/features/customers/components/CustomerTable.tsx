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

export function CustomerTable({
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
    <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card shadow-2xs">
      <div className="overflow-x-auto">
        <Table className="w-full text-xs">
          <TableHeader className="bg-muted/30">
            <TableRow>
              {renderSortableHeader('name', 'Customer')}
              {renderSortableHeader('segment', 'Segment')}
              {renderSortableHeader('predictedClv', 'Predicted CLV', true)}
              {renderSortableHeader('historicalRevenue', 'Hist. Revenue', true)}
              {renderSortableHeader('totalOrders', 'Orders', true)}
              {renderSortableHeader('averageOrderValue', 'AOV', true)}
              {renderSortableHeader('lastPurchaseDate', 'Last Purchase')}
              {renderSortableHeader('churnRisk', 'Churn Risk')}
              <TableHead scope="col" className="text-right px-2.5 sm:px-3 pr-3 sm:pr-4">
                <span className="sr-only">Actions</span>
                <span className="text-xs font-semibold text-muted-foreground">Action</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 py-6 text-muted-foreground">
                    <Users className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm font-medium text-foreground">
                      No customers match your criteria
                    </p>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      {hasActiveFilters
                        ? 'Try loosening your search query, segment, risk, or CLV tier filters.'
                        : 'No accounts are available in this cohort.'}
                    </p>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onResetFilters}
                        className="mt-2 text-xs cursor-pointer"
                      >
                        Reset All Filters
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
                  className="cursor-pointer transition-colors hover:bg-muted/50 group"
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
                  {/* Customer: Name, ID, Avatar & Company */}
                  <TableCell className="px-2.5 sm:px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/70 text-primary font-semibold text-xs border border-primary/20">
                        {customer.avatarInitials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground truncate group-hover:text-primary transition-colors flex items-center gap-1.5">
                          <span>{customer.name}</span>
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

                  {/* Predicted CLV */}
                  <TableCell className="px-2.5 sm:px-3 py-2.5 text-right font-bold tabular-nums text-foreground">
                    <span className="text-primary font-semibold">
                      {formatCurrency(customer.predictedClv)}
                    </span>
                  </TableCell>

                  {/* Historical Revenue */}
                  <TableCell className="px-2.5 sm:px-3 py-2.5 text-right font-medium tabular-nums text-foreground">
                    {formatCurrency(customer.historicalRevenue)}
                  </TableCell>

                  {/* Total Orders */}
                  <TableCell className="px-2.5 sm:px-3 py-2.5 text-right tabular-nums text-muted-foreground">
                    {formatNumber(customer.totalOrders)}
                  </TableCell>

                  {/* Average Order Value */}
                  <TableCell className="px-2.5 sm:px-3 py-2.5 text-right tabular-nums text-foreground">
                    {formatCurrency(customer.averageOrderValue)}
                  </TableCell>

                  {/* Last Purchase */}
                  <TableCell className="px-2.5 sm:px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                    {formatDate(customer.lastPurchaseDate)}
                  </TableCell>

                  {/* Churn Risk */}
                  <TableCell className="px-2.5 sm:px-3 py-2.5">
                    <Badge variant={getRiskVariant(customer.churnRisk)} dot>
                      {customer.churnRisk.toUpperCase()}
                    </Badge>
                  </TableCell>

                  {/* Action / Detail Access */}
                  <TableCell className="px-2.5 sm:px-3 py-2.5 text-right pr-3 sm:pr-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectCustomer(customer)
                      }}
                      className="h-7 px-2 text-[11px] gap-1 cursor-pointer hover:bg-card"
                      aria-label={`Inspect ${customer.name}`}
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
