import * as db from '@/lib/mock-db'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CRMDeal {
  id: string
  client: string
  sales_task: string
  status: string
  est_revenue: number
  stakeholders: string
  pending_on_user_id?: string | null
  pending_on_name?: string | null
  created_at: string
  updated_at: string
  created_by_name?: string
  files?: Array<{
    id: string
    original_name: string
    size: number
    mime_type: string
    storage_path: string
  }>
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export function useCRM() {
  return useQuery({
    queryKey: ['crm', 'deals'],
    queryFn: async () => {
      await db.delay()
      return db.getAll<CRMDeal>('deals')
    }
  })
}

export function useDeals(statusFilter?: string) {
  return useQuery({
    queryKey: ['crm', 'deals', statusFilter],
    queryFn: async () => {
      await db.delay()
      const all = db.getAll<CRMDeal>('deals')
      return statusFilter ? all.filter((d) => d.status === statusFilter) : all
    }
  })
}

export function useCRMAssessment() {
  return useMutation({
    mutationFn: async (_params: { type?: string; status?: string }) => {
      await db.delay(300)
      return {
        assessment:
          'CRM pipeline looks healthy. 2 active deals worth $62k total. Consider following up with StartupXYZ.'
      }
    }
  })
}

export function useDeal(dealId: string) {
  return useQuery({
    queryKey: ['crm', 'deals', dealId],
    queryFn: async () => {
      await db.delay()
      return db.getById<CRMDeal>('deals', dealId)
    },
    enabled: !!dealId
  })
}

export function useCRMUsers() {
  return useQuery({
    queryKey: ['crm', 'users'],
    queryFn: async () => {
      await db.delay()
      return db.getAll<{ id: string; name?: string; email: string }>('crm_users')
    }
  })
}

export function useCreateDeal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<CRMDeal>) => {
      await db.delay()
      return db.create<CRMDeal>('deals', data)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['crm'] })
  })
}

export function useUpdateDeal(dealId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<CRMDeal>) => {
      await db.delay()
      return db.update<CRMDeal>('deals', dealId, data)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['crm'] })
  })
}

export function useDeleteDeal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dealId: string) => {
      await db.delay()
      db.remove('deals', dealId)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['crm'] })
  })
}

export function useUploadDealFile(dealId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (file: File) => {
      await db.delay()
      const deal = db.getById<CRMDeal>('deals', dealId)
      if (!deal) throw new Error('Deal not found')
      const newFile = {
        id: `file_${Date.now()}`,
        original_name: file.name,
        size: file.size,
        mime_type: file.type,
        storage_path: `/mock/${file.name}`
      }
      db.update('deals', dealId, {
        files: [...(deal.files ?? []), newFile]
      })
      return newFile
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['crm'] })
  })
}

export function useDeleteDealFile(dealId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (fileId: string) => {
      await db.delay()
      const deal = db.getById<CRMDeal>('deals', dealId)
      if (!deal) throw new Error('Deal not found')
      db.update('deals', dealId, {
        files: (deal.files ?? []).filter((f) => f.id !== fileId)
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['crm'] })
  })
}
