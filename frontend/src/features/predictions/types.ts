export interface PredictionRecord {
  customerId: string
  customerName: string
  predictedClv: number
  churnProbability: number
  expansionLikelihood: number
  topPredictiveFactors: string[]
}

export interface ModelMetadata {
  modelName: string
  version: string
  lastTrained: string
  accuracyScore: number
}
