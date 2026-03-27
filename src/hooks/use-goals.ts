import * as db from '@/lib/mock-db'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface Goal {
  id: string
  title: string
  description?: string
  status: string
  current_step: number
  total_steps: number
}

interface GoalEntry {
  id: string
  goal_id: string
  step: number
  completed: boolean
}

export function useGoals() {
  return useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      await db.delay()
      return db.getAll<Goal>('goals')
    }
  })
}

export function useGoal(goalId: string) {
  return useQuery({
    queryKey: ['goals', goalId],
    queryFn: async () => {
      await db.delay()
      const goal = db.getById<Goal>('goals', goalId)
      const entries = db.query<GoalEntry>('goal_entries', (e) => e.goal_id === goalId)
      return { goal, entries: entries.sort((a, b) => a.step - b.step) }
    },
    enabled: !!goalId
  })
}

export function useCreateGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { title: string; description?: string }) => {
      await db.delay()
      const totalSteps = 5
      const goal = db.create<Goal>('goals', {
        ...data,
        status: 'in_progress',
        current_step: 0,
        total_steps: totalSteps
      })
      for (let i = 1; i <= totalSteps; i++) {
        db.create('goal_entries', { goal_id: goal.id, step: i, completed: false })
      }
      return goal
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] })
  })
}

export function useUpdateGoal(goalId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { title: string; description?: string }) => {
      await db.delay()
      return db.update<Goal>('goals', goalId, data as Partial<Goal>)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] })
  })
}

export function useDeleteGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (goalId: string) => {
      await db.delay()
      // Remove entries first
      const entries = db.query<GoalEntry>('goal_entries', (e) => e.goal_id === goalId)
      entries.forEach((e) => db.remove('goal_entries', e.id))
      db.remove('goals', goalId)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] })
  })
}

export function useCompleteEntry(goalId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (step: number) => {
      await db.delay()
      const entries = db.query<GoalEntry>('goal_entries', (e) => e.goal_id === goalId)
      const entry = entries.find((e) => e.step === step)
      if (entry) db.update('goal_entries', entry.id, { completed: true })
      const goal = db.getById<Goal>('goals', goalId)
      if (goal) db.update('goals', goalId, { current_step: Math.max(goal.current_step, step) })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] })
  })
}

export function useUncompleteEntry(goalId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (step: number) => {
      await db.delay()
      const entries = db.query<GoalEntry>('goal_entries', (e) => e.goal_id === goalId)
      const entry = entries.find((e) => e.step === step)
      if (entry) db.update('goal_entries', entry.id, { completed: false })
      const goal = db.getById<Goal>('goals', goalId)
      if (goal) {
        const completedEntries = entries.filter((e) => e.completed && e.step !== step)
        const maxStep = completedEntries.length > 0 ? Math.max(...completedEntries.map((e) => e.step)) : 0
        db.update('goals', goalId, { current_step: maxStep })
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] })
  })
}
