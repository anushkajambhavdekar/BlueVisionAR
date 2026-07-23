export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export function resolveApiUrl(path: string): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, init);
  if (!res.ok) {
    const text = await res.text();
    let message = text || `Request failed: ${res.status}`;
    try {
      const parsed = JSON.parse(text);
      message = parsed?.error || parsed?.message || message;
    } catch {
      // Keep plain text message when response is not JSON.
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}
