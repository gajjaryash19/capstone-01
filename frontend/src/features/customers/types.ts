export type CustomerSegment = 'Enterprise' | 'Mid-Market' | 'Growth' | 'Standard'

export type ChurnRiskLevel = 'low' | 'moderate' | 'high'

export interface CustomerRecord {
  id: string
  name: string
  email: string
  company: string
  avatarInitials: string
  segment: CustomerSegment
  predictedClv: number
  historicalRevenue: number
  totalOrders: number
  averageOrderValue: number
  lastPurchaseDate: string
  churnRisk: ChurnRiskLevel
  churnProbability: number // 0.00 to 1.00
  joinedDate: string
  status: 'active' | 'at-risk' | 'dormant'
}

export type CustomerSegmentFilter = 'all' | CustomerSegment
export type ChurnRiskFilter = 'all' | ChurnRiskLevel
export type ClvTierFilter = 'all' | 'high' | 'mid' | 'standard'

export type CustomerSortField =
  | 'name'
  | 'segment'
  | 'predictedClv'
  | 'historicalRevenue'
  | 'totalOrders'
  | 'averageOrderValue'
  | 'lastPurchaseDate'
  | 'churnRisk'

export type SortDirection = 'asc' | 'desc'

export interface CustomerFilterParams {
  searchQuery: string
  segment: CustomerSegmentFilter
  churnRisk: ChurnRiskFilter
  clvTier: ClvTierFilter
  sortField: CustomerSortField
  sortDirection: SortDirection
  page: number
  pageSize: number
}

export interface CustomerDirectoryKpiSummary {
  totalCustomers: number
  highValueCustomers: number
  atRiskCustomers: number
  averageClv: number
}
