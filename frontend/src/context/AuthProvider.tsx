/**
 * Valora Authentication Provider
 *
 * Manages Supabase Auth session restoration, subscription cleanup,
 * and state synchronization across the platform via authService.
 */

import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { authService } from '@/services/auth'
import { AuthContext, type AuthContextValue } from './AuthContext'

export interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const isConfigured = authService.isConfigured()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(() => isConfigured)

  useEffect(() => {
    let isMounted = true

    if (!isConfigured) {
      return
    }

    // Restore active session through service
    authService
      .getSession()
      .then(({ data, error }) => {
        if (!isMounted) return
        if (error) {
          console.error('[Valora Auth] Session restoration error:', error.message)
        }
        setSession(data)
        setUser(data?.user ?? null)
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        if (!isMounted) return
        console.error('[Valora Auth] Unexpected session error:', err)
        setIsLoading(false)
      })

    // Subscribe to auth state transitions
    let unsubscribeFn = () => {}
    authService
      .onAuthStateChange((_event, currentSession) => {
        if (!isMounted) return
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
        setIsLoading(false)
      })
      .then(({ data }) => {
        if (isMounted) {
          unsubscribeFn = data.subscription.unsubscribe
        } else {
          data.subscription.unsubscribe()
        }
      })

    return () => {
      isMounted = false
      unsubscribeFn()
    }
  }, [isConfigured])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await authService.signInWithPassword(email, password)
    return { error }
  }, [])

  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    const { data, error } = await authService.signUp(email, password, fullName)
    return { error, user: data?.user ?? null }
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await authService.signOut()
    setUser(null)
    setSession(null)
    return { error }
  }, [])

  const resetPasswordForEmail = useCallback(async (email: string) => {
    const { error } = await authService.resetPasswordForEmail(email)
    return { error }
  }, [])

  const updatePassword = useCallback(async (newPassword: string) => {
    const { error } = await authService.updateUserPassword(newPassword)
    return { error }
  }, [])

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      isLoading,
      isConfigured,
      signIn,
      signUp,
      signOut,
      resetPasswordForEmail,
      updatePassword,
    }),
    [
      user,
      session,
      isLoading,
      isConfigured,
      signIn,
      signUp,
      signOut,
      resetPasswordForEmail,
      updatePassword,
    ],
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
