import { MOCK_CUSTOMERS } from '../customers/mockData'
import type { CustomerRecord, CustomerSegment } from '../customers/types'
import type { SegmentMetricRow, SegmentationSummary, SegmentAnalyticsDataset } from './types'

export const SEGMENT_DEFINITIONS: Record<
  CustomerSegment,
  {
    label: string
    description: string
    strategicFocus: string
    defaultStatus: 'expanding' | 'stable' | 'at-risk'
  }
> = {
  Enterprise: {
    label: 'Enterprise Tier',
    description:
      'High-contract, high-volume strategic accounts with sustained multi-quarter engagement and maximum lifetime value.',
    strategicFocus:
      'Executive relationship management, white-glove onboarding, multi-seat expansion, and zero-churn SLA compliance.',
    defaultStatus: 'expanding',
  },
  'Mid-Market': {
    label: 'Mid-Market Tier',
    description:
      'Established recurring revenue accounts with regular purchasing cadence and significant expansion runway.',
    strategicFocus:
      'Cross-selling higher-tier feature modules, automated renewal workflows, and usage-driven upsell.',
    defaultStatus: 'expanding',
  },
  Growth: {
    label: 'Growth Tier',
    description:
      'Emerging accounts exhibiting rising purchase frequency and product adoption, with moderate lifetime value potential.',
    strategicFocus:
      'Activation milestones, feature adoption drip campaigns, and conversion to recurring annual commitments.',
    defaultStatus: 'stable',
  },
  Standard: {
    label: 'Standard Tier',
    description:
      'Entry-level and transactional accounts characterized by lower basket sizes, sporadic reorders, and elevated churn risk.',
    strategicFocus:
      'Self-serve support efficiencies, programmatic re-engagement incentives, and reactivation triggers.',
    defaultStatus: 'at-risk',
  },
}

export const ORDERED_SEGMENTS: CustomerSegment[] = [
  'Enterprise',
  'Mid-Market',
  'Growth',
  'Standard',
]

/**
 * Deterministically computes comprehensive segmentation metrics from the customer dataset.
 * Guarantees mathematical consistency across all cards, charts, and tables.
 */
export function calculateSegmentAnalytics(
  customers: CustomerRecord[] = MOCK_CUSTOMERS,
): SegmentAnalyticsDataset {
  const totalCustomers = customers.length
  const totalRevenue = customers.reduce((sum, c) => sum + c.historicalRevenue, 0)
  const totalClv = customers.reduce((sum, c) => sum + c.predictedClv, 0)
  const averageClv = totalCustomers > 0 ? Math.round(totalClv / totalCustomers) : 0

  const segmentRows: SegmentMetricRow[] = ORDERED_SEGMENTS.map((segName) => {
    const segCustomers = customers.filter((c) => c.segment === segName)
    const count = segCustomers.length
    const customerShare =
      totalCustomers > 0 ? Number(((count / totalCustomers) * 100).toFixed(1)) : 0

    const segRev = segCustomers.reduce((sum, c) => sum + c.historicalRevenue, 0)
    const segClv = segCustomers.reduce((sum, c) => sum + c.predictedClv, 0)
    const segOrders = segCustomers.reduce((sum, c) => sum + c.totalOrders, 0)

    const avgRev = count > 0 ? Math.round(segRev / count) : 0
    const avgClv = count > 0 ? Math.round(segClv / count) : 0
    const revenueShare = totalRevenue > 0 ? Number(((segRev / totalRevenue) * 100).toFixed(1)) : 0
    const clvShare = totalClv > 0 ? Number(((segClv / totalClv) * 100).toFixed(1)) : 0

    const averageOrders = count > 0 ? Number((segOrders / count).toFixed(1)) : 0
    const averageOrderValue = segOrders > 0 ? Number((segRev / segOrders).toFixed(2)) : 0

    const lowRisk = segCustomers.filter((c) => c.churnRisk === 'low').length
    const modRisk = segCustomers.filter((c) => c.churnRisk === 'moderate').length
    const highRisk = segCustomers.filter((c) => c.churnRisk === 'high').length
    const highRiskPercentage = count > 0 ? Number(((highRisk / count) * 100).toFixed(1)) : 0

    const avgChurnProb =
      count > 0
        ? Number((segCustomers.reduce((sum, c) => sum + c.churnProbability, 0) / count).toFixed(2))
        : 0

    const meta = SEGMENT_DEFINITIONS[segName]

    return {
      id: segName,
      name: segName,
      label: meta.label,
      description: meta.description,
      strategicFocus: meta.strategicFocus,
      customerCount: count,
      customerShare,
      totalClv: segClv,
      averageClv: avgClv,
      clvShare,
      totalHistoricalRevenue: segRev,
      averageHistoricalRevenue: avgRev,
      revenueShare,
      totalOrders: segOrders,
      averageOrders,
      averageOrderValue,
      churnRiskDistribution: {
        low: lowRisk,
        moderate: modRisk,
        high: highRisk,
      },
      highRiskCount: highRisk,
      highRiskPercentage,
      averageChurnProbability: avgChurnProb,
      status: meta.defaultStatus,
    }
  })

  // Derive Summary KPIs
  const sortedByCount = [...segmentRows].sort((a, b) => b.customerCount - a.customerCount)
  const largestSegment = {
    name: sortedByCount[0]?.name ?? 'Standard',
    count: sortedByCount[0]?.customerCount ?? 0,
    share: sortedByCount[0]?.customerShare ?? 0,
  }

  const sortedByClv = [...segmentRows].sort((a, b) => b.averageClv - a.averageClv)
  const highestValueSegment = {
    name: sortedByClv[0]?.name ?? 'Enterprise',
    totalClv: sortedByClv[0]?.totalClv ?? 0,
    avgClv: sortedByClv[0]?.averageClv ?? 0,
    revenueShare: sortedByClv[0]?.revenueShare ?? 0,
  }

  const sortedByAov = [...segmentRows].sort((a, b) => b.averageOrderValue - a.averageOrderValue)
  const highestAovSegment = {
    name: sortedByAov[0]?.name ?? 'Enterprise',
    aov: sortedByAov[0]?.averageOrderValue ?? 0,
  }

  const totalHighRisk = segmentRows.reduce((sum, seg) => sum + seg.churnRiskDistribution.high, 0)
  const highRiskPercentage =
    totalCustomers > 0 ? Number(((totalHighRisk / totalCustomers) * 100).toFixed(1)) : 0

  const sortedByHighRiskCount = [...segmentRows].sort(
    (a, b) => b.churnRiskDistribution.high - a.churnRiskDistribution.high,
  )
  const mostVulnerableSegment = sortedByHighRiskCount[0]?.name ?? 'Standard'

  const summary: SegmentationSummary = {
    totalSegments: segmentRows.length,
    totalCustomers,
    totalRevenue,
    totalClv,
    averageClv,
    largestSegment,
    highestValueSegment,
    highRiskSummary: {
      count: totalHighRisk,
      percentage: highRiskPercentage,
      mostVulnerableSegment,
    },
    highestAovSegment,
  }

  return {
    segments: segmentRows,
    summary,
    customers,
  }
}
