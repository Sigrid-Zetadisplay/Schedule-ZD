// client/src/Layout.jsx
import React from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import './styles/layout.css';

export default function Layout() {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', minHeight:'100vh' }}>
      <aside style={{ padding:'1rem', borderRight:'1px solid #eee' }}>
        <h2>Schedule App</h2>
        <nav style={{ display:'grid', gap:'0.5rem', marginTop:'1rem' }}>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          <NavLink to="/tasks">Tasks</NavLink>
          <NavLink to="/calendar">Calendar</NavLink> {/* <-- add */}
        </nav>
      </aside>
      <main style={{ padding:'1rem 1.5rem' }}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/calendar" element={<CalendarPage />} /> {/* <-- add */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}
