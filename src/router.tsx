import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  RouterProvider
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Spinner from './components/shared/spinner'
import PublicLayout from './layouts/public-layout'
import MarketingHomePage from './pages/marketing-home'
import NotFoundPage from './pages/not-found'
import ErrorPage from './pages/error'

interface RootContext {
  queryClient: QueryClient
}

// =============================================================================
// ROOT — bare shell, just renders <Outlet />
// =============================================================================

const rootRoute = createRootRouteWithContext<RootContext>()({
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage
})

// =============================================================================
// PUBLIC LAYOUT
// =============================================================================

const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public',
  component: PublicLayout
})

const homeRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/',
  component: MarketingHomePage,
  pendingComponent: Spinner
})

// =============================================================================
// ROUTE TREE
// =============================================================================

const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([homeRoute])
])

// =============================================================================
// ROUTER + PROVIDER
// =============================================================================

const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  context: { queryClient }
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function Router({
  devToolsEnabled
}: {
  devToolsEnabled?: boolean
}) {
  devToolsEnabled ??= process.env.NODE_ENV === 'development'

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {devToolsEnabled && (
        <>
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition='bottom-left'
          />
          <TanStackRouterDevtools router={router} position='bottom-right' />
        </>
      )}
    </QueryClientProvider>
  )
}
