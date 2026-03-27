import { delay } from '@/lib/mock-db'

export const billingApi = {
  async createCheckout(
    _plan: 'pro',
    _interval: string
  ): Promise<{ checkout_url: string }> {
    await delay()
    return { checkout_url: '#mock-checkout' }
  },

  async getPortalUrl(): Promise<{ portal_url: string }> {
    await delay()
    return { portal_url: '#mock-portal' }
  }
}
