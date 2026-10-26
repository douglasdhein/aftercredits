import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL;

interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

async function getErrorMessage(
  response: Response,
  fallbackMessage: string,
): Promise<string> {
  try {
    const data: ApiErrorResponse = await response.json();

    if (data.message) {
      return data.message;
    }

    if (data.errors) {
      const firstError = Object.values(data.errors)[0]?.[0];

      if (firstError) {
        return firstError;
      }
    }
  } catch {
    return fallbackMessage;
  }

  return fallbackMessage;
}

export async function registerUser(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Failed to register user.',
    );

    throw new Error(message);
  }

  return response.json();
}

export async function loginUser(
  data: LoginRequest,
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Failed to login.',
    );

    throw new Error(message);
  }

  return response.json();
}