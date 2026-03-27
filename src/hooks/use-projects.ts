import * as db from '@/lib/mock-db'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Project {
  id: string
  name: string
  description: string
  status: string
  task_count: number
  created_at: string
  updated_at: string
  created_by_name?: string
}

export interface ProjectTask {
  id: string
  project_id: string
  title: string
  description: string
  status: string
  assigned_to?: string | null
  assigned_to_name?: string | null
  role_id?: string | null
  role_name?: string | null
  due_date?: string | null
  cost_rate: number
  sales_rate: number
  total_hours: number
  total_cost?: number
  start_time?: string
  end_time?: string
  time_entries?: Array<{ id: string; date: string; hours: number; description?: string; user_name?: string }>
  notes?: Array<{ id: string; content: string; created_at: string; user_name?: string }>
  files?: Array<{ id: string; original_name: string; size: number; mime_type: string; storage_path: string }>
}

export interface ProjectAssignment {
  id: string
  project_id: string
  worker_id: string
  worker_name: string
  worker_email?: string
  worker_user_id: string
  role_id: string
  role_name: string
  cost_rate?: number
  sales_rate?: number
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: string
  assigned_to?: string | null
  due_date?: string | null
  role_id?: string | null
  cost_rate?: number
  sales_rate?: number
  start_time?: string | null
  end_time?: string | null
}

// ---------------------------------------------------------------------------
// Project hooks
// ---------------------------------------------------------------------------

export function useProjects(status?: string) {
  return useQuery({
    queryKey: ['projects', status],
    queryFn: async () => {
      await db.delay()
      const all = db.getAll<Project>('projects')
      return status ? all.filter((p) => p.status === status) : all
    }
  })
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: async () => {
      await db.delay()
      return db.getById<Project>('projects', projectId)
    },
    enabled: !!projectId
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { name: string; description: string; status: string }) => {
      await db.delay()
      return db.create<Project>('projects', { ...data, task_count: 0, created_by_name: 'Demo User' } as Partial<Project>)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] })
  })
}

export function useUpdateProject(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Project>) => {
      await db.delay()
      return db.update<Project>('projects', projectId, data)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] })
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (projectId: string) => {
      await db.delay()
      db.remove('projects', projectId)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] })
  })
}

export function useProjectsAssessment() {
  return useMutation({
    mutationFn: async (_status?: string) => {
      await db.delay(300)
      return { assessment: 'Projects are on track. Website Redesign is 60% complete with 2 of 3 tasks done.' }
    }
  })
}

// ---------------------------------------------------------------------------
// Task hooks
// ---------------------------------------------------------------------------

export function useProjectTasks(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId, 'tasks'],
    queryFn: async () => {
      await db.delay()
      return db.query<ProjectTask>('project_tasks', (t) => t.project_id === projectId)
    },
    enabled: !!projectId
  })
}

export function useProjectTask(taskId: string) {
  return useQuery({
    queryKey: ['project_tasks', taskId],
    queryFn: async () => {
      await db.delay()
      return db.getById<ProjectTask>('project_tasks', taskId)
    },
    enabled: !!taskId
  })
}

export function useCreateTask(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<ProjectTask>) => {
      await db.delay()
      const task = db.create<ProjectTask>('project_tasks', {
        ...data,
        project_id: projectId,
        total_hours: 0,
        total_cost: 0,
        time_entries: [],
        notes: [],
        files: []
      })
      // Update task_count
      const project = db.getById<Project>('projects', projectId)
      if (project) db.update('projects', projectId, { task_count: project.task_count + 1 })
      return task
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] })
  })
}

export function useUpdateTask(taskId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: UpdateTaskInput) => {
      await db.delay()
      return db.update<ProjectTask>('project_tasks', taskId, data as Partial<ProjectTask>)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] })
  })
}

export function useDeleteTask(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (taskId: string) => {
      await db.delay()
      db.remove('project_tasks', taskId)
      const project = db.getById<Project>('projects', projectId)
      if (project) db.update('projects', projectId, { task_count: Math.max(0, project.task_count - 1) })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] })
  })
}

export function useCreateTimeEntry(taskId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { date: string; hours: number; description: string }) => {
      await db.delay()
      const task = db.getById<ProjectTask>('project_tasks', taskId)
      if (!task) throw new Error('Task not found')
      const entry = { id: `te_${Date.now()}`, ...data, user_name: 'Demo User' }
      db.update('project_tasks', taskId, {
        time_entries: [...(task.time_entries ?? []), entry],
        total_hours: task.total_hours + data.hours,
        total_cost: (task.total_hours + data.hours) * task.cost_rate
      })
      return entry
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] })
  })
}

export function useDeleteTimeEntry(taskId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (entryId: string) => {
      await db.delay()
      const task = db.getById<ProjectTask>('project_tasks', taskId)
      if (!task) throw new Error('Task not found')
      const entry = task.time_entries?.find((e) => e.id === entryId)
      db.update('project_tasks', taskId, {
        time_entries: (task.time_entries ?? []).filter((e) => e.id !== entryId),
        total_hours: Math.max(0, task.total_hours - (entry?.hours ?? 0))
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] })
  })
}

export function useCreateNote(taskId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      await db.delay()
      const task = db.getById<ProjectTask>('project_tasks', taskId)
      if (!task) throw new Error('Task not found')
      const note = { id: `note_${Date.now()}`, content, created_at: new Date().toISOString(), user_name: 'Demo User' }
      db.update('project_tasks', taskId, { notes: [...(task.notes ?? []), note] })
      return note
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] })
  })
}

export function useUpdateNote(taskId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ noteId, data }: { noteId: string; data: { content: string } }) => {
      await db.delay()
      const task = db.getById<ProjectTask>('project_tasks', taskId)
      if (!task) throw new Error('Task not found')
      db.update('project_tasks', taskId, {
        notes: (task.notes ?? []).map((n) => (n.id === noteId ? { ...n, ...data } : n))
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] })
  })
}

export function useDeleteNote(taskId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (noteId: string) => {
      await db.delay()
      const task = db.getById<ProjectTask>('project_tasks', taskId)
      if (!task) throw new Error('Task not found')
      db.update('project_tasks', taskId, {
        notes: (task.notes ?? []).filter((n) => n.id !== noteId)
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] })
  })
}

export function useUploadTaskFile(taskId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (file: File) => {
      await db.delay()
      const task = db.getById<ProjectTask>('project_tasks', taskId)
      if (!task) throw new Error('Task not found')
      const newFile = { id: `file_${Date.now()}`, original_name: file.name, size: file.size, mime_type: file.type, storage_path: `/mock/${file.name}` }
      db.update('project_tasks', taskId, { files: [...(task.files ?? []), newFile] })
      return newFile
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] })
  })
}

export function useDeleteTaskFile(taskId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (fileId: string) => {
      await db.delay()
      const task = db.getById<ProjectTask>('project_tasks', taskId)
      if (!task) throw new Error('Task not found')
      db.update('project_tasks', taskId, {
        files: (task.files ?? []).filter((f) => f.id !== fileId)
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] })
  })
}

// ---------------------------------------------------------------------------
// Assignment hooks
// ---------------------------------------------------------------------------

export function useProjectAssignments(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId, 'assignments'],
    queryFn: async () => {
      await db.delay()
      return db.query<ProjectAssignment>('project_assignments', (a) => a.project_id === projectId)
    },
    enabled: !!projectId
  })
}

export function useProjectWorkers(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId, 'workers'],
    queryFn: async () => {
      await db.delay()
      const assignments = db.query<ProjectAssignment>('project_assignments', (a) => a.project_id === projectId)
      return assignments.map((a) => ({
        worker_id: a.worker_id,
        worker_name: a.worker_name,
        worker_email: a.worker_email ?? ''
      }))
    },
    enabled: !!projectId
  })
}

export function useCreateAssignment(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<ProjectAssignment>) => {
      await db.delay()
      return db.create<ProjectAssignment>('project_assignments', { ...data, project_id: projectId })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] })
  })
}

export function useDeleteAssignment(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (assignmentId: string) => {
      await db.delay()
      db.remove('project_assignments', assignmentId)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects', projectId] })
  })
}
