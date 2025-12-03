// client/src/Layout.jsx
import React from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';

export default function Layout() {
  return (
    <div className="min-h-screen grid grid-cols-[220px_1fr] bg-slate-50">
      {/* Sidebar */}
      <aside className="border-r border-gray-200 bg-white flex flex-col">
        <div className="px-4 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            Schedule App
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Flytoget campaigns & tasks
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          <NavItem to="/dashboard" label="Dashboard" />
          <NavItem to="/orders" label="Orders" />
          <NavItem to="/tasks" label="Tasks" />
          <NavItem to="/calendar" label="Calendar" />
        </nav>

        <div className="px-4 py-3 border-t border-gray-100 text-[11px] text-gray-400">
          <div>Logged in as: you</div>
          <div className="mt-1">
            <span className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[11px] text-blue-700 border border-blue-100">
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
            ? 'bg-blue-600 text-white font-medium shadow-sm'
            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700',
        ].join(' ')
      }
    >
      <span className="truncate">{label}</span>
    </NavLink>
  );
}
