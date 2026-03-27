import * as db from '@/lib/mock-db'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface TimeActivity {
  Id: string
  TxnDate: string
  EmployeeRef?: { value: string; name: string }
  CustomerRef?: { value: string; name: string }
  ItemRef?: { value: string; name: string }
  Hours: number
  Minutes: number
  Description?: string
  BillableStatus?: 'Billable' | 'NotBillable' | 'HasBeenBilled'
  SyncToken: string
}

export function useTimeActivities(start: string, end: string) {
  return useQuery({
    queryKey: ['time-activities', start, end],
    queryFn: async () => {
      await db.delay()
      return db.query<TimeActivity>('time_activities', (t) => t.TxnDate >= start && t.TxnDate <= end)
    }
  })
}

export function useCreateTimeActivity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      txn_date: string
      employee_id?: string
      employee_name?: string
      customer_id?: string
      customer_name?: string
      item_id?: string
      item_name?: string
      hours: number
      minutes: number
      description?: string
      billable_status?: string
    }) => {
      await db.delay()
      return db.create<TimeActivity>('time_activities', {
        Id: `ta_${Date.now()}`,
        TxnDate: data.txn_date,
        EmployeeRef: data.employee_id ? { value: data.employee_id, name: data.employee_name ?? '' } : undefined,
        CustomerRef: data.customer_id ? { value: data.customer_id, name: data.customer_name ?? '' } : undefined,
        ItemRef: data.item_id ? { value: data.item_id, name: data.item_name ?? '' } : undefined,
        Hours: data.hours,
        Minutes: data.minutes,
        Description: data.description,
        BillableStatus: (data.billable_status as TimeActivity['BillableStatus']) ?? 'Billable',
        SyncToken: '0'
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['time-activities'] })
  })
}

export function useUpdateTimeActivity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      id: string
      sync_token: string
      txn_date: string
      employee_id?: string
      employee_name?: string
      customer_id?: string
      customer_name?: string
      item_id?: string
      item_name?: string
      hours: number
      minutes: number
      description?: string
      billable_status?: string
    }) => {
      await db.delay()
      return db.update<TimeActivity>('time_activities', data.id, {
        TxnDate: data.txn_date,
        EmployeeRef: data.employee_id ? { value: data.employee_id, name: data.employee_name ?? '' } : undefined,
        CustomerRef: data.customer_id ? { value: data.customer_id, name: data.customer_name ?? '' } : undefined,
        ItemRef: data.item_id ? { value: data.item_id, name: data.item_name ?? '' } : undefined,
        Hours: data.hours,
        Minutes: data.minutes,
        Description: data.description,
        BillableStatus: (data.billable_status as TimeActivity['BillableStatus']) ?? 'Billable'
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['time-activities'] })
  })
}

export function useDeleteTimeActivity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id }: { id: string; syncToken: string }) => {
      await db.delay()
      db.remove('time_activities', id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['time-activities'] })
  })
}

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      await db.delay()
      return db.getAll<{ id: string; name: string }>('employees')
    }
  })
}

export function useCustomers() {
  return useQuery({
    queryKey: ['qb-customers'],
    queryFn: async () => {
      await db.delay()
      return db.getAll<{ id: string; name: string }>('qb_customers')
    }
  })
}

export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      await db.delay()
      return db.getAll<{ id: string; name: string }>('items')
    }
  })
}
