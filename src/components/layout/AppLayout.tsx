import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import { BottomNav } from '../BottomNav';
import { ChatFab } from '../ChatFab';

export function AppLayout() {
  return (
    <div className="flex min-h-full bg-paper">
      <Sidebar />
      <main className="flex-1 pb-20 lg:pb-0">
        <Outlet />
      </main>
      <BottomNav />
      <ChatFab />
    </div>
  );
}
