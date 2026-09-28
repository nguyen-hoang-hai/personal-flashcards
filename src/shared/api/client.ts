export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(path, {
    ...options,
    headers,
    credentials: 'include', // essential for cookies
  });

  if (response.status === 401 && !path.startsWith('/api/auth/')) {
    // Session expired or unauthenticated -> redirect to login
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  const data: any = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error: any = new Error(data.error || data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data as T;
}
