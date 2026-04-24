import { useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ChatFab() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === '/chat') return null;

  return (
    <button
      onClick={() => navigate('/chat')}
      aria-label="Open AI chat"
      className={cn(
        'fixed z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-raised transition-transform hover:scale-105 active:scale-95',
        // mobile position: above bottom nav
        'bottom-[calc(68px+env(safe-area-inset-bottom,0px))] right-5',
        // desktop: nudge in from edge
        'lg:bottom-8 lg:right-8',
      )}
    >
      <MessageSquare className="h-6 w-6" />
    </button>
  );
}
