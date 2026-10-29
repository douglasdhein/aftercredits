import { createContext } from 'react';
import type { LoginResponse } from '../../types/auth';

export interface AuthContextValue {
  session: LoginResponse | null;
  isAuthenticated: boolean;
  login: (session: LoginResponse, rememberMe: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);