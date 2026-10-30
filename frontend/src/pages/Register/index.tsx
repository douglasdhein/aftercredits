import { type SubmitEvent, useState } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext/useAuth';
import { registerUser } from '../../services/authService';

export function Register() {
  const { isAuthenticated } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await registerUser({
        name,
        email,
        password,
      });

      setName('');
      setEmail('');
      setPassword('');

      setSuccessMessage('Account created successfully.');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to create account.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-xl border border-(--border) bg-(--surface) p-6 md:p-8">
        <h1 className="text-3xl font-light text-(--text-primary)">
          Create account
        </h1>

        <p className="mt-2 text-sm text-(--text-secondary)">
          Create your AfterCredits account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-(--text-primary)"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
              className="w-full rounded-lg border border-(--border-strong) bg-(--surface-secondary) px-3 py-2.5 text-(--text-primary) outline-none transition-colors placeholder:text-(--text-tertiary) focus:border-(--text-secondary)"
              placeholder="Your name"
            />
          </div>

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
              minLength={8}
              maxLength={100}
              autoComplete="new-password"
              className="w-full rounded-lg border border-(--border-strong) bg-(--surface-secondary) px-3 py-2.5 text-(--text-primary) outline-none transition-colors placeholder:text-(--text-tertiary) focus:border-(--text-secondary)"
              placeholder="At least 8 characters"
            />
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
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </section>
  );
}
