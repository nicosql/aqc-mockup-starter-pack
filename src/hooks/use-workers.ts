import * as db from '@/lib/mock-db'
import { useQuery } from '@tanstack/react-query'

export interface Worker {
  id: string
  name: string
  qb_display_name: string
  email: string
  default_cost_rate?: number
  default_sales_price_rate?: number
}

export function useWorkers() {
  return useQuery({
    queryKey: ['workers'],
    queryFn: async () => {
      await db.delay()
      return { workers: db.getAll<Worker>('workers') }
    }
  })
}
