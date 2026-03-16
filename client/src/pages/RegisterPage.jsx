import React from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await registerUser({ name, email, password });

      login({
        token: data.token,
        user: data.user,
      });

      nav('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-wide text-[#0056A4]/70">
            Coop Retail Media
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Create user
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Create an account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0056A4] focus:ring-2 focus:ring-[#0056A4]/20"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0056A4] focus:ring-2 focus:ring-[#0056A4]/20"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0056A4] focus:ring-2 focus:ring-[#0056A4]/20"
              required
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#0056A4] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#004785] disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create user'}
          </button>
        </form>
      </div>
    </div>
  );
}