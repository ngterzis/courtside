import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

// jsdom doesn't implement scrollIntoView (used by the chat auto-scroll)
Element.prototype.scrollIntoView = () => {};
