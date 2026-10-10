import { RouteBoundary } from './RouteBoundary';

export function AuthLayout() {
  return (
    <div className="flex min-h-full items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <RouteBoundary />
      </div>
    </div>
  );
}
