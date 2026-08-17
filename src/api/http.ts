import { readSession } from './session';

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api';

let unauthorizedHandler: (() => void) | null = null;

/**
 * Registered by AuthProvider. Fires when the API rejects a token we actually
 * sent, so an expired session is dropped instead of silently failing requests.
 */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

export class ApiError extends Error {
  status: number;
  /** Field-level messages when the server returns a ModelState validation object. */
  fieldErrors?: Record<string, string[]>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

interface ProblemDetails {
  title?: string;
  errors?: Record<string, string[]>;
}

async function parseError(res: Response): Promise<ApiError> {
  const contentType = res.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const body = (await res.json().catch(() => null)) as ProblemDetails | string | null;

    // ModelState / ProblemDetails validation object -> flatten field errors.
    if (body && typeof body === 'object' && 'errors' in body && body.errors) {
      const first = Object.values(body.errors).flat()[0];
      return new ApiError(res.status, first ?? body.title ?? 'Validation failed', body.errors);
    }
    if (typeof body === 'string' && body.length > 0) {
      return new ApiError(res.status, body);
    }
    if (body && typeof body === 'object' && body.title) {
      return new ApiError(res.status, body.title);
    }
  } else {
    // Plain-string message (our ValidationException path) or empty.
    const text = await res.text().catch(() => '');
    if (text) return new ApiError(res.status, text);
  }

  return new ApiError(res.status, `Request failed (${res.status})`);
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = readSession()?.token;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Only a rejected token means the session died — a 401 from /login with no
  // token attached is just bad credentials.
  if (res.status === 401 && token) {
    unauthorizedHandler?.();
  }

  if (!res.ok) {
    throw await parseError(res);
  }

  // 204 No Content (updates/deletes) -> nothing to parse.
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export const http = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  del: <T>(path: string) => request<T>('DELETE', path),
};
