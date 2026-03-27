import * as db from '@/lib/mock-db'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface CRMLead {
  id: string
  name: string
  company: string
  title: string
  contact_email: string
  phone: string
  status: string
  contact_method: string
  first_contacted_at?: string | null
  last_touched_at?: string | null
  created_at: string
  updated_at: string
  created_by_name?: string
  notes?: Array<{ id: string; content: string; created_at: string; created_by_name?: string }>
  images?: Array<{ id: string; image_url: string }>
}

export function useLeads(statusFilter?: string) {
  return useQuery({
    queryKey: ['crm', 'leads', statusFilter],
    queryFn: async () => {
      await db.delay()
      const all = db.getAll<CRMLead>('leads')
      return statusFilter ? all.filter((l) => l.status === statusFilter) : all
    }
  })
}

export function useLead(leadId: string) {
  return useQuery({
    queryKey: ['crm', 'leads', leadId],
    queryFn: async () => {
      await db.delay()
      return db.getById<CRMLead>('leads', leadId)
    },
    enabled: !!leadId
  })
}

export function useCreateLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<CRMLead>) => {
      await db.delay()
      return db.create<CRMLead>('leads', { ...data, notes: [], images: [] })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['crm'] })
  })
}

export function useUpdateLead(leadId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<CRMLead>) => {
      await db.delay()
      return db.update<CRMLead>('leads', leadId, data)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['crm'] })
  })
}

export function useDeleteLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (leadId: string) => {
      await db.delay()
      db.remove('leads', leadId)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['crm'] })
  })
}

export function useAddLeadNote(leadId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (content: string) => {
      await db.delay()
      const lead = db.getById<CRMLead>('leads', leadId)
      if (!lead) throw new Error('Lead not found')
      const note = {
        id: `lnote_${Date.now()}`,
        content,
        created_at: new Date().toISOString(),
        created_by_name: 'Demo User'
      }
      db.update('leads', leadId, { notes: [...(lead.notes ?? []), note] })
      return note
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['crm'] })
  })
}

export function useDeleteLeadNote(leadId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (noteId: string) => {
      await db.delay()
      const lead = db.getById<CRMLead>('leads', leadId)
      if (!lead) throw new Error('Lead not found')
      db.update('leads', leadId, {
        notes: (lead.notes ?? []).filter((n) => n.id !== noteId)
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['crm'] })
  })
}

export function useAddLeadImage(leadId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ imageUrl }: { imageUrl: string }) => {
      await db.delay()
      const lead = db.getById<CRMLead>('leads', leadId)
      if (!lead) throw new Error('Lead not found')
      const img = { id: `limg_${Date.now()}`, image_url: imageUrl }
      db.update('leads', leadId, { images: [...(lead.images ?? []), img] })
      return img
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['crm'] })
  })
}

export function useDeleteLeadImage(leadId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (imageId: string) => {
      await db.delay()
      const lead = db.getById<CRMLead>('leads', leadId)
      if (!lead) throw new Error('Lead not found')
      db.update('leads', leadId, {
        images: (lead.images ?? []).filter((i) => i.id !== imageId)
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['crm'] })
  })
}
