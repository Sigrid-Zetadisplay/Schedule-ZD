import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getOrders, getTasks } from "../api";

import { CUSTOMER_THEMES } from "../context/CustomerContext";

export default function DashboardPage() {
  const { customerKey } = useParams();

  const customer = CUSTOMER_THEMES[customerKey] || CUSTOMER_THEMES.flytoget;
  const theme = customer;

  // Current campaigns
  const { data: current } = useQuery({
    queryKey: ["orders", customerKey, "current"],
    queryFn: () => getOrders({ bucket: "current", customerKey, limit: 50 }),
  });

  // Recently expired (we'll filter to last 5 days)
  const { data: recent } = useQuery({
    queryKey: ["orders", customerKey, "recent"],
    queryFn: () => getOrders({ bucket: "recent", customerKey, limit: 100 }),
  });

  // Open tasks
  const { data: openTasks } = useQuery({
    queryKey: ["tasks", customerKey, "open"],
    queryFn: () => getTasks({ status: "open", customerKey, limit: 50 }),
  });

  const recentLast5Days = React.useMemo(() => {
    if (!recent) return recent;

    const now = Date.now();
    const fiveDaysMs = 5 * 24 * 60 * 60 * 1000;

    return recent
      .filter((o) => {
        // Prefer an explicit field if you have it (e.g. o.end / o.endsAt)
        const dateStr = o.end || o.endsAt || o.updatedAt || o.createdAt;
        if (!dateStr) return false;

        const t = new Date(dateStr).getTime();
        if (Number.isNaN(t)) return false;

        return now - t <= fiveDaysMs;
      })
      .slice(0, 20); // keep list tidy
  }, [recent]);

  return (
    <div>
      <header style={{ marginBottom: "1rem" }}>
        <h1 style={{ margin: 0, color: theme.primary }}>Dashboard</h1>
        <p style={{ margin: "0.25rem 0", color: theme.muted }}>
          {customer.label}
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        {/* Full-width tasks row */}
        <div style={{ gridColumn: "1 / -1" }}>
          <Panel title="Current Campaigns" theme={theme}>
            <List
              items={current}
              render={(o) => (
                <li key={o._id}>
                  <strong>{o.title || "Campaign"}</strong>{" "}
                  {o.sov != null && (
                    <span style={{ color: theme.muted }}>({o.sov} SOV)</span>
                  )}
                  {o.start && (
                    <div style={{ fontSize: 12, color: theme.muted }}>
                      {fmtDate(o.start)} → {o.end ? fmtDate(o.end) : "—"}
                    </div>
                  )}
                </li>
              )}
            />
          </Panel>
        </div>

        <Panel title="Open Tasks" theme={theme}>
          <List
            items={openTasks}
            render={(t) => (
              <li key={t._id}>
                <strong>{t.title}</strong>{" "}
                {t.due ? (
                  <span style={{ color: theme.muted }}>
                    — due {fmtDate(t.due)}
                  </span>
                ) : (
                  <span style={{ color: theme.muted }}>— no due date</span>
                )}
              </li>
            )}
          />
        </Panel>

        <Panel title="Recently Expired (last 5 days)" theme={theme}>
          <List
            items={recentLast5Days}
            render={(o) => (
              <li key={o._id}>
                <strong>{o.title || "Campaign"}</strong>
                {(o.end || o.endsAt) && (
                  <span style={{ color: theme.muted }}>
                    {" "}
                    — ended {fmtDate(o.end || o.endsAt)}
                  </span>
                )}
              </li>
            )}
          />
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, children, theme }) {
  return (
    <div>
      <h3 style={{ color: theme.primary, marginTop: 0 }}>{title}</h3>
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

function fmtDate(d) {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return "";
  }
}
