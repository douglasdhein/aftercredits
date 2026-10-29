import type { LoginResponse } from '../types/auth';

const AUTH_STORAGE_KEY = 'aftercredits-auth';

export function saveAuthSession(
  session: LoginResponse,
  rememberMe: boolean,
) {
  clearAuthSession();

  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify(session),
  );
}

export function getAuthSession(): LoginResponse | null {
  const storedSession =
    localStorage.getItem(AUTH_STORAGE_KEY) ??
    sessionStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession) as LoginResponse;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function getAuthToken(): string | null {
  return getAuthSession()?.token ?? null;
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}