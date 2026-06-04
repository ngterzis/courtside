import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { clearToken } from '@/lib/auth';

export default function SettingsRoute() {
  const navigate = useNavigate();

  function handleSignOut() {
    clearToken();
    navigate('/login', { replace: true });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8 lg:py-8">
      <h1 className="mb-6 text-xl font-bold tracking-tight lg:text-2xl">Settings</h1>
      <div className="rounded-md border border-ink/10 bg-card shadow-card">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-4 py-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
