import { authApi } from '@/services/api-auth'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useCallback, useState } from 'react'

export default function useAuth() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [emailSendCountdown, setEmailSendCountdown] = useState(0)

  const loginWithPassword = useCallback(
    async (email: string, password: string) => {
      const session = await authApi.loginWithPassword(email, password)
      queryClient.setQueryData(['me'], session)
      navigate({ to: '/app/time-dashboard' })
    },
    [navigate, queryClient]
  )

  const logout = useCallback(async () => {
    await authApi.logout()
    queryClient.clear()
    navigate({ to: '/' })
  }, [navigate, queryClient])

  const requestPasswordReset = useCallback(async (email: string) => {
    await authApi.requestPasswordReset(email)
  }, [])

  const confirmPasswordReset = useCallback(
    async (password: string, passwordConfirm: string, token: string) => {
      await authApi.confirmPasswordReset(password, passwordConfirm, token)
      navigate({ to: '/auth/login' })
    },
    [navigate]
  )

  const sendVerificationEmail = useCallback(async (email: string) => {
    await authApi.sendVerificationEmail(email)
  }, [])

  const verifyEmailByToken = useCallback(
    async (token: string) => {
      await authApi.verifyEmailByToken(token)
      navigate({ to: '/app/time-dashboard' })
    },
    [navigate]
  )

  const startEmailSendCountdown = useCallback((_opts?: { resetTargetTime?: boolean }) => {
    setEmailSendCountdown(60)
    const interval = setInterval(() => {
      setEmailSendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  // Expose a mock user for components that read useAuth().user
  const session = queryClient.getQueryData<{ user?: { id: string; email: string; avatar_url?: string } }>(['me'])

  return {
    user: session?.user ?? null,
    loginWithPassword,
    logout,
    requestPasswordReset,
    confirmPasswordReset,
    sendVerificationEmail,
    verifyEmailByToken,
    emailSendCountdown,
    startEmailSendCountdown
  }
}
