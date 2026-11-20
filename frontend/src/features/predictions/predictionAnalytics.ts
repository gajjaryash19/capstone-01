import { MOCK_CUSTOMERS } from '../customers/mockData'
import type { CustomerRecord, CustomerSegment } from '../customers/types'
import type {
  EnrichedPredictionCustomer,
  PredictionSummaryKpis,
  PredictionDistributionBin,
  PredictionSegmentBreakdown,
  ModelMetadata,
} from './types'

export const DEFAULT_PREDICTION_HORIZON = '12 Months'

export const MODEL_METADATA: ModelMetadata = {
  modelName: 'BG/NBD + Gamma-Gamma Probabilistic Pipeline',
  version: 'v1.4-beta (Evaluation Baseline)',
  framework: 'Lifetimes / Probabilistic Modeling',
  horizon: '12 Months Forward',
  trainingCohortSize: 36,
  lastRunDate: '2026-11-19',
  evaluationStatus: 'pending',
  statusLabel: 'Backtest Validation Pending',
  description:
    'Probabilistic forecasting model estimating transaction cadence (BG/NBD) and expected monetary order value (Gamma-Gamma).',
  holdoutWindow: '12-Month Out-of-Sample Holdout Cohort',
}

/**
 * Enriches customer records with calculated prediction deltas and horizon metadata.
 */
export function enrichCustomerPredictions(
  customers: CustomerRecord[] = MOCK_CUSTOMERS,
): EnrichedPredictionCustomer[] {
  return customers.map((c) => {
    const valueDelta = c.predictedClv - c.historicalRevenue
    const valueDeltaPercent =
      c.historicalRevenue > 0 ? Number(((valueDelta / c.historicalRevenue) * 100).toFixed(1)) : 0

    return {
      ...c,
      valueDelta,
      valueDeltaPercent,
      predictionHorizon: DEFAULT_PREDICTION_HORIZON,
      isExpansion: valueDelta >= 0,
    }
  })
}

/**
 * Deterministically computes summary KPIs for the prediction cohort.
 * Guarantees mathematical reconciliation with individual customer records.
 */
export function calculatePredictionSummary(
  customers: CustomerRecord[] = MOCK_CUSTOMERS,
): PredictionSummaryKpis {
  const totalCustomers = customers.length
  if (totalCustomers === 0) {
    return {
      totalPredictedClv: 0,
      averagePredictedClv: 0,
      medianPredictedClv: 0,
      minPredictedClv: 0,
      maxPredictedClv: 0,
      totalCustomers: 0,
      totalHistoricalRevenue: 0,
      totalProjectedExpansion: 0,
      projectedExpansionPercent: 0,
      highValuePredictionCount: 0,
    }
  }

  const totalPredictedClv = customers.reduce((sum, c) => sum + c.predictedClv, 0)
  const averagePredictedClv = Math.round(totalPredictedClv / totalCustomers)
  const totalHistoricalRevenue = customers.reduce((sum, c) => sum + c.historicalRevenue, 0)
  const totalProjectedExpansion = totalPredictedClv - totalHistoricalRevenue
  const projectedExpansionPercent =
    totalHistoricalRevenue > 0
      ? Number(((totalProjectedExpansion / totalHistoricalRevenue) * 100).toFixed(1))
      : 0
  const highValuePredictionCount = customers.filter((c) => c.predictedClv >= 10000).length

  // Calculate exact median, min, max
  const sortedClv = [...customers].map((c) => c.predictedClv).sort((a, b) => a - b)
  const minPredictedClv = sortedClv[0]
  const maxPredictedClv = sortedClv[sortedClv.length - 1]
  const mid = Math.floor(sortedClv.length / 2)
  const medianPredictedClv =
    sortedClv.length % 2 !== 0
      ? sortedClv[mid]
      : Math.round((sortedClv[mid - 1] + sortedClv[mid]) / 2)

  return {
    totalPredictedClv,
    averagePredictedClv,
    medianPredictedClv,
    minPredictedClv,
    maxPredictedClv,
    totalCustomers,
    totalHistoricalRevenue,
    totalProjectedExpansion,
    projectedExpansionPercent,
    highValuePredictionCount,
  }
}

interface BinConfig {
  id: string
  label: string
  shortLabel: string
  rangeDescription: string
  min: number
  max: number
}

const DISTRIBUTION_BINS: BinConfig[] = [
  {
    id: 'bin-under-1k',
    label: '$0 – $999',
    shortLabel: '<$1k',
    rangeDescription: 'Micro & transactional spend accounts',
    min: 0,
    max: 999.99,
  },
  {
    id: 'bin-1k-2.5k',
    label: '$1,000 – $2,499',
    shortLabel: '$1k–$2.5k',
    rangeDescription: 'Standard baseline accounts',
    min: 1000,
    max: 2499.99,
  },
  {
    id: 'bin-2.5k-5k',
    label: '$2,500 – $4,999',
    shortLabel: '$2.5k–$5k',
    rangeDescription: 'Emerging growth tier accounts',
    min: 2500,
    max: 4999.99,
  },
  {
    id: 'bin-5k-10k',
    label: '$5,000 – $9,999',
    shortLabel: '$5k–$10k',
    rangeDescription: 'Established mid-market accounts',
    min: 5000,
    max: 9999.99,
  },
  {
    id: 'bin-10k-20k',
    label: '$10,000 – $19,999',
    shortLabel: '$10k–$20k',
    rangeDescription: 'High-value enterprise accounts',
    min: 10000,
    max: 19999.99,
  },
  {
    id: 'bin-over-20k',
    label: '≥ $20,000',
    shortLabel: '$20k+',
    rangeDescription: 'Strategic enterprise champions',
    min: 20000,
    max: Infinity,
  },
]

/**
 * Deterministically buckets customers into standard CLV prediction intervals.
 * Guarantees that the sum of bins equals the exact cohort customer and value totals.
 */
export function calculatePredictionDistribution(
  customers: CustomerRecord[] = MOCK_CUSTOMERS,
): PredictionDistributionBin[] {
  const totalCustomers = customers.length
  let totalCohortClv = 0

  const binAcc = DISTRIBUTION_BINS.map(() => ({ count: 0, totalClv: 0 }))

  for (let i = 0; i < totalCustomers; i++) {
    const clv = customers[i].predictedClv
    totalCohortClv += clv
    for (let b = 0; b < DISTRIBUTION_BINS.length; b++) {
      if (clv >= DISTRIBUTION_BINS[b].min && clv <= DISTRIBUTION_BINS[b].max) {
        binAcc[b].count++
        binAcc[b].totalClv += clv
        break
      }
    }
  }

  return DISTRIBUTION_BINS.map((bin, index) => {
    const customerCount = binAcc[index].count
    const customerShare =
      totalCustomers > 0 ? Number(((customerCount / totalCustomers) * 100).toFixed(1)) : 0
    const totalClv = binAcc[index].totalClv
    const clvShare = totalCohortClv > 0 ? Number(((totalClv / totalCohortClv) * 100).toFixed(1)) : 0
    const avgClv = customerCount > 0 ? Math.round(totalClv / customerCount) : 0

    return {
      id: bin.id,
      label: bin.label,
      shortLabel: bin.shortLabel,
      rangeDescription: bin.rangeDescription,
      min: bin.min,
      max: bin.max,
      customerCount,
      customerShare,
      totalClv,
      clvShare,
      avgClv,
    }
  })
}

const ORDERED_SEGMENTS: CustomerSegment[] = ['Enterprise', 'Mid-Market', 'Growth', 'Standard']

/**
 * Computes prediction breakdown grouped by customer segment.
 */
export function calculateSegmentPredictionBreakdown(
  customers: CustomerRecord[] = MOCK_CUSTOMERS,
): PredictionSegmentBreakdown[] {
  const totalCustomers = customers.length
  let totalCohortClv = 0

  const segAcc: Record<CustomerSegment, { count: number; totalClv: number; histRev: number }> = {
    Enterprise: { count: 0, totalClv: 0, histRev: 0 },
    'Mid-Market': { count: 0, totalClv: 0, histRev: 0 },
    Growth: { count: 0, totalClv: 0, histRev: 0 },
    Standard: { count: 0, totalClv: 0, histRev: 0 },
  }

  for (let i = 0; i < totalCustomers; i++) {
    const c = customers[i]
    totalCohortClv += c.predictedClv
    const acc = segAcc[c.segment]
    if (acc) {
      acc.count++
      acc.totalClv += c.predictedClv
      acc.histRev += c.historicalRevenue
    }
  }

  return ORDERED_SEGMENTS.map((segment) => {
    const acc = segAcc[segment]
    const count = acc.count
    const customerShare =
      totalCustomers > 0 ? Number(((count / totalCustomers) * 100).toFixed(1)) : 0
    const totalClv = acc.totalClv
    const clvShare = totalCohortClv > 0 ? Number(((totalClv / totalCohortClv) * 100).toFixed(1)) : 0
    const avgClv = count > 0 ? Math.round(totalClv / count) : 0
    const historicalRevenue = acc.histRev
    const projectedExpansion = totalClv - historicalRevenue
    const expansionPercent =
      historicalRevenue > 0
        ? Number(((projectedExpansion / historicalRevenue) * 100).toFixed(1))
        : 0

    return {
      segment,
      label: `${segment} Tier`,
      customerCount: count,
      customerShare,
      totalClv,
      clvShare,
      avgClv,
      historicalRevenue,
      projectedExpansion,
      expansionPercent,
    }
  })
}
