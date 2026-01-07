import React from "react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { CUSTOMER_THEMES } from "./context/CustomerContext";

export default function Layout() {
  const nav = useNavigate();
  const { customerKey } = useParams();

  const customer = CUSTOMER_THEMES[customerKey] || CUSTOMER_THEMES.flytoget;
  const theme = customer;

  function switchCustomer(nextKey) {
    // Keep same section if possible (dashboard/orders/tasks/calendar)
    const currentPath = window.location.pathname.split("/").slice(2).join("/") || "dashboard";
    nav(`/${nextKey}/${currentPath}`);
  }

  return (
    <div
      className="min-h-screen grid grid-cols-[220px_1fr]"
      style={{ backgroundColor: theme.background }}
    >
      <aside
        className="border-r border-gray-200 flex flex-col"
        style={{ backgroundColor: theme.primary, color: "#fff" }}
      >
        <div className="px-4 py-4 border-b border-white/20">
          <h2 className="text-xl font-semibold text-white">Schedule App</h2>
          <p className="text-xs text-white/80 mt-1">
            Active customer: {customer.label}
          </p>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1 text-sm">
          <NavItem to={`/${customerKey}/dashboard`} label="Dashboard" />
          <NavItem to={`/${customerKey}/orders`} label="Orders" />
          <NavItem to={`/${customerKey}/tasks`} label="Tasks" />
          <NavItem to={`/${customerKey}/calendar`} label="Calendar" />
        </nav>

        <button
          className="mx-3 mb-3 rounded-md bg-white/15 hover:bg-white/25 px-3 py-2 text-sm"
          onClick={() => nav("/")}
        >
          ← Back to start
        </button>
      </aside>

      <main className="p-4 md:p-6 overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-end mb-4">
          <select
            value={customerKey}
            onChange={(e) => switchCustomer(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            {Object.values(CUSTOMER_THEMES).map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

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
          "flex items-center rounded-md px-3 py-2 transition-colors",
          "text-sm",
          isActive
            ? "bg-white text-slate-900 font-medium shadow-sm"
            : "text-white/90 hover:bg-white/10 hover:text-white",
        ].join(" ")
      }
    >
      <span className="truncate">{label}</span>
    </NavLink>
  );
}
