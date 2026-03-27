import * as db from '@/lib/mock-db'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import type { Task } from '@/schemas/task-schema'

export default function useTasks() {
  const qc = useQueryClient()

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      await db.delay()
      return db.getAll<Task>('tasks')
    }
  })

  const categories = [...new Set(tasks.map((t) => t.category).filter(Boolean))]

  const createTask = useCallback(
    async (userId: string, task: Partial<Task>) => {
      db.create('tasks', { ...task, user: userId })
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
    [qc]
  )

  const updateTask = useCallback(
    async (taskId: string, task: Partial<Task>) => {
      db.update('tasks', taskId, task)
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
    [qc]
  )

  const deleteTask = useCallback(
    async (task: Task) => {
      db.remove('tasks', task.id)
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
    [qc]
  )

  const updateTaskHistory = useCallback(
    async (taskId: string, history: string[]) => {
      db.update('tasks', taskId, { history })
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
    [qc]
  )

  return { tasks, categories, createTask, updateTask, deleteTask, updateTaskHistory }
}
