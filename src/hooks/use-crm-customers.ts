import * as db from '@/lib/mock-db'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface CRMCustomer {
  id: string
  qb_customer_id: string
  display_name: string
  is_active: boolean
  email: string
  phone: string
  given_name: string
  family_name: string
  company_name: string
  bill_address_line1: string
  bill_address_city: string
  bill_address_state: string
  bill_address_postal_code: string
  balance: number
  created_at: string
  updated_at: string
  synced_at: string
}

export function useCustomers(search?: string, activeOnly?: boolean) {
  return useQuery({
    queryKey: ['crm', 'customers', search, activeOnly],
    queryFn: async () => {
      await db.delay()
      let results = db.getAll<CRMCustomer>('customers')
      if (activeOnly) results = results.filter((c) => c.is_active)
      if (search) {
        const q = search.toLowerCase()
        results = results.filter(
          (c) =>
            c.display_name.toLowerCase().includes(q) ||
            c.company_name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q)
        )
      }
      return results
    }
  })
}

export function useCustomer(customerId: string) {
  return useQuery({
    queryKey: ['crm', 'customers', customerId],
    queryFn: async () => {
      await db.delay()
      return db.getById<CRMCustomer>('customers', customerId)
    },
    enabled: !!customerId
  })
}

export function useSyncCustomers() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await db.delay(500)
      // Mock sync — no-op
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'customers'] })
  })
}
