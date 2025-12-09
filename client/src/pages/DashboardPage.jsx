import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getSummary, getOrders, getTasks } from "../api";
import OrdersCalendar from "../OrdersCalendar";
import { useCustomer, CUSTOMER_THEMES } from "../context/CustomerContext";

const SECTIONS = [
  { key: "orders", label: "Orders" },
  { key: "tasks", label: "Tasks" },
  { key: "calendar", label: "Calendar" },
  { key: "info", label: "Info" },
];

export default function DashboardPage() {
  const { theme, customerLabel, customerKey, setCustomerKey } = useCustomer();
  const [activeSection, setActiveSection] = React.useState("orders");

  const { data: summary } = useQuery({
    queryKey: ["summary"],
    queryFn: getSummary,
  });
  const { data: current } = useQuery({
    queryKey: ["orders", "current"],
    queryFn: () => getOrders({ bucket: "current", limit: 50 }),
  });
  const { data: recent } = useQuery({
    queryKey: ["orders", "recent"],
    queryFn: () => getOrders({ bucket: "recent", limit: 20 }),
  });
  const { data: dueSoon } = useQuery({
    queryKey: ["tasks", "due"],
    queryFn: () => getTasks({ status: "open", limit: 50 }),
  });

  // Filter orders/tasks by active customer label if they have a .client field
  const currentForCustomer = React.useMemo(() => {
    if (!current) return current;
    return current.filter((o) => !o.client || o.client === customerLabel);
  }, [current, customerLabel]);

  const recentForCustomer = React.useMemo(() => {
    if (!recent) return recent;
    return recent.filter((o) => !o.client || o.client === customerLabel);
  }, [recent, customerLabel]);

  const tasksForCustomer = React.useMemo(() => {
    if (!dueSoon) return dueSoon;
    const anyHasClient = dueSoon.some((t) => t.client);
    if (!anyHasClient) return dueSoon;
    return dueSoon.filter((t) => !t.client || t.client === customerLabel);
  }, [dueSoon, customerLabel]);

  return (
    <div>
      <header style={{ marginBottom: "1rem" }}>
        <h1 style={{ margin: 0, color: theme.primary }}>Dashboard</h1>
        <p style={{ margin: "0.25rem 0", color: theme.muted }}>
          Customer overview – {customerLabel}
        </p>
      </header>

      {/* Customer selector (duplicate of sidebar, but visible here too) */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        {Object.values(CUSTOMER_THEMES).map((c) => {
          const isActive = c.key === customerKey;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setCustomerKey(c.key)}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: 999,
                border: isActive ? `2px solid ${c.primary}` : "1px solid #ddd",
                background: isActive ? c.primary : "#ffffff",
                color: isActive ? "#ffffff" : "#333333",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Section selector */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {SECTIONS.map((section) => {
          const isActive = section.key === activeSection;
          return (
            <button
              key={section.key}
              type="button"
              onClick={() => setActiveSection(section.key)}
              style={{
                padding: "0.4rem 0.9rem",
                borderRadius: 999,
                border: isActive
                  ? `2px solid ${theme.primary}`
                  : `1px solid ${theme.border}`,
                background: isActive ? theme.primary : theme.cardBg,
                color: isActive ? "#ffffff" : "#333333",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {section.label}
            </button>
          );
        })}
      </div>

      {/* INFO SECTION */}
      {activeSection === "info" && (
        <>
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "1rem",
              margin: "1rem 0",
            }}
          >
            <Card title="Upcoming" theme={theme}>
              {summary?.upcoming ?? "—"}
            </Card>
            <Card title="Current" theme={theme}>
              {summary?.current ?? "—"}
            </Card>
            <Card title="Recently Expired (30d)" theme={theme}>
              {summary?.expiredRecent ?? "—"}
            </Card>
            <Card title="Current SOV Total" theme={theme}>
              {summary?.sovCurrent ?? 0}
            </Card>
          </section>
        </>
      )}

      {/* ORDERS SECTION */}
      {activeSection === "orders" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
          }}
        >
          <Panel title="Current Campaigns" theme={theme}>
            <List
              items={currentForCustomer}
              render={(o) => (
                <li key={o._id}>
                  <strong>{o.title}</strong>{" "}
                  <span style={{ color: theme.muted }}>
                    — {o.client} ({o.sov} SOV)
                  </span>
                </li>
              )}
            />
          </Panel>

          <Panel title="Recently Expired (last 30d)" theme={theme}>
            <List
              items={recentForCustomer}
              render={(o) => (
                <li key={o._id}>
                  <strong>{o.title}</strong>{" "}
                  <span style={{ color: theme.muted }}>— {o.client}</span>
                </li>
              )}
            />
          </Panel>
        </div>
      )}

      {/* TASKS SECTION */}
      {activeSection === "tasks" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2rem",
          }}
        >
          <Panel title="Open Tasks" theme={theme}>
            <List
              items={tasksForCustomer}
              render={(t) => (
                <li key={t._id}>
                  <strong>{t.title}</strong>{" "}
                  {t.client && (
                    <span style={{ color: theme.muted }}>({t.client}) </span>
                  )}
                  {t.due
                    ? "— due " +
                      new Date(t.due).toLocaleDateString()
                    : ""}
                </li>
              )}
            />
          </Panel>
        </div>
      )}

      {/* CALENDAR SECTION */}
      {activeSection === "calendar" && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Calendar</h3>
          <div className="dashboard-calendar">
            <OrdersCalendar
              initialView="timeGridWeek"
              height="60vh"
              bucket="current"
              client={customerLabel} // filter by active customer
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ title, children, theme }) {
  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid #eee",
        borderRadius: 8,
        background: theme.cardBg,
      }}
    >
      <div style={{ fontSize: 12, color: theme.muted }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 600 }}>{children}</div>
    </div>
  );
}

function Panel({ title, children, theme }) {
  return (
    <div>
      <h3 style={{ color: theme.primary }}>{title}</h3>
      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 8,
          padding: "0.75rem",
          background: theme.cardBg,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function List({ items, render }) {
  if (!items) return <div>Loading…</div>;
  if (!items.length) return <div>No items</div>;
  return (
    <ul style={{ margin: 0, paddingLeft: "1rem" }}>{items.map(render)}</ul>
  );
}
