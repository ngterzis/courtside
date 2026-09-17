export function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-[50vh] items-center justify-center"
    >
      <div className="h-8 w-8 animate-pulse rounded-full bg-primary/30" />
    </div>
  );
}
