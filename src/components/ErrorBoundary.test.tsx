import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

function Boom({ explode }: { explode: boolean }) {
  if (explode) throw new Error('kaboom');
  return <p>All good</p>;
}

describe('ErrorBoundary', () => {
  it('shows a recovery screen instead of a blank page when a child throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Boom explode />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
  });

  it('clears the error when the reset key changes, e.g. after navigating', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { rerender } = render(
      <ErrorBoundary resetKey="/trends">
        <Boom explode />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();

    rerender(
      <ErrorBoundary resetKey="/games">
        <Boom explode={false} />
      </ErrorBoundary>,
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('All good')).toBeInTheDocument();
  });
});
