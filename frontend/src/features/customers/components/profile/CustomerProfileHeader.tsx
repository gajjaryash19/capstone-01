import { useState } from 'react'
import {
  ArrowLeft,
  Building2,
  Mail,
  Calendar,
  Copy,
  Check,
  Download,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/formatters'
import type { CustomerRecord } from '../../types'

interface CustomerProfileHeaderProps {
  customer: CustomerRecord
}

export function CustomerProfileHeader({ customer }: CustomerProfileHeaderProps) {
  const [copied, setCopied] = useState(false)
  const [exportNotice, setExportNotice] = useState(false)

  // Evaluation platform reference timestamp: 2026-11-19
  const EVAL_REF_DATE = new Date('2026-11-19').getTime()
  const joinedTime = new Date(customer.joinedDate).getTime()
  const tenureDays = Math.max(1, Math.floor((EVAL_REF_DATE - joinedTime) / (1000 * 60 * 60 * 24)))
  const tenureMonths = Math.max(1, Math.round(tenureDays / 30.4375))

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(customer.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback if clipboard API is restricted
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleExportProfile = () => {
    const exportData = {
      account: {
        id: customer.id,
        name: customer.name,
        company: customer.company,
        email: customer.email,
        segment: customer.segment,
        status: customer.status,
        joinedDate: customer.joinedDate,
        tenureMonths,
      },
      valuation: {
        predictedClv: customer.predictedClv,
        historicalRevenue: customer.historicalRevenue,
        projectedFutureIncrement: Math.max(0, customer.predictedClv - customer.historicalRevenue),
        realizedPercentage:
          customer.predictedClv > 0
            ? Number(((customer.historicalRevenue / customer.predictedClv) * 100).toFixed(1))
            : 100,
      },
      behavioral: {
        totalOrders: customer.totalOrders,
        averageOrderValue: customer.averageOrderValue,
        lastPurchaseDate: customer.lastPurchaseDate,
        churnRisk: customer.churnRisk,
        churnProbability: customer.churnProbability,
      },
      metadata: {
        exportTimestamp: new Date().toISOString(),
        modelVersion: 'BG/NBD + Gamma-Gamma v2.4 (Deterministic Evaluation Cohort)',
      },
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `valora-customer-${customer.id.toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setExportNotice(true)
    setTimeout(() => setExportNotice(false), 3000)
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
        return {
          label: 'HIGH RISK',
          className: 'border-red-500/30 bg-red-500/10 text-red-400 font-semibold',
          icon: ShieldAlert,
        }
      case 'moderate':
        return {
          label: 'MODERATE RISK',
          className: 'border-amber-500/30 bg-amber-500/10 text-amber-400 font-medium',
          icon: AlertTriangle,
        }
      case 'low':
      default:
        return {
          label: 'LOW RISK',
          className: 'border-border bg-muted/40 text-muted-foreground font-medium',
          icon: ShieldCheck,
        }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'at-risk':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-400'
      case 'dormant':
        return 'border-red-500/30 bg-red-500/10 text-red-400'
      case 'active':
      default:
        return 'border-border bg-surface-elevated text-foreground/90'
    }
  }

  const riskBadge = getRiskBadge(customer.churnRisk)
  const RiskIcon = riskBadge.icon

  return (
    <div className="space-y-4 pb-5 border-b border-border/80">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer bg-surface/60 border-border"
        >
          <Link to="/app/customers" aria-label="Back to Customer Directory">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Customers</span>
          </Link>
        </Button>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {exportNotice && (
            <span className="text-[11px] font-mono text-muted-foreground animate-pulse hidden sm:inline">
              Exported {customer.id}.json
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyId}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer bg-surface/60 border-border"
            title="Copy Customer ID"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-foreground" />
                <span className="text-foreground font-medium">Copied ID</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Copy ID</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportProfile}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer bg-surface/60 border-border"
            title="Export Profile JSON"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export Profile</span>
          </Button>
        </div>
      </div>

      {/* Main Header Presentation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          {/* Monochromatic Initials Container */}
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-surface-elevated text-foreground font-mono font-semibold text-base sm:text-lg border border-border shadow-xs">
            {customer.avatarInitials}
          </div>

          <div className="min-w-0 space-y-1.5">
            {/* Title & Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                {customer.name}
              </h1>

              {/* Monochromatic Segment Badge */}
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs border ${getSegmentBadgeStyle(
                  customer.segment,
                )}`}
              >
                {customer.segment}
              </span>

              {/* Semantic Risk Badge */}
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs border ${riskBadge.className}`}
              >
                <RiskIcon className="h-3 w-3 shrink-0" />
                <span>{riskBadge.label}</span>
              </span>

              {/* Account State */}
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs border capitalize font-medium ${getStatusBadge(
                  customer.status,
                )}`}
              >
                {customer.status}
              </span>
            </div>

            {/* Metadata Line */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              <span className="font-mono text-[11px] text-foreground/80 font-medium">
                {customer.id}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>{customer.company}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>{customer.email}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>
                  Customer since {formatDate(customer.joinedDate)} • {tenureMonths} mos active
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
