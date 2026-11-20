/**
 * Valora Supabase Authentication Service
 *
 * Dedicated service module encapsulating all direct Supabase Auth calls.
 * Provides typed, clean contract between UI forms/context and the Supabase SDK.
 * Dynamically retrieves the Supabase client to avoid loading auth libraries prematurely.
 */

import type { User, Session, AuthResponse, UserResponse } from '@supabase/supabase-js'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'

export interface AuthActionResult<T = unknown> {
  data: T | null
  error: Error | null
}

const NOT_CONFIGURED_ERROR = new Error(
  'Supabase is not configured. Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.',
)

export const authService = {
  /**
   * Check if Supabase credentials are configured.
   */
  isConfigured(): boolean {
    return isSupabaseConfigured
  },

  /**
   * Restore current active session.
   */
  async getSession(): Promise<AuthActionResult<Session>> {
    if (!isSupabaseConfigured) {
      return { data: null, error: null }
    }
    const supabase = await getSupabase()
    if (!supabase) return { data: null, error: NOT_CONFIGURED_ERROR }
    const { data, error } = await supabase.auth.getSession()
    return { data: data.session, error }
  },

  /**
   * Get current authenticated user.
   */
  async getUser(): Promise<AuthActionResult<User>> {
    if (!isSupabaseConfigured) {
      return { data: null, error: null }
    }
    const supabase = await getSupabase()
    if (!supabase) return { data: null, error: NOT_CONFIGURED_ERROR }
    const { data, error } = await supabase.auth.getUser()
    return { data: data.user, error }
  },

  /**
   * Authenticate with email and password.
   */
  async signInWithPassword(
    email: string,
    password: string,
  ): Promise<AuthActionResult<AuthResponse['data']>> {
    if (!isSupabaseConfigured) {
      return { data: null, error: NOT_CONFIGURED_ERROR }
    }
    const supabase = await getSupabase()
    if (!supabase) return { data: null, error: NOT_CONFIGURED_ERROR }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  /**
   * Register a new user account with email and password.
   */
  async signUp(
    email: string,
    password: string,
    fullName?: string,
  ): Promise<AuthActionResult<AuthResponse['data']>> {
    if (!isSupabaseConfigured) {
      return { data: null, error: NOT_CONFIGURED_ERROR }
    }
    const supabase = await getSupabase()
    if (!supabase) return { data: null, error: NOT_CONFIGURED_ERROR }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })
    return { data, error }
  },

  /**
   * Sign out the active user session and revoke client tokens.
   */
  async signOut(): Promise<AuthActionResult<void>> {
    if (!isSupabaseConfigured) {
      return { data: null, error: null }
    }
    const supabase = await getSupabase()
    if (!supabase) return { data: null, error: null }
    const { error } = await supabase.auth.signOut()
    return { data: null, error }
  },

  /**
   * Dispatch a secure password recovery link to the user's email.
   */
  async resetPasswordForEmail(email: string): Promise<AuthActionResult<void>> {
    if (!isSupabaseConfigured) {
      return { data: null, error: NOT_CONFIGURED_ERROR }
    }
    const supabase = await getSupabase()
    if (!supabase) return { data: null, error: NOT_CONFIGURED_ERROR }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { data: null, error }
  },

  /**
   * Update the authenticated user's password following recovery callback.
   */
  async updateUserPassword(newPassword: string): Promise<AuthActionResult<UserResponse['data']>> {
    if (!isSupabaseConfigured) {
      return { data: null, error: NOT_CONFIGURED_ERROR }
    }
    const supabase = await getSupabase()
    if (!supabase) return { data: null, error: NOT_CONFIGURED_ERROR }
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    return { data, error }
  },

  /**
   * Subscribe to live authentication state transitions.
   */
  async onAuthStateChange(callback: (event: string, session: Session | null) => void): Promise<{
    data: { subscription: { unsubscribe: () => void } }
  }> {
    if (!isSupabaseConfigured) {
      return {
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      }
    }
    const supabase = await getSupabase()
    if (!supabase) {
      return {
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      }
    }
    return supabase.auth.onAuthStateChange(callback)
  },
}
