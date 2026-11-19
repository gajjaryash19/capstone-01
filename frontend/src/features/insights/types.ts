import type { CustomerRecord, CustomerSegment } from '../customers/types'

export type InsightCategory = 'all' | 'retention' | 'segment' | 'growth' | 'efficiency'

export type InsightPriority = 'all' | 'high' | 'medium' | 'low'

export type InsightSegmentFilter = 'all' | CustomerSegment

export interface InsightMetric {
  label: string
  value: string
  hint?: string
}

export interface BusinessInsight {
  id: string
  title: string
  category: 'retention' | 'segment' | 'growth' | 'efficiency'
  priority: 'high' | 'medium' | 'low'
  segment: CustomerSegment | 'All Segments'
  supportingObservation: string
  metrics: InsightMetric[]
  businessImplication: string
  suggestedAction: string
  actionLabel: string
  actionHref: string
  ruleId: string
  ruleName: string
  ruleFormula: string
  impactEstimate: string
  impactNumeric: number
  affectedCustomerIds: string[]
  generationType: 'rule-based'
}

export interface ActionRecommendation {
  id: string
  title: string
  category: 'retention' | 'loyalty' | 'growth' | 'efficiency'
  priority: 'high' | 'medium' | 'low'
  targetAudience: string
  dataTrigger: string
  impactEstimate: string
  actionLabel: string
  actionHref: string
  tactics: string[]
  ruleReference: string
  affectedSegment?: CustomerSegment | 'All Segments'
}

export interface InsightKpiSummary {
  totalInsights: number
  highPriorityCount: number
  totalAtRiskClv: number
  projectedExpansionClv: number
  enterpriseClvConcentration: number
}

export interface SegmentValueComparisonItem {
  segment: CustomerSegment
  accountCount: number
  customerShare: number
  totalClv: number
  clvShare: number
  historicalRevenue: number
  revenueShare: number
  averageClv: number
  highRiskCount: number
}

export interface HighValueRiskAccount {
  customer: CustomerRecord
  exposureShareOfCohort: number
  churnProbability: number
  daysSinceLastPurchase: number
}

export interface SegmentOutperformerAccount {
  customer: CustomerRecord
  segmentAverageClv: number
  outperformancePercent: number
}

export interface LowValueDormantAccount {
  customer: CustomerRecord
  status: string
  churnProbability: number
}

export interface RetentionOpportunitiesDataset {
  highValueAtRisk: HighValueRiskAccount[]
  totalAtRiskClv: number
  outperformers: SegmentOutperformerAccount[]
  dormantAccounts: LowValueDormantAccount[]
}

export interface InsightFilterParams {
  category: InsightCategory
  priority: InsightPriority
  segment: InsightSegmentFilter
  searchQuery: string
}
