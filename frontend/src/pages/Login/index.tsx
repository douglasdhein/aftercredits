import { type SubmitEvent, useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext/useAuth';
import { loginUser } from '../../services/authService';

export function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await loginUser({
        email,
        password,
      });

      login(response, rememberMe);

      setPassword('');
      setSuccessMessage('Signed in successfully.');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to sign in.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-xl border border-(--border) bg-(--surface) p-6 md:p-8">
        <h1 className="text-3xl font-light text-(--text-primary)">
          Sign in to your account
        </h1>

        <p className="mt-2 text-sm text-(--text-secondary)">
          Welcome back to AfterCredits.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-(--text-primary)"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              maxLength={255}
              autoComplete="email"
              className="w-full rounded-lg border border-(--border-strong) bg-(--surface-secondary) px-3 py-2.5 text-(--text-primary) outline-none transition-colors placeholder:text-(--text-tertiary) focus:border-(--text-secondary)"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-(--text-primary)"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-(--border-strong) bg-(--surface-secondary) px-3 py-2.5 text-(--text-primary) outline-none transition-colors placeholder:text-(--text-tertiary) focus:border-(--text-secondary)"
              placeholder="Your password"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-(--text-secondary)">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 cursor-pointer"
              />
              Remember me
            </label>

            <button
              type="button"
              className="cursor-pointer text-sm font-medium text-(--text-secondary) transition-colors hover:text-(--text-primary)"
            >
              Forgot password?
            </button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {successMessage && (
            <p className="text-sm text-(--text-secondary)">{successMessage}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer rounded-lg border border-(--border-strong) bg-(--surface-hover) px-4 py-2.5 text-sm font-medium text-(--text-primary) transition-colors hover:bg-(--surface-secondary) disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-sm text-(--text-secondary)">
          Don&apos;t have an account yet?{' '}
          <Link
            to="/register"
            className="font-medium text-(--text-primary) transition-colors hover:text-(--text-secondary)"
          >
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}
