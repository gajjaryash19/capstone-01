export type TimeHorizon = '30d' | '90d' | '12m' | 'all'
export type SegmentFilter = 'all' | 'enterprise' | 'mid-market' | 'growth'

export interface OverviewKpi {
  id: string
  title: string
  value: string
  numericValue: number
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  period: string
  secondaryContext: string
  icon: 'clv' | 'revenue' | 'retention' | 'risk'
}

export interface ClvTrajectoryPoint {
  month: string
  observedClv: number | null
  predictedClv: number
  confidenceLow?: number
  confidenceHigh?: number
}

export interface ValueTierDistribution {
  tier: string
  label: string
  customerShare: number
  revenueShare: number
  customerCount: number
  totalRevenue: number
  avgClv: number
}

export interface SegmentHealthRow {
  id: string
  name: string
  tier: string
  customerCount: number
  averageSpend: number
  retentionRate: number
  churnRisk: 'low' | 'moderate' | 'high'
  clvGrowth: string
  status: 'expanding' | 'stable' | 'at-risk'
}

export interface ActionableInsight {
  id: string
  type: 'opportunity' | 'risk' | 'optimization'
  severity: 'critical' | 'elevated' | 'positive'
  title: string
  description: string
  impactEstimate: string
  recommendedAction: string
  cohortTarget: string
}

export interface ClvOverviewDataset {
  kpis: OverviewKpi[]
  trajectory: ClvTrajectoryPoint[]
  tierDistribution: ValueTierDistribution[]
  segmentHealth: SegmentHealthRow[]
  actionableInsights: ActionableInsight[]
  modelMetadata: {
    name: string
    version: string
    lastRunTimestamp: string
    trainingCohortSize: number
    mapeAccuracy: string
  }
}
