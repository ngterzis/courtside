import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, TrendingUp, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/games', label: 'Games', icon: ClipboardList, end: false },
  { to: '/trends', label: 'Trends', icon: TrendingUp, end: false },
  { to: '/archetype', label: 'Role', icon: User, end: false },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/95 backdrop-blur lg:hidden pb-safe">
      <ul className="grid grid-cols-4">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium',
                  isActive ? 'text-primary' : 'text-ink-70',
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
