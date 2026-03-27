import * as db from '@/lib/mock-db'
import { useQuery } from '@tanstack/react-query'

export function useProjectRoles() {
  return useQuery({
    queryKey: ['project-roles'],
    queryFn: async () => {
      await db.delay()
      return db.getAll<{ id: string; name: string }>('project_roles')
    }
  })
}
