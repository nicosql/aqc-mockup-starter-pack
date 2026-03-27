import * as db from '@/lib/mock-db'
import { queryOptions } from '@tanstack/react-query'

interface Task {
  id: string
  name: string
  description: string
  category: string
  daysRepeat: number
  daysRemind?: number
  remindByEmail: boolean
  user: string
  history?: string[]
}

export function taskQueryOptions(taskId: string) {
  return queryOptions({
    queryKey: ['tasks', taskId],
    queryFn: async () => {
      await db.delay()
      return db.getById<Task>('tasks', taskId)
    }
  })
}
