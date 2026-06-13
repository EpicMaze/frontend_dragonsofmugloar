import { QueryClient, QueryCache, MutationCache } from '@tanstack/vue-query'

export function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        console.error('Query error:', error)
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        console.error('Mutation error:', error)
      },
    }),
    defaultOptions: {
      queries: {
        retry: (failureCount, error: any) => {
          if ([400, 404, 410].includes(error?.response?.status)) return false
          return failureCount < 3
        },
        staleTime: 0,
      },
    },
  })
}
