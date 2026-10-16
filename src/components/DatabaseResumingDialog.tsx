import { Loader2 } from 'lucide-react';
import { useDatabaseResuming } from '@/lib/dbResuming';

// Shown while a request is waiting for Aurora to wake from auto-pause.
export function DatabaseResumingDialog() {
  const resuming = useDatabaseResuming();
  if (!resuming) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="db-resuming-title"
        aria-describedby="db-resuming-description"
        className="w-full max-w-sm rounded-md border border-ink/10 bg-white p-6 text-center shadow-card"
      >
        <Loader2 aria-hidden="true" className="mx-auto h-8 w-8 animate-spin text-primary" />
        <h2 id="db-resuming-title" className="mt-4 text-lg font-bold tracking-tight">
          Waking up Courtside
        </h2>
        <p id="db-resuming-description" aria-live="polite" className="mt-2 text-sm text-ink-70">
          This usually takes under 30 seconds.
        </p>
      </div>
    </div>
  );
}
