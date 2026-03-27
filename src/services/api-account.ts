import { delay } from '@/lib/mock-db'

export const accountApi = {
  async updateName(name: string): Promise<void> {
    await delay()
    const session = JSON.parse(localStorage.getItem('mockup-auth') ?? '{}')
    if (session.profile) session.profile.name = name
    if (session.user) session.user.name = name
    localStorage.setItem('mockup-auth', JSON.stringify(session))
  },

  async changeEmail(_email: string): Promise<{ message: string }> {
    await delay()
    return { message: 'Email updated (mock)' }
  },

  async changePassword(_payload: {
    current_password: string
    new_password: string
    confirm_password: string
  }): Promise<void> {
    await delay()
  },

  async setPassword(_payload: {
    new_password: string
    confirm_password: string
  }): Promise<void> {
    await delay()
  }
}
