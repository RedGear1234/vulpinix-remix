/**
 * Central API base URL — reads from VITE_API_URL env var in production,
 * falls back to localhost for local development.
 */
export const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
