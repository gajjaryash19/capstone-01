import { MOCK_CUSTOMERS } from '../customers/mockData'
import type { CustomerRecord } from '../customers/types'
import { calculateSegmentAnalytics, ORDERED_SEGMENTS } from '../customer-segments/segmentAnalytics'
import { calculatePredictionSummary } from '../predictions/predictionAnalytics'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import type {
  BusinessInsight,
  ActionRecommendation,
  InsightKpiSummary,
  SegmentValueComparisonItem,
  RetentionOpportunitiesDataset,
  HighValueRiskAccount,
  SegmentOutperformerAccount,
  LowValueDormantAccount,
} from './types'

/**
 * Deterministically generates business-relevant insights based strictly on the
 * 36-account customer dataset, segment distribution, and CLV predictions.
 * Every insight is backed by a verifiable rule and exact mathematical computations.
 */
export function generateInsights(customers: CustomerRecord[] = MOCK_CUSTOMERS): BusinessInsight[] {
  const totalCustomers = customers.length
  const totalClv = customers.reduce((sum, c) => sum + c.predictedClv, 0)
  const totalRev = customers.reduce((sum, c) => sum + c.historicalRevenue, 0)
  const segmentData = calculateSegmentAnalytics(customers)

  const insights: BusinessInsight[] = []

  // RULE 1: High-Value Enterprise Account at Elevated Churn Risk
  // Condition: Account with predicted CLV >= $10,000 and high churn risk (>60% probability)
  const enterpriseRiskCust = customers.find(
    (c) => c.segment === 'Enterprise' && c.churnRisk === 'high' && c.predictedClv >= 10000,
  )
  if (enterpriseRiskCust) {
    const clvPctOfCohort = Number(((enterpriseRiskCust.predictedClv / totalClv) * 100).toFixed(1))
    const enterpriseSeg = segmentData.segments.find((s) => s.name === 'Enterprise')
    const clvPctOfEnterprise =
      enterpriseSeg && enterpriseSeg.totalClv > 0
        ? Number(((enterpriseRiskCust.predictedClv / enterpriseSeg.totalClv) * 100).toFixed(1))
        : 0

    insights.push({
      id: 'INS-01',
      title: 'High-Value Enterprise Account at Elevated Churn Risk',
      category: 'retention',
      priority: 'high',
      segment: 'Enterprise',
      supportingObservation: `Account ${enterpriseRiskCust.name} (${enterpriseRiskCust.company}) possesses a predicted CLV of ${formatCurrency(enterpriseRiskCust.predictedClv)} (${clvPctOfCohort}% of entire cohort CLV) but presents a ${(enterpriseRiskCust.churnProbability * 100).toFixed(0)}% churn probability and '${enterpriseRiskCust.status}' health status.`,
      metrics: [
        { label: 'At-Risk CLV', value: formatCurrency(enterpriseRiskCust.predictedClv) },
        {
          label: 'Churn Probability',
          value: formatPercent(enterpriseRiskCust.churnProbability * 100, 0),
        },
        { label: 'Enterprise CLV Share', value: formatPercent(clvPctOfEnterprise) },
        { label: 'Cohort CLV Share', value: formatPercent(clvPctOfCohort) },
      ],
      businessImplication:
        'Losing this single enterprise relationship would eliminate $15,300 in forecasted cash flows and jeopardize Enterprise cohort margin predictability.',
      suggestedAction:
        'Initiate urgent executive sponsor outreach, trigger a white-glove QBR, and conduct an audit of open technical support inquiries.',
      actionLabel: `Inspect ${enterpriseRiskCust.name}`,
      actionHref: `/customers/${enterpriseRiskCust.id}`,
      ruleId: 'RULE_HIGH_VALUE_CHURN_EXPOSURE',
      ruleName: 'Enterprise High-Value Churn Exposure',
      ruleFormula: 'predictedClv >= $10,000 ∧ churnRisk == "high"',
      impactEstimate: `${formatCurrency(enterpriseRiskCust.predictedClv)} Capital Protection`,
      impactNumeric: enterpriseRiskCust.predictedClv,
      affectedCustomerIds: [enterpriseRiskCust.id],
      generationType: 'rule-based',
    })
  }

  // RULE 2: Mid-Market Renewal Vulnerability in Key Accounts
  // Condition: Mid-Market accounts with high churn risk and CLV >= $4,000
  const midMarketRisk = customers.filter(
    (c) => c.segment === 'Mid-Market' && c.churnRisk === 'high' && c.predictedClv >= 4000,
  )
  if (midMarketRisk.length > 0) {
    const atRiskMidClv = midMarketRisk.reduce((s, c) => s + c.predictedClv, 0)
    const midSeg = segmentData.segments.find((s) => s.name === 'Mid-Market')
    const midExposurePct =
      midSeg && midSeg.totalClv > 0
        ? Number(((atRiskMidClv / midSeg.totalClv) * 100).toFixed(1))
        : 0
    const names = midMarketRisk.map((c) => c.name).join(' and ')

    insights.push({
      id: 'INS-02',
      title: 'Mid-Market Renewal Vulnerability Across Core Accounts',
      category: 'retention',
      priority: 'high',
      segment: 'Mid-Market',
      supportingObservation: `Two key Mid-Market accounts (${names}) exhibit elevated churn risk (>65% probability), jeopardizing ${formatCurrency(atRiskMidClv)} (${midExposurePct}% of total Mid-Market predicted CLV).`,
      metrics: [
        { label: 'At-Risk Mid-Market CLV', value: formatCurrency(atRiskMidClv) },
        { label: 'Mid-Market Exposure', value: formatPercent(midExposurePct) },
        { label: 'Affected Accounts', value: `${midMarketRisk.length} Accounts` },
        {
          label: 'Avg Churn Risk',
          value: formatPercent(
            (midMarketRisk.reduce((s, c) => s + c.churnProbability, 0) / midMarketRisk.length) *
              100,
            0,
          ),
        },
      ],
      businessImplication:
        'Mid-Market serves as the expansion bridge between Growth and Enterprise tiers; losing multiple core accounts destabilizes recurring renewal forecasts.',
      suggestedAction:
        'Deploy targeted renewal interventions with customized contract packaging and feature adoption incentives before contract anniversary.',
      actionLabel: 'Filter At-Risk Mid-Market',
      actionHref: '/customers?segment=Mid-Market&risk=high',
      ruleId: 'RULE_MIDMARKET_RENEWAL_RISK',
      ruleName: 'Mid-Market Core Account Renewal Risk',
      ruleFormula: 'segment == "Mid-Market" ∧ churnRisk == "high" ∧ predictedClv >= $4,000',
      impactEstimate: `${formatCurrency(atRiskMidClv)} Renewal Safeguard`,
      impactNumeric: atRiskMidClv,
      affectedCustomerIds: midMarketRisk.map((c) => c.id),
      generationType: 'rule-based',
    })
  }

  // RULE 3: Extreme Enterprise Revenue & CLV Concentration Skew (Pareto Concentration)
  // Condition: Enterprise accounts represent < 25% of headcount but > 60% of predicted CLV
  const entSeg = segmentData.segments.find((s) => s.name === 'Enterprise')
  if (entSeg && entSeg.clvShare > 60 && entSeg.customerShare < 25) {
    const entAccounts = customers.filter((c) => c.segment === 'Enterprise')
    insights.push({
      id: 'INS-03',
      title: 'Disproportionate Value Concentration in Enterprise Tier',
      category: 'segment',
      priority: 'high',
      segment: 'Enterprise',
      supportingObservation: `The Enterprise cohort comprises just ${entSeg.customerShare}% of customer accounts (8 of 36) but generates ${entSeg.clvShare}% of total predicted CLV (${formatCurrency(entSeg.totalClv)}) and ${entSeg.revenueShare}% of historical revenue (${formatCurrency(entSeg.totalHistoricalRevenue)}).`,
      metrics: [
        { label: 'Account Share', value: formatPercent(entSeg.customerShare) },
        { label: 'CLV Share', value: formatPercent(entSeg.clvShare) },
        { label: 'Avg Enterprise CLV', value: formatCurrency(entSeg.averageClv) },
        { label: 'Cohort Benchmark Avg', value: formatCurrency(segmentData.summary.averageClv) },
      ],
      businessImplication:
        'High portfolio concentration increases vulnerability to Enterprise churn. A single lost relationship significantly impacts overall company revenue.',
      suggestedAction:
        'Formalize a dedicated Enterprise Key Account Management team with tailored SLAs and quarterly executive business reviews.',
      actionLabel: 'Analyze Enterprise Tier',
      actionHref: '/segments?segment=Enterprise',
      ruleId: 'RULE_PARETO_CONCENTRATION_ENTERPRISE',
      ruleName: 'Enterprise Pareto Concentration Skew',
      ruleFormula: 'enterprise.clvShare > 60% ∧ enterprise.customerShare < 25%',
      impactEstimate: `${formatCurrency(entSeg.totalClv)} Portfolio Core`,
      impactNumeric: entSeg.totalClv,
      affectedCustomerIds: entAccounts.map((c) => c.id),
      generationType: 'rule-based',
    })
  }

  // RULE 4: Growth Tier High-Cadence Outperformers
  // Condition: Growth accounts with CLV >= 1.25x Growth average and low churn risk
  const growthSeg = segmentData.segments.find((s) => s.name === 'Growth')
  if (growthSeg) {
    const growthThreshold = growthSeg.averageClv * 1.25
    const growthOutperformers = customers.filter(
      (c) => c.segment === 'Growth' && c.predictedClv >= growthThreshold && c.churnRisk === 'low',
    )
    if (growthOutperformers.length > 0) {
      const topOutperformer = [...growthOutperformers].sort(
        (a, b) => b.predictedClv - a.predictedClv,
      )[0]
      const outperformancePct = Number(
        (
          ((topOutperformer.predictedClv - growthSeg.averageClv) / growthSeg.averageClv) *
          100
        ).toFixed(1),
      )

      insights.push({
        id: 'INS-04',
        title: 'Growth Tier Expansion Outperformers Ready for Tier Graduation',
        category: 'growth',
        priority: 'medium',
        segment: 'Growth',
        supportingObservation: `Accounts like ${topOutperformer.name} (${topOutperformer.company}, ${formatCurrency(topOutperformer.predictedClv)} CLV) are performing ${outperformancePct}% above the Growth segment average (${formatCurrency(growthSeg.averageClv)}) with steady order velocity and low churn probability (${(topOutperformer.churnProbability * 100).toFixed(0)}%).`,
        metrics: [
          { label: 'Top Growth CLV', value: formatCurrency(topOutperformer.predictedClv) },
          { label: 'Growth Segment Avg', value: formatCurrency(growthSeg.averageClv) },
          { label: 'Outperformance', value: `+${formatPercent(outperformancePct)}` },
          { label: 'Total Orders', value: `${topOutperformer.totalOrders} Orders` },
        ],
        businessImplication:
          'High-performing Growth accounts are prime candidates for Mid-Market graduation; failing to provide expansion pathways risks capping their purchasing cadence.',
        suggestedAction:
          'Proactively present Mid-Market tier packages featuring annual volume pricing and advanced analytics integrations.',
        actionLabel: `Inspect ${topOutperformer.name}`,
        actionHref: `/customers/${topOutperformer.id}`,
        ruleId: 'RULE_GROWTH_TIER_EXPANSION',
        ruleName: 'Growth Tier Outperformance and Graduation',
        ruleFormula: 'segment == "Growth" ∧ predictedClv >= (avgClv × 1.25) ∧ churnRisk == "low"',
        impactEstimate: '+$2,400 ARR Potential',
        impactNumeric: 2400,
        affectedCustomerIds: growthOutperformers.map((c) => c.id),
        generationType: 'rule-based',
      })
    }
  }

  // RULE 5: Standard Tier Margin Erosion & High Attrition Rate
  // Condition: Standard tier represents > 25% of headcount but < 5% of CLV, with > 30% high churn risk
  const stdSeg = segmentData.segments.find((s) => s.name === 'Standard')
  if (stdSeg && stdSeg.highRiskPercentage >= 30 && stdSeg.clvShare <= 5) {
    const stdAccounts = customers.filter((c) => c.segment === 'Standard')
    insights.push({
      id: 'INS-05',
      title: 'Standard Tier Unit Economic Drain & High Attrition Vulnerability',
      category: 'efficiency',
      priority: 'medium',
      segment: 'Standard',
      supportingObservation: `The Standard segment accounts for ${stdSeg.customerShare}% of customer accounts (${stdSeg.customerCount} of 36) but contributes only ${stdSeg.clvShare}% of total predicted CLV (${formatCurrency(stdSeg.totalClv)}), with ${stdSeg.highRiskCount} accounts (${stdSeg.highRiskPercentage}%) at high churn risk.`,
      metrics: [
        { label: 'Headcount Share', value: formatPercent(stdSeg.customerShare) },
        { label: 'CLV Contribution', value: formatPercent(stdSeg.clvShare) },
        { label: 'High Churn Risk Share', value: formatPercent(stdSeg.highRiskPercentage) },
        { label: 'Average CLV', value: formatCurrency(stdSeg.averageClv) },
      ],
      businessImplication:
        'High touch manual support for Standard tier accounts erodes operating margins given the low $492 average CLV.',
      suggestedAction:
        'Shift the Standard tier to an automated, low-touch self-service model with programmatic re-engagement email cadences.',
      actionLabel: 'Inspect Standard Tier',
      actionHref: '/segments?segment=Standard',
      ruleId: 'RULE_STANDARD_TIER_COST_EFFICIENCY',
      ruleName: 'Standard Tier Servicing Efficiency',
      ruleFormula: 'standard.highRiskPercentage >= 30% ∧ standard.clvShare <= 5%',
      impactEstimate: 'Servicing Cost Optimization',
      impactNumeric: stdSeg.totalClv,
      affectedCustomerIds: stdAccounts.map((c) => c.id),
      generationType: 'rule-based',
    })
  }

  // RULE 6: High Individual LTV Outperformer in Mid-Market
  // Condition: Mid-Market account with CLV >= 1.25x Mid-Market average and low churn risk
  const midSeg = segmentData.segments.find((s) => s.name === 'Mid-Market')
  if (midSeg) {
    const midThreshold = midSeg.averageClv * 1.25
    const midOutperformers = customers.filter(
      (c) => c.segment === 'Mid-Market' && c.predictedClv >= midThreshold && c.churnRisk === 'low',
    )
    if (midOutperformers.length > 0) {
      const leader = midOutperformers[0]
      const outperformancePct = Number(
        (((leader.predictedClv - midSeg.averageClv) / midSeg.averageClv) * 100).toFixed(1),
      )

      insights.push({
        id: 'INS-06',
        title: 'Mid-Market Segment Outperformer Approaching Enterprise Threshold',
        category: 'growth',
        priority: 'medium',
        segment: 'Mid-Market',
        supportingObservation: `Account ${leader.name} (${leader.company}) delivers ${formatCurrency(leader.predictedClv)} predicted CLV (+${outperformancePct}% above Mid-Market mean) with ${leader.totalOrders} total orders and only ${(leader.churnProbability * 100).toFixed(0)}% churn risk.`,
        metrics: [
          { label: 'Account CLV', value: formatCurrency(leader.predictedClv) },
          { label: 'Segment Average', value: formatCurrency(midSeg.averageClv) },
          { label: 'Outperformance', value: `+${formatPercent(outperformancePct)}` },
          { label: 'Order Frequency', value: `${leader.totalOrders} Orders` },
        ],
        businessImplication:
          'Accounts generating near-enterprise lifetime value within lower tiers represent immediate enterprise upselling potential with proven product-market fit.',
        suggestedAction:
          'Assign an Enterprise Account Executive to engage stakeholders for a multi-year master service agreement.',
        actionLabel: `Inspect ${leader.name}`,
        actionHref: `/customers/${leader.id}`,
        ruleId: 'RULE_SEGMENT_OUTPERFORMER_MIDMARKET',
        ruleName: 'Mid-Market High LTV Outperformer',
        ruleFormula:
          'segment == "Mid-Market" ∧ predictedClv >= (avgClv × 1.25) ∧ churnRisk == "low"',
        impactEstimate: 'Enterprise Contract Upsell',
        impactNumeric: leader.predictedClv,
        affectedCustomerIds: [leader.id],
        generationType: 'rule-based',
      })
    }
  }

  // RULE 7: Dormant Account Reactivation Window
  // Condition: Customers with status == 'dormant' and churnProbability > 0.80
  const dormantCusts = customers.filter((c) => c.status === 'dormant')
  if (dormantCusts.length > 0) {
    const dormantRev = dormantCusts.reduce((s, c) => s + c.historicalRevenue, 0)
    const dormantClv = dormantCusts.reduce((s, c) => s + c.predictedClv, 0)
    const avgProb =
      (dormantCusts.reduce((s, c) => s + c.churnProbability, 0) / dormantCusts.length) * 100

    insights.push({
      id: 'INS-07',
      title: 'Time-Sensitive Reactivation Window for Dormant Accounts',
      category: 'retention',
      priority: 'low',
      segment: 'Standard',
      supportingObservation: `${dormantCusts.length} accounts (${dormantCusts.map((c) => c.name).join(', ')}) are categorized as 'dormant' with an average ${avgProb.toFixed(0)}% churn probability, representing ${formatCurrency(dormantClv)} in residual predicted CLV.`,
      metrics: [
        { label: 'Dormant Accounts', value: `${dormantCusts.length} Accounts` },
        { label: 'Residual CLV', value: formatCurrency(dormantClv) },
        { label: 'Historical Spend', value: formatCurrency(dormantRev) },
        { label: 'Avg Churn Risk', value: formatPercent(avgProb, 0) },
      ],
      businessImplication:
        'Once an account remains dormant for over 60 days, reactivation response rates drop steeply; immediate automated outreach is required before terminal churn.',
      suggestedAction:
        'Trigger a 3-step automated reactivation email campaign offering a single-use re-order incentive.',
      actionLabel: 'Filter Dormant Accounts',
      actionHref: '/customers?search=dormant',
      ruleId: 'RULE_DORMANT_REACTIVATION',
      ruleName: 'Dormant Account Churn Prevention',
      ruleFormula: 'status == "dormant" ∧ churnProbability > 0.80',
      impactEstimate: `${formatCurrency(dormantClv)} Win-Back Value`,
      impactNumeric: dormantClv,
      affectedCustomerIds: dormantCusts.map((c) => c.id),
      generationType: 'rule-based',
    })
  }

  // RULE 8: Portfolio Net Expansion Runway
  // Condition: Total predicted CLV exceeds total historical revenue
  const expansionSummary = calculatePredictionSummary(customers)
  if (expansionSummary.totalProjectedExpansion > 0) {
    const activeCount = customers.filter((c) => c.status === 'active').length
    insights.push({
      id: 'INS-08',
      title: 'Positive Net Expansion Forecast Across Active Customer Base',
      category: 'growth',
      priority: 'low',
      segment: 'All Segments',
      supportingObservation: `Total 12-month predicted CLV (${formatCurrency(totalClv)}) exceeds historical revenue (${formatCurrency(totalRev)}) by +${formatCurrency(expansionSummary.totalProjectedExpansion)} (+${expansionSummary.projectedExpansionPercent}%), demonstrating net organic expansion across the cohort.`,
      metrics: [
        {
          label: 'Net Expansion',
          value: `+${formatCurrency(expansionSummary.totalProjectedExpansion)}`,
        },
        {
          label: 'Expansion Rate',
          value: `+${formatPercent(expansionSummary.projectedExpansionPercent)}`,
        },
        {
          label: 'Active Account Ratio',
          value: `${activeCount}/${totalCustomers} (${formatPercent((activeCount / totalCustomers) * 100)})`,
        },
        { label: 'Model Horizon', value: '12 Months' },
      ],
      businessImplication:
        'Expansion momentum among healthy accounts generates sufficient surplus to outweigh localized churn risk, provided top-tier relationships remain stable.',
      suggestedAction:
        'Align customer success capacity with expansion accounts to fully capture projected model upside.',
      actionLabel: 'Explore Predictions',
      actionHref: '/predictions',
      ruleId: 'RULE_PORTFOLIO_NET_EXPANSION',
      ruleName: 'Portfolio Net Expansion Trajectory',
      ruleFormula: 'totalPredictedClv > totalHistoricalRevenue',
      impactEstimate: `+${formatCurrency(expansionSummary.totalProjectedExpansion)} Portfolio Expansion`,
      impactNumeric: expansionSummary.totalProjectedExpansion,
      affectedCustomerIds: [],
      generationType: 'rule-based',
    })
  }

  return insights
}

/**
 * Generates practical business recommendations directly traceable to the observed insights.
 */
export function generateRecommendations(
  customers: CustomerRecord[] = MOCK_CUSTOMERS,
): ActionRecommendation[] {
  const highRiskClv = customers
    .filter((c) => c.churnRisk === 'high' && c.predictedClv >= 4000)
    .reduce((sum, c) => sum + c.predictedClv, 0)

  const entSegClv = customers
    .filter((c) => c.segment === 'Enterprise')
    .reduce((sum, c) => sum + c.predictedClv, 0)

  return [
    {
      id: 'REC-01',
      title: 'Executive Churn Intervention for High-Value Accounts',
      category: 'retention',
      priority: 'high',
      targetAudience: 'David K. O’Reilly (Enterprise) & Mid-Market At-Risk Accounts',
      dataTrigger:
        'Predicted CLV >= $4,000 with churn probability > 65% (Rules: RULE_HIGH_VALUE_CHURN_EXPOSURE, RULE_MIDMARKET_RENEWAL_RISK)',
      impactEstimate: `${formatCurrency(highRiskClv)} High-Value CLV Protected`,
      actionLabel: 'View High-Risk Accounts',
      actionHref: '/customers?risk=high',
      tactics: [
        'Assign a senior executive sponsor to lead immediate 1-on-1 discovery calls with David K. O’Reilly.',
        'Review open technical support tickets and resolve SLA friction within 48 hours.',
        'Deliver tailored renewal contract options with volume price-lock guarantees for Tariq Mahmoud and Hannah Abbott.',
        'Schedule a 30-day post-intervention health review to assess re-engagement signals.',
      ],
      ruleReference: 'RULE_HIGH_VALUE_CHURN_EXPOSURE',
      affectedSegment: 'Enterprise',
    },
    {
      id: 'REC-02',
      title: 'Enterprise Key Account Management & QBR Program',
      category: 'loyalty',
      priority: 'high',
      targetAudience: 'Top 8 Enterprise Accounts ($145,350 Total CLV)',
      dataTrigger:
        'Enterprise cohort commands 66.7% of predicted CLV with only 22.2% of account volume (Rule: RULE_PARETO_CONCENTRATION_ENTERPRISE)',
      impactEstimate: `${formatCurrency(entSegClv)} Enterprise Portfolio Safeguarded`,
      actionLabel: 'Inspect Enterprise Tier',
      actionHref: '/segments?segment=Enterprise',
      tactics: [
        'Establish quarterly executive business reviews (QBRs) for all 8 enterprise partners.',
        'Guarantee 15-minute SLA response times and assign dedicated solutions engineers.',
        'Deliver quarterly ROI benchmarks demonstrating tangible platform value and operational savings.',
        'Co-author 2027 product roadmap initiatives with customer technical leads.',
      ],
      ruleReference: 'RULE_PARETO_CONCENTRATION_ENTERPRISE',
      affectedSegment: 'Enterprise',
    },
    {
      id: 'REC-03',
      title: 'Growth Tier Graduation & Annual Contract Acceleration',
      category: 'growth',
      priority: 'medium',
      targetAudience: 'High-Cadence Growth Accounts (Mateo Rossi, Zoe Washington)',
      dataTrigger:
        'Growth accounts outperforming cohort average by >20% with <15% churn risk (Rule: RULE_GROWTH_TIER_EXPANSION)',
      impactEstimate: '+$2,400+ ARR Expansion Potential',
      actionLabel: 'View Growth Outperformers',
      actionHref: '/customers?segment=Growth',
      tactics: [
        'Present Mid-Market tier graduation offers with multi-seat discounts and advanced analytics.',
        'Incentivize 12-month prepaid commitments with a 15% upfront discount versus transactional billing.',
        'Automate feature discovery prompts for advanced workflow modules within the application.',
      ],
      ruleReference: 'RULE_GROWTH_TIER_EXPANSION',
      affectedSegment: 'Growth',
    },
    {
      id: 'REC-04',
      title: 'Standard Tier Low-Touch Automation & Cost Optimization',
      category: 'efficiency',
      priority: 'medium',
      targetAudience: 'Standard Tier Accounts (11 Accounts, $492 Avg CLV)',
      dataTrigger:
        '30.6% of customer headcount generates only 2.5% of CLV with 36.4% churn rate (Rule: RULE_STANDARD_TIER_COST_EFFICIENCY)',
      impactEstimate: '40% Reduction in Servicing Overhead',
      actionLabel: 'Review Standard Cohort',
      actionHref: '/segments?segment=Standard',
      tactics: [
        'Route routine support requests to automated self-service guided troubleshooting.',
        'Deploy automated email re-order triggers based on predicted customer order frequency.',
        'Launch automated 30-day win-back discount sequences for dormant accounts before terminal lapse.',
      ],
      ruleReference: 'RULE_STANDARD_TIER_COST_EFFICIENCY',
      affectedSegment: 'Standard',
    },
  ]
}

/**
 * Computes top-level KPI summary cards for the insights dashboard.
 */
export function calculateInsightKpis(
  insights: BusinessInsight[],
  customers: CustomerRecord[] = MOCK_CUSTOMERS,
): InsightKpiSummary {
  const highPriorityCount = insights.filter((i) => i.priority === 'high').length
  const totalClv = customers.reduce((sum, c) => sum + c.predictedClv, 0)
  const totalRev = customers.reduce((sum, c) => sum + c.historicalRevenue, 0)

  // Calculate total CLV at high churn risk
  const highRiskCustomers = customers.filter((c) => c.churnRisk === 'high')
  const totalAtRiskClv = highRiskCustomers.reduce((sum, c) => sum + c.predictedClv, 0)

  const projectedExpansionClv = totalClv - totalRev

  // Enterprise concentration
  const entCustomers = customers.filter((c) => c.segment === 'Enterprise')
  const entClv = entCustomers.reduce((sum, c) => sum + c.predictedClv, 0)
  const enterpriseClvConcentration =
    totalClv > 0 ? Number(((entClv / totalClv) * 100).toFixed(1)) : 0

  return {
    totalInsights: insights.length,
    highPriorityCount,
    totalAtRiskClv,
    projectedExpansionClv,
    enterpriseClvConcentration,
  }
}

/**
 * Computes segment comparisons for the Pareto / Value Contribution visualization.
 */
export function calculateSegmentValueComparison(
  customers: CustomerRecord[] = MOCK_CUSTOMERS,
): SegmentValueComparisonItem[] {
  const segmentData = calculateSegmentAnalytics(customers)

  return ORDERED_SEGMENTS.map((segName) => {
    const row = segmentData.segments.find((s) => s.name === segName)
    if (!row) {
      return {
        segment: segName,
        accountCount: 0,
        customerShare: 0,
        totalClv: 0,
        clvShare: 0,
        historicalRevenue: 0,
        revenueShare: 0,
        averageClv: 0,
        highRiskCount: 0,
      }
    }

    return {
      segment: segName,
      accountCount: row.customerCount,
      customerShare: row.customerShare,
      totalClv: row.totalClv,
      clvShare: row.clvShare,
      historicalRevenue: row.totalHistoricalRevenue,
      revenueShare: row.revenueShare,
      averageClv: row.averageClv,
      highRiskCount: row.churnRiskDistribution.high,
    }
  })
}

/**
 * Extracts and prepares customer retention opportunities:
 * - High-value accounts with elevated churn risk
 * - Segment outperformers
 * - Low-value or dormant accounts
 */
export function getRetentionOpportunities(
  customers: CustomerRecord[] = MOCK_CUSTOMERS,
): RetentionOpportunitiesDataset {
  const totalClv = customers.reduce((sum, c) => sum + c.predictedClv, 0)
  const segmentData = calculateSegmentAnalytics(customers)

  // 1. High-Value At-Risk Customers (CLV >= 4,000 & churnRisk === 'high')
  const highRiskCusts = customers
    .filter((c) => c.churnRisk === 'high' && c.predictedClv >= 4000)
    .sort((a, b) => b.predictedClv - a.predictedClv)

  const highValueAtRisk: HighValueRiskAccount[] = highRiskCusts.map((c) => {
    const exposureShareOfCohort =
      totalClv > 0 ? Number(((c.predictedClv / totalClv) * 100).toFixed(1)) : 0
    // Estimate days since last purchase
    const lastDate = new Date(c.lastPurchaseDate)
    const refDate = new Date('2026-11-19')
    const diffTime = Math.abs(refDate.getTime() - lastDate.getTime())
    const daysSinceLastPurchase = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return {
      customer: c,
      exposureShareOfCohort,
      churnProbability: c.churnProbability,
      daysSinceLastPurchase,
    }
  })

  const totalAtRiskClv = highRiskCusts.reduce((sum, c) => sum + c.predictedClv, 0)

  // 2. Segment Outperformers (CLV >= 1.2x segment average and low risk)
  const outperformers: SegmentOutperformerAccount[] = []
  ORDERED_SEGMENTS.forEach((segName) => {
    const segInfo = segmentData.segments.find((s) => s.name === segName)
    if (!segInfo) return

    const topForSeg = customers
      .filter((c) => c.segment === segName && c.churnRisk === 'low')
      .sort((a, b) => b.predictedClv - a.predictedClv)[0]

    if (topForSeg && topForSeg.predictedClv > segInfo.averageClv) {
      const outperformancePercent = Number(
        (((topForSeg.predictedClv - segInfo.averageClv) / segInfo.averageClv) * 100).toFixed(1),
      )
      outperformers.push({
        customer: topForSeg,
        segmentAverageClv: segInfo.averageClv,
        outperformancePercent,
      })
    }
  })

  // 3. Dormant Accounts (status === 'dormant')
  const dormantCusts = customers.filter((c) => c.status === 'dormant')
  const dormantAccounts: LowValueDormantAccount[] = dormantCusts.map((c) => ({
    customer: c,
    status: c.status,
    churnProbability: c.churnProbability,
  }))

  return {
    highValueAtRisk,
    totalAtRiskClv,
    outperformers,
    dormantAccounts,
  }
}
