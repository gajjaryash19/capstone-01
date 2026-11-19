export interface CustomerSegment {
  id: string
  name: string
  description: string
  customerCount: number
  averageSpend: number
  churnRisk: 'low' | 'moderate' | 'high'
}

export interface RfmScore {
  recency: number
  frequency: number
  monetary: number
}
