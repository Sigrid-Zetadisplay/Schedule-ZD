import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

const theme = {
  primary: '#0056A4',
  primaryDark: '#004785',
  background: '#f4f7fb',
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/', { replace: true });
  }

  return (
    <div
      className="min-h-screen grid grid-cols-[240px_1fr]"
      style={{ backgroundColor: theme.background }}
    >
      <aside
        className="flex flex-col border-r border-white/10"
        style={{
          background: `linear-gradient(180deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
        }}
      >
        <div className="border-b border-white/15 px-5 py-5">
          <p className="text-xs uppercase tracking-wide text-white/70">
            Coop Retail Media
          </p>
          <h2 className="mt-1 text-xl font-semibold text-white">
            Schedule App
          </h2>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          <NavItem to="/dashboard" label="Dashboard" />
          <NavItem to="/orders" label="Orders" />
          <NavItem to="/tasks" label="Tasks" />
          <NavItem to="/calendar" label="Calendar" />
          <NavItem to="/info" label="Info" />
          <NavItem to="/reports" label="Reports" />
        </nav>

        <div className="border-t border-white/15 px-4 py-4 text-xs text-white/75">
          <div>Logged in as: {user?.name || user?.email || 'you'}</div>
          <div className="mt-2 inline-block rounded-full border border-white/20 bg-white/10 px-2 py-1">
            Internal tool
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'block rounded-xl px-4 py-3 text-sm font-medium transition',
          isActive
            ? 'bg-white text-[#0056A4] shadow-sm'
            : 'text-white/90 hover:bg-white/10 hover:text-white',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  );
}