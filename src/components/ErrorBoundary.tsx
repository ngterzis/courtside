import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  /** When this value changes (e.g. the route), a caught error is cleared. */
  resetKey?: unknown;
}

interface State {
  error: Error | null;
}

// Catches render errors so one broken screen shows a message instead of a blank page.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled render error', error, info.componentStack);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div role="alert" className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-xl font-bold tracking-tight">Something went wrong</h1>
        <p className="mt-2 text-sm text-ink-70">
          This page hit an unexpected error. Try reloading, or head back to your dashboard.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button onClick={() => window.location.reload()}>Reload</Button>
          <Button variant="outline" onClick={() => window.location.assign('/')}>
            Go to dashboard
          </Button>
        </div>
      </div>
    );
  }
}
