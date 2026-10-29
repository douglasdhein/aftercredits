import { type ReactNode, useState } from 'react';
import type { LoginResponse } from '../../types/auth';
import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from '../../utils/authStorage';
import { AuthContext } from './context';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<LoginResponse | null>(() =>
    getAuthSession(),
  );

  function login(newSession: LoginResponse, rememberMe: boolean) {
    saveAuthSession(newSession, rememberMe);
    setSession(newSession);
  }

  function logout() {
    clearAuthSession();
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: session !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
