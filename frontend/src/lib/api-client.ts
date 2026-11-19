import { API_BASE_URL } from '@/config/constants'

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`API error (${response.status}): ${errorBody || response.statusText}`)
  }

  return response.json() as Promise<T>
}
