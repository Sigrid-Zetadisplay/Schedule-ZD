import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { loginUser } from "../api";

export default function LoginPage() {
  const nav = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  React.useEffect(() => {
    if (isAuthenticated) {
      nav("/dashboard", { replace: true });
    }
  }, [isAuthenticated, nav]);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      login({
        token: data.token,
        user: data.user,
      });

      nav(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in");
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
            Schedule App
          </h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              placeholder="you@coop.no"
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
              placeholder="••••••••"
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
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <div className="text-center text-sm mt-4">
            <a href="/register" className="text-blue-600 hover:underline">
              Create user
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
