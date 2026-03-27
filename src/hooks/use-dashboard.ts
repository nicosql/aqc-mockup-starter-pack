import * as db from '@/lib/mock-db'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface TimeOverview {
  weeks: string[]
  customers: Array<{
    qb_customer_id: string
    qb_customer_name: string
    weeks: Record<string, { forecasted: number; actual: number; variance: number }>
  }>
  connected: boolean
}

export function useTimeOverview(start: string, end: string) {
  return useQuery({
    queryKey: ['time-overview', start, end],
    queryFn: async () => {
      await db.delay()
      return db.getSingleton<TimeOverview>('time_overview')
    }
  })
}

export function useUpsertForecast() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      qb_customer_id: string
      qb_customer_name: string
      week_start: string
      hours: number
    }) => {
      await db.delay()
      const overview = db.getSingleton<TimeOverview>('time_overview')
      const customer = overview.customers.find((c) => c.qb_customer_id === data.qb_customer_id)
      if (customer && customer.weeks[data.week_start]) {
        customer.weeks[data.week_start].forecasted = data.hours
        customer.weeks[data.week_start].variance =
          customer.weeks[data.week_start].actual - data.hours
      }
      db.setSingleton('time_overview', overview)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['time-overview'] })
  })
}

export function useTimeDashboardAssessment() {
  return useMutation({
    mutationFn: async (_params: { start: string; end: string }) => {
      await db.delay(300)
      return {
        assessment:
          'Time tracking looks healthy. Acme Corp is 8 hours under forecast for the current week. Consider re-allocating resources.'
      }
    }
  })
}
