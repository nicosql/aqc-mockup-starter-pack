import { authApi, type AuthSession } from '@/services/api-auth'
import { useQuery } from '@tanstack/react-query'

export function useMe() {
  return useQuery<AuthSession>({
    queryKey: ['me'],
    queryFn: () => authApi.getSession(),
    staleTime: Infinity
  })
}
