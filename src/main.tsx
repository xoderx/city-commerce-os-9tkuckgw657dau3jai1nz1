import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { ExplorerHub } from '@/pages/ExplorerHub';
import { ExperiencePage } from '@/pages/ExperiencePage';
import { PassportPage } from '@/pages/PassportPage';
import { PartnerDashboard } from '@/pages/PartnerDashboard';
import { AdminDashboard } from '@/pages/AdminDashboard';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/explore",
    element: <ExplorerHub />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/place/:id",
    element: <ExperiencePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/passport",
    element: <PassportPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/dashboard/partner",
    element: <PartnerDashboard />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/dashboard/admin",
    element: <AdminDashboard />,
    errorElement: <RouteErrorBoundary />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)