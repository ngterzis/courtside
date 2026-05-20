import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import DashboardRoute from './routes/dashboard';
import LoginRoute from './routes/login';
import OnboardingRoute from './routes/onboarding';
import ArchetypeRoute from './routes/archetype';
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
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/onboarding" element={<OnboardingRoute />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardRoute />} />
          <Route path="/archetype" element={<ArchetypeRoute />} />
          <Route path="/games" element={<GamesRoute />} />
          <Route path="/games/:gameId" element={<GameDetailRoute />} />
          <Route path="/trends" element={<TrendsRoute />} />
          <Route path="/chat" element={<ChatRoute />} />
          <Route path="/notifications" element={<NotificationsRoute />} />
          <Route path="/settings" element={<SettingsRoute />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </QueryClientProvider>
  );
}
