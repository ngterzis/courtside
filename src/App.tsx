import { lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PageLoader } from './components/PageLoader';
import { getToken } from './lib/auth';
import { useMe } from './lib/queries';

// Each screen is its own chunk, so the login page doesn't download the charting library
const DashboardRoute = lazy(() => import('./routes/dashboard'));
const LoginRoute = lazy(() => import('./routes/login'));
const OnboardingRoute = lazy(() => import('./routes/onboarding'));
const ArchetypeRoute = lazy(() => import('./routes/archetype'));
const ArchetypeHistoryRoute = lazy(() => import('./routes/archetype/history'));
const GamesRoute = lazy(() => import('./routes/games'));
const GameDetailRoute = lazy(() => import('./routes/games/detail'));
const TrendsRoute = lazy(() => import('./routes/trends'));
const ChatRoute = lazy(() => import('./routes/chat'));
const NotificationsRoute = lazy(() => import('./routes/notifications'));
const SettingsRoute = lazy(() => import('./routes/settings'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error: unknown) => {
        const status = (error as { status?: number })?.status;
        if (status === 401 || status === 404) return false;
        return failureCount < 2;
      },
    },
  },
});

function RedirectIfAuthed() {
  if (getToken()) return <Navigate to="/" replace />;
  return <Outlet />;
}

function RequireAuth() {
  if (!getToken()) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function RequireOnboarded() {
  const { data: me, isLoading } = useMe();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper">
        <PageLoader />
      </div>
    );
  }

  if (me && me.onboardedAt == null) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Last resort for errors outside a page, e.g. in the sidebar */}
      <ErrorBoundary>
        <Routes>
          {/* Public — redirect away if already logged in */}
          <Route element={<RedirectIfAuthed />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginRoute />} />
            </Route>
          </Route>

          {/* Auth required */}
          <Route element={<RequireAuth />}>
            {/* Onboarding — accessible before profile is complete */}
            <Route element={<AuthLayout />}>
              <Route path="/onboarding" element={<OnboardingRoute />} />
            </Route>

            {/* Main app — also requires onboarding to be done */}
            <Route element={<RequireOnboarded />}>
              <Route element={<AppLayout />}>
                <Route index element={<DashboardRoute />} />
                <Route path="/archetype" element={<ArchetypeRoute />} />
                <Route path="/archetype/history" element={<ArchetypeHistoryRoute />} />
                <Route path="/games" element={<GamesRoute />} />
                <Route path="/games/:gameId" element={<GameDetailRoute />} />
                <Route path="/trends" element={<TrendsRoute />} />
                <Route path="/chat" element={<ChatRoute />} />
                <Route path="/notifications" element={<NotificationsRoute />} />
                <Route path="/settings" element={<SettingsRoute />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
