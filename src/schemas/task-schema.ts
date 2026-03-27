import { z } from 'zod'

export const taskHistoryDateSchema = z.string().regex(
  /^\d{4}-\d{2}-\d{2}$/,
  'Must be a valid date string (yyyy-MM-dd)'
)

export type TaskHistoryDate = z.infer<typeof taskHistoryDateSchema>

export const taskSchema = z.object({
  id: z.string().default(''),
  name: z.string().min(1, 'Task name is required'),
  description: z.string().default(''),
  category: z.string().default(''),
  repeatGoalEnabled: z.boolean().default(false),
  daysRepeat: z.string().default('0'),
  daysRemind: z.string().default('0'),
  remindByEmail: z.boolean().default(false),
  history: z.array(z.string()).default([])
})

export type Task = z.infer<typeof taskSchema>
