import type { CustomerRecord, CustomerSegment } from '../customers/types'

export type { CustomerSegment }

export interface EnrichedPredictionCustomer extends CustomerRecord {
  valueDelta: number // predictedClv - historicalRevenue
  valueDeltaPercent: number // ((predictedClv - historicalRevenue) / historicalRevenue) * 100
  predictionHorizon: string // e.g. '12 Months'
  isExpansion: boolean
}

export interface PredictionSummaryKpis {
  totalPredictedClv: number
  averagePredictedClv: number
  medianPredictedClv: number
  minPredictedClv: number
  maxPredictedClv: number
  totalCustomers: number
  totalHistoricalRevenue: number
  totalProjectedExpansion: number
  projectedExpansionPercent: number
  highValuePredictionCount: number // predictedClv >= 10000
}

export interface PredictionDistributionBin {
  id: string
  label: string
  shortLabel: string
  rangeDescription: string
  min: number
  max: number
  customerCount: number
  customerShare: number // percentage (0 - 100)
  totalClv: number
  clvShare: number // percentage (0 - 100)
  avgClv: number
}

export interface PredictionSegmentBreakdown {
  segment: CustomerSegment
  label: string
  customerCount: number
  customerShare: number
  totalClv: number
  clvShare: number
  avgClv: number
  historicalRevenue: number
  projectedExpansion: number
  expansionPercent: number
}

export interface ModelMetadata {
  modelName: string
  version: string
  framework: string
  horizon: string
  trainingCohortSize: number
  lastRunDate: string
  evaluationStatus: 'pending' | 'evaluated'
  statusLabel: string
  description: string
  holdoutWindow: string
}

export type PredictionTierFilter = 'all' | 'high' | 'mid' | 'standard'
export type DeltaFilter = 'all' | 'expansion' | 'contraction'

export type PredictionSortField =
  'name' | 'segment' | 'predictedClv' | 'historicalRevenue' | 'valueDelta' | 'churnProbability'

export type SortDirection = 'asc' | 'desc'

export interface PredictionFilterParams {
  searchQuery: string
  segment: 'all' | CustomerSegment
  tier: PredictionTierFilter
  delta: DeltaFilter
  sortField: PredictionSortField
  sortDirection: SortDirection
  page: number
  pageSize: number
}
