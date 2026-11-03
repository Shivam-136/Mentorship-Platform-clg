// Centralized HTTP API Client for future Node.js, Express, and MongoDB backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export class ApiError extends Error {
  constructor(message, status = 500, errors = null, isNetworkError = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.isNetworkError = isNetworkError;
  }
}

/**
 * Execute standard HTTP request with headers, JSON serialization, and structured error handling.
 */
export async function request(endpoint, options = {}) {
  const {
    method = 'GET',
    body = null,
    token = null,
    headers = {},
    ...customConfig
  } = options;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...headers,
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config = {
    method,
    headers: defaultHeaders,
    ...customConfig,
  };

  if (body && method !== 'GET' && method !== 'HEAD') {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);

    // Parse JSON if available
    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        (typeof data === 'object' && (data?.message || data?.error)) ||
        `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data?.errors || null, false);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network disconnection or backend server unreachable
    const isNetworkError =
      error.name === 'TypeError' ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('NetworkError');

    throw new ApiError(
      isNetworkError
        ? 'Backend service is unreachable. Ensure the backend server is running.'
        : error.message || 'An unexpected error occurred.',
      0,
      null,
      isNetworkError
    );
  }
}

export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
};

export default apiClient;

