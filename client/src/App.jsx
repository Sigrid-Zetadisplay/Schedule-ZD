import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import StartPage from "./pages/StartPage";
import Layout from "./Layout";

import DashboardPage from "./pages/DashboardPage";
import OrdersPage from "./pages/OrdersPage";
import TasksPage from "./pages/TasksPage";
import CalendarPage from "./pages/CalendarPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />

      {/* Customer-scoped app */}
      <Route path="/:customerKey" element={<Layout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="calendar" element={<CalendarPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
