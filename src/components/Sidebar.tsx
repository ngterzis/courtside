import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  ClipboardList,
  TrendingUp,
  User,
  MessageSquare,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { JerseyAvatar } from './JerseyAvatar';
import { useMe } from '@/lib/queries';
import { clearToken } from '@/lib/auth';

const items = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/games', label: 'Game log', icon: ClipboardList, end: false },
  { to: '/trends', label: 'Trends', icon: TrendingUp, end: false },
  { to: '/archetype', label: 'My role', icon: User, end: false },
  { to: '/chat', label: 'Chat', icon: MessageSquare, end: false },
  { to: '/settings', label: 'Settings', icon: Settings, end: false },
];

export function Sidebar() {
  const { data: me } = useMe();
  const navigate = useNavigate();

  function handleSignOut() {
    clearToken();
    navigate('/login', { replace: true });
  }

  return (
    <aside className="hidden lg:flex lg:w-[220px] lg:flex-col lg:shrink-0 lg:border-r lg:border-ink/10 lg:bg-paper-deep">
      <div className="px-5 py-6">
        <div className="text-2xl font-bold tracking-tight text-ink">
          courtside<span className="text-primary">.</span>
        </div>
      </div>
      <nav className="flex-1 px-3">
        <ul className="flex flex-col gap-1">
          {items.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : 'text-ink-70 hover:bg-ink/5 hover:text-ink',
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {me && (
        <div className="mt-auto border-t border-ink/10 p-4">
          <div className="flex items-center gap-3">
            <JerseyAvatar number={me.jerseyNumber} size={36} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{me.name}</div>
              <div className="truncate text-xs text-ink-70">
                {me.position} · #{me.jerseyNumber}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              aria-label="Sign out"
              className="rounded-md p-1.5 text-ink-70 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
