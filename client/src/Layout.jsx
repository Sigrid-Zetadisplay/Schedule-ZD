// client/src/Layout.jsx
import React from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import { useCustomer, CUSTOMER_THEMES } from './context/CustomerContext';

export default function Layout() {
  const { theme, customerKey, customerLabel, setCustomerKey } = useCustomer();

  return (
    <div
      className="min-h-screen grid grid-cols-[220px_1fr]"
      style={{ backgroundColor: theme.background }}
    >
      {/* Sidebar */}
      <aside
        className="border-r border-gray-200 flex flex-col"
        style={{ backgroundColor: theme.primary, color: '#fff' }}
      >
        <div className="px-4 py-4 border-b border-white/20">
          <h2 className="text-xl font-semibold text-white">
            Schedule App
          </h2>
          <p className="text-xs text-white/80 mt-1">
            Active customer: {customerLabel}
          </p>
        </div>

        {/* Customer selector in sidebar */}
        <div className="px-3 pt-3 pb-2 text-[11px]">
          <div className="mb-1 font-semibold text-white/80">Customers</div>
          <div className="space-y-1">
            {Object.values(CUSTOMER_THEMES).map((c) => {
              const active = c.key === customerKey;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCustomerKey(c.key)}
                  className={
                    'w-full text-left rounded-md px-2 py-1 text-xs transition ' +
                    (active
                      ? 'bg-white/80 text-slate-900 font-semibold'
                      : 'bg-white/10 text-white hover:bg-white/20')
                  }
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1 text-sm">
          <NavItem to="/dashboard" label="Dashboard" />
          <NavItem to="/orders" label="Orders" />
          <NavItem to="/tasks" label="Tasks" />
          <NavItem to="/calendar" label="Calendar" />
        </nav>

        <div className="px-4 py-3 border-t border-white/15 text-[11px] text-white/80">
          <div>Logged in as: you</div>
          <div className="mt-1">
            <span className="inline-block rounded-full bg-white/20 px-2 py-0.5 text-[11px] border border-white/30">
              Internal tool
            </span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="p-4 md:p-6 overflow-y-auto">
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

// Small helper component for nav items
function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex items-center rounded-md px-3 py-2 transition-colors',
          'text-sm',
          isActive
            ? 'bg-white text-slate-900 font-medium shadow-sm'
            : 'text-white/90 hover:bg-white/10 hover:text-white',
        ].join(' ')
      }
    >
      <span className="truncate">{label}</span>
    </NavLink>
  );
}
