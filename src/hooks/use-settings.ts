import * as db from '@/lib/mock-db'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

interface Settings {
  id: string
  user_id: string
  theme: string
  remind_email: string
  remind_by_email_enabled: boolean
}

export default function useSettings() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      await db.delay()
      const all = db.getAll<Settings>('settings')
      return all[0] ?? null
    }
  })

  const updateSettings = useCallback(
    async (_userId: string, values: Record<string, unknown>) => {
      if (!data) return
      db.update('settings', data.id, values)
      qc.invalidateQueries({ queryKey: ['settings'] })
    },
    [data, qc]
  )

  return {
    isLoading,
    userId: data?.user_id ?? 'user_1',
    name: 'Demo User',
    remindEmail: data?.remind_email ?? '',
    remindByEmailEnabled: data?.remind_by_email_enabled ?? false,
    theme: data?.theme ?? 'system',
    authWithPasswordAvailable: true,
    updateSettings
  }
}
