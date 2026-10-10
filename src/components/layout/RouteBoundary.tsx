import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';
import { PageLoader } from '../PageLoader';

// Renders the matched route with a loading state while its code chunk downloads, and an
// error screen if it crashes. Navigation stays usable; moving to another route clears it.
export function RouteBoundary() {
  const { pathname } = useLocation();

  return (
    <ErrorBoundary resetKey={pathname}>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  );
}
