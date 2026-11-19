import type { CustomerRecord, CustomerSegment } from '../customers/types'

export type { CustomerSegment }

export interface SegmentRiskBreakdown {
  low: number
  moderate: number
  high: number
}

export interface SegmentMetricRow {
  id: CustomerSegment
  name: CustomerSegment
  label: string
  description: string
  strategicFocus: string
  customerCount: number
  customerShare: number // percentage (0-100)
  totalClv: number
  averageClv: number
  clvShare: number // percentage (0-100)
  totalHistoricalRevenue: number
  averageHistoricalRevenue: number
  revenueShare: number // percentage (0-100)
  totalOrders: number
  averageOrders: number
  averageOrderValue: number
  churnRiskDistribution: SegmentRiskBreakdown
  highRiskCount: number
  highRiskPercentage: number
  averageChurnProbability: number
  status: 'expanding' | 'stable' | 'at-risk'
}

export interface SegmentationSummary {
  totalSegments: number
  totalCustomers: number
  totalRevenue: number
  totalClv: number
  averageClv: number
  largestSegment: {
    name: CustomerSegment
    count: number
    share: number
  }
  highestValueSegment: {
    name: CustomerSegment
    totalClv: number
    avgClv: number
    revenueShare: number
  }
  highRiskSummary: {
    count: number
    percentage: number
    mostVulnerableSegment: CustomerSegment
  }
  highestAovSegment: {
    name: CustomerSegment
    aov: number
  }
}

export interface SegmentAnalyticsDataset {
  segments: SegmentMetricRow[]
  summary: SegmentationSummary
  customers: CustomerRecord[]
}
