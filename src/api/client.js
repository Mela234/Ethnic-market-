import Constants from 'expo-constants';

/**
 * Base URL resolution.
 *
 * A phone running Expo Go can't reach "localhost" — that resolves to the phone
 * itself, not your Mac. Expo already knows your dev machine's LAN IP (it's how
 * the JS bundle gets to the phone), so we reuse that host and swap in the API
 * port. iOS simulator works either way; a physical device needs this.
 *
 * Override with EXPO_PUBLIC_API_URL when you point at a deployed backend.
 */
const API_PORT = 8000;

function resolveBaseUrl() {
  const override = process.env.EXPO_PUBLIC_API_URL;
  if (override) return override.replace(/\/$/, '');

  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    Constants.manifest?.debuggerHost;

  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:${API_PORT}`;
  }
  return `http://localhost:${API_PORT}`;
}

export const BASE_URL = resolveBaseUrl();

// The token the request helper attaches. AuthContext owns the lifecycle and
// mirrors it into secure storage; this is just the in-memory copy.
let authToken = null;
export const setToken = (t) => { authToken = t; };
export const getToken = () => authToken;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth && authToken) headers.Authorization = `Bearer ${authToken}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Network-level failure: server down, wrong IP, phone on another network.
    throw new ApiError(`Can't reach the server at ${BASE_URL}`, 0);
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    // FastAPI puts the message in `detail`. Pydantic validation errors make it
    // a list of objects, so flatten those into something readable.
    const detail = data?.detail;
    const message = Array.isArray(detail)
      ? detail.map((d) => d.msg).join(', ')
      : detail || `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }
  return data;
}

/* ------------------------------- auth ------------------------------- */

/** 201 on success. 409 if the phone is already registered. */
export function register({ phone, password, name, email }) {
  return request('/auth/register', {
    method: 'POST',
    body: { phone, password, name, email },
  });
}

/** 401 on bad credentials. */
export function login({ phone, password }) {
  return request('/auth/login', {
    method: 'POST',
    body: { phone, password },
  });
}

/** 401 if the token is missing, expired, or the user is gone. */
export function fetchMe() {
  return request('/auth/me', { auth: true });
}
