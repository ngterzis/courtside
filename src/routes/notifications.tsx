import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Star, TrendingUp, MessageSquare, Repeat2 } from 'lucide-react';
import { useNotifications } from '@/lib/queries';
import { apiFetch } from '@/lib/api';
import type { Notification, NotificationType } from '@/types';

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const TYPE_META: Record<
  NotificationType,
  { icon: React.ComponentType<{ className?: string }>; label: string; color: string }
> = {
  personal_best: { icon: Star, label: 'Personal best', color: 'text-accent' },
  stats_ready: { icon: TrendingUp, label: 'Stats ready', color: 'text-primary' },
  coach_note: { icon: MessageSquare, label: 'Coach note', color: 'text-primary' },
  archetype_changed: { icon: Repeat2, label: 'Role update', color: 'text-ink-70' },
  weekly_summary: { icon: Bell, label: 'Weekly summary', color: 'text-ink-70' },
};

function NotificationRow({ notif, onRead }: { notif: Notification; onRead: (id: string) => void }) {
  const meta = TYPE_META[notif.type] ?? TYPE_META.stats_ready;
  const Icon = meta.icon;
  const unread = notif.readAt == null;

  return (
    <div
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors hover:bg-paper-deep/60 ${
        unread ? 'border-primary/20 bg-primary/5' : 'border-ink/10 bg-card'
      }`}
      onClick={() => unread && onRead(notif.id)}
    >
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border ${
          unread ? 'border-primary/20 bg-primary/10' : 'border-ink/10 bg-paper-deep'
        }`}
      >
        <Icon className={`h-4 w-4 ${meta.color}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className={`text-sm font-semibold ${unread ? 'text-ink' : 'text-ink-70'}`}>
            {meta.label}
          </span>
          <span className="flex-shrink-0 font-mono text-[10px] text-ink-50">
            {formatRelative(notif.createdAt)}
          </span>
        </div>
        {notif.payload && Object.keys(notif.payload).length > 0 && (
          <p className="mt-0.5 text-[12px] text-ink-70">
            {(notif.payload as { message?: string }).message ??
              JSON.stringify(notif.payload)}
          </p>
        )}
      </div>
      {unread && (
        <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
      )}
    </div>
  );
}

export default function NotificationsRoute() {
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useNotifications();

  const markRead = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/me/notifications/${id}/read`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6 lg:px-8">
        <div className="mb-6 h-6 w-40 animate-pulse rounded bg-paper-deep" />
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-16 animate-pulse rounded-xl bg-paper-deep" />
          ))}
        </div>
      </div>
    );
  }

  const items = notifications ?? [];
  const unreadCount = items.filter((n) => n.readAt == null).length;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 pt-4 lg:px-8 lg:pt-8">
      <div className="mb-5 lg:mb-6">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Notifications</h1>
        {unreadCount > 0 && (
          <p className="mt-0.5 text-sm text-ink-70">
            {unreadCount} unread — tap to dismiss
          </p>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink/15 py-16 text-center text-sm text-ink-50">
          You're all caught up.
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((n) => (
            <NotificationRow
              key={n.id}
              notif={n}
              onRead={(id) => markRead.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
