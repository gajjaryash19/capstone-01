import { ArrowLeft, Building2, Mail, Hash } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { CustomerRecord } from '../../types'

interface CustomerProfileHeaderProps {
  customer: CustomerRecord
}

export function CustomerProfileHeader({ customer }: CustomerProfileHeaderProps) {
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success' as const
      case 'at-risk':
        return 'warning' as const
      case 'dormant':
      default:
        return 'destructive' as const
    }
  }

  return (
    <div className="space-y-3 pb-4 sm:pb-5 border-b border-border/80">
      {/* Back to Directory Link */}
      <div>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <Link to="/customers" aria-label="Back to Customer Directory">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Customers</span>
          </Link>
        </Button>
      </div>

      {/* Main Header Card / Flex Container */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-accent/70 text-primary font-bold text-base sm:text-lg border border-primary/20 shadow-2xs">
            {customer.avatarInitials}
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                {customer.name}
              </h1>
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border ${getSegmentVariant(
                  customer.segment,
                )}`}
              >
                {customer.segment}
              </span>
              <Badge variant={getRiskVariant(customer.churnRisk)} dot className="text-xs">
                {customer.churnRisk.toUpperCase()} RISK
              </Badge>
              <Badge variant={getStatusVariant(customer.status)} className="capitalize text-xs">
                {customer.status}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-mono text-[11px] text-foreground/80">
                <Hash className="h-3 w-3 text-muted-foreground" />
                {customer.id}
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                {customer.company}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                {customer.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
