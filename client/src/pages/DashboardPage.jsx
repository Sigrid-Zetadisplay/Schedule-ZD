import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getSummary, getOrders, getTasks } from "../api";
import OrdersCalendar from "../OrdersCalendar";

export default function DashboardPage() {
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

  return (
    <div>
      <h1>Dashboard</h1>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "1rem",
          margin: "1rem 0",
        }}
      >
        <Card title="Upcoming">{summary?.upcoming ?? "—"}</Card>
        <Card title="Current">{summary?.current ?? "—"}</Card>
        <Card title="Recently Expired (30d)">
          {summary?.expiredRecent ?? "—"}
        </Card>
        <Card title="Current SOV Total">{summary?.sovCurrent ?? 0}</Card>
      </section>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}
      >
        <Panel title="Current Campaigns">
          <List
            items={current}
            render={(o) => (
              <li key={o._id}>
                <strong>{o.title}</strong> — {o.client} ({o.sov} SOV)
              </li>
            )}
          />
        </Panel>

        <Panel title="Recently Expired (last 30d)">
          <List
            items={recent}
            render={(o) => (
              <li key={o._id}>
                <strong>{o.title}</strong> — {o.client}
              </li>
            )}
          />
        </Panel>

        <Panel title="Open Tasks">
          <List
            items={dueSoon}
            render={(t) => (
              <li key={t._id}>
                <strong>{t.title}</strong>{" "}
                {t.due ? "— due " + new Date(t.due).toLocaleDateString() : ""}
              </li>
            )}
          />
        </Panel>
      </div>
      <div className="" style={{ margin: "2rem" }}>
        <h3>Calendar</h3>
        <div className="dashboard-calendar">
          <OrdersCalendar
            initialView="timeGridWeek"
            height="60vh" // taller; CSS can override on small screens
            bucket="current"
          />
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={{ padding: "1rem", border: "1px solid #eee", borderRadius: 8 }}>
      <div style={{ fontSize: 12, color: "#666" }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 600 }}>{children}</div>
    </div>
  );
}
function Panel({ title, children }) {
  return (
    <div>
      <h3>{title}</h3>
      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 8,
          padding: "0.75rem",
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
