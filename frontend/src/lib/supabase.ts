/**
 * Valora Supabase Client Architecture
 *
 * Centralized, type-safe Supabase client initialization.
 * Validates environment variables and provides configuration readiness status.
 * Dynamically loads the Supabase SDK on demand to eliminate unnecessary bundle overhead on initial paint.
 */

import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * Checks whether Supabase environment variables are properly configured.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  supabaseAnonKey.length > 10 &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-supabase-anon-key'),
)

let clientPromise: Promise<SupabaseClient> | null = null

/**
 * Returns the singleton Supabase client instance, loaded asynchronously on demand.
 */
export async function getSupabase(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) {
    return null
  }
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
          storageKey: 'valora_auth_token',
        },
      }),
    )
  }
  return clientPromise
}
