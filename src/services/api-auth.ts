/**
 * Mock auth service.
 *
 * All auth flows are simulated — any email/password combo succeeds.
 * The "session" is stored in localStorage so it persists across reloads.
 */

import { delay, getById } from '@/lib/mock-db'

const AUTH_KEY = 'mockup-auth'

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar_url?: string
  is_admin: boolean
  is_manager: boolean
  is_sales: boolean
  is_ops: boolean
  is_contractor: boolean
  password_hash?: boolean
}

export interface AuthSession {
  authenticated: boolean
  user?: AuthUser
  profile?: { name: string; avatar_url?: string }
  qb_employee_id?: string
  qb_employee_name?: string
  subscription?: { plan: string; status: string }
}

function getSession(): AuthSession | null {
  const raw = localStorage.getItem(AUTH_KEY)
  return raw ? (JSON.parse(raw) as AuthSession) : null
}

function saveSession(session: AuthSession) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(session))
}

function buildSession(
  user: Record<string, unknown>
): AuthSession {
  return {
    authenticated: true,
    user: {
      id: user.id as string,
      email: user.email as string,
      name: (user.name as string) ?? '',
      avatar_url: (user.avatar_url as string) ?? '',
      is_admin: (user.is_admin as boolean) ?? false,
      is_manager: (user.is_manager as boolean) ?? false,
      is_sales: (user.is_sales as boolean) ?? false,
      is_ops: (user.is_ops as boolean) ?? false,
      is_contractor: (user.is_contractor as boolean) ?? false,
      password_hash: (user.password_hash as boolean) ?? true
    },
    profile: {
      name: (user.name as string) ?? 'Demo User',
      avatar_url: (user.avatar_url as string) ?? ''
    },
    qb_employee_id: 'worker_1',
    qb_employee_name: (user.name as string) ?? 'Demo User',
    subscription: { plan: 'pro', status: 'active' }
  }
}

export const authApi = {
  /** Login with any email/password — always succeeds. */
  async loginWithPassword(email: string, _password: string): Promise<AuthSession> {
    await delay()
    // Find user by email or fall back to first user
    const user =
      getById('users', email, 'email') ??
      getById('users', 'user_1') ??
      ({ id: 'user_1', email, name: 'Demo User', is_admin: true, is_manager: true, is_sales: false, is_ops: false, is_contractor: false, password_hash: true })
    const session = buildSession(user as Record<string, unknown>)
    saveSession(session)
    return session
  },

  async getSession(): Promise<AuthSession> {
    await delay(50)
    return getSession() ?? { authenticated: false }
  },

  async logout(): Promise<void> {
    await delay(50)
    localStorage.removeItem(AUTH_KEY)
  },

  async sendMagicLink(_email: string, _type?: string): Promise<{ message: string }> {
    await delay()
    return { message: 'Magic link sent (mock)' }
  },

  async verifyPin(_pin: string): Promise<{ valid: boolean }> {
    await delay()
    return { valid: true }
  },

  async requestPasswordReset(_email: string): Promise<void> {
    await delay()
  },

  async confirmPasswordReset(
    _password: string,
    _passwordConfirm: string,
    _token: string
  ): Promise<void> {
    await delay()
  },

  async sendVerificationEmail(_email: string): Promise<void> {
    await delay()
  },

  async verifyEmailByToken(_token: string): Promise<void> {
    await delay()
  },

  async completeOnboarding(name: string): Promise<{ redirect: string }> {
    await delay()
    const session = getSession()
    if (session?.profile) {
      session.profile.name = name
      if (session.user) session.user.name = name
      saveSession(session)
    }
    return { redirect: '/app/time-dashboard' }
  }
}
