/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "true" serves the API from src/mocks via MSW (see .env.mock) */
  readonly VITE_MOCK_API?: string;
}
