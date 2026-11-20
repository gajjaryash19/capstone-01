/**
 * Valora Authentication Context & Types
 *
 * Provides application-wide authentication state, user metadata, and provider operations.
 */

import { createContext, useContext } from 'react'
import type { User, Session } from '@supabase/supabase-js'

export interface AuthContextValue {
  user: User | null
  session: Session | null
  isLoading: boolean
  isConfigured: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (
    email: string,
    password: string,
    fullName?: string,
  ) => Promise<{ error: Error | null; user: User | null }>
  signOut: () => Promise<{ error: Error | null }>
  resetPasswordForEmail: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
