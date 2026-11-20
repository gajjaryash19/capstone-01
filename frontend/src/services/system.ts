import { apiClient } from '@/lib/api-client'

export interface HealthResponse {
  status: string
}

export interface SystemResponse {
  app_name: string
  version: string
  status: string
}

export const systemService = {
  getHealth: () => apiClient<HealthResponse>('/health'),
  getSystemInfo: () => apiClient<SystemResponse>('/api/v1/system'),
}
