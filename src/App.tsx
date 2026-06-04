import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { getToken } from './lib/auth';
import { useMe } from './lib/queries';
import DashboardRoute from './routes/dashboard';
import LoginRoute from './routes/login';
import OnboardingRoute from './routes/onboarding';
import ArchetypeRoute from './routes/archetype';
import ArchetypeHistoryRoute from './routes/archetype/history';
import GamesRoute from './routes/games';
import GameDetailRoute from './routes/games/detail';
import TrendsRoute from './routes/trends';
import ChatRoute from './routes/chat';
import NotificationsRoute from './routes/notifications';
import SettingsRoute from './routes/settings';

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
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="h-8 w-8 animate-pulse rounded-full bg-primary/30" />
      </div>
    );
  }

  if (me && me.onboardedAt == null) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
