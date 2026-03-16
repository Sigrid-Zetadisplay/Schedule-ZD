// client/src/pages/DashboardPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function QuickCard({ title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group w-full rounded-2xl border border-slate-200 bg-white p-6 text-left
        shadow-sm transition hover:-translate-y-0.5 hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-[#0056A4]/20
      "
    >
      <div className="text-lg font-semibold text-slate-900">{title}</div>
      <div className="mt-2 text-sm text-slate-500 group-hover:text-slate-600">
        {subtitle}
      </div>
    </button>
  );
}

function InfoCard({ title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
      {subtitle && <div className="mt-1 text-xs text-slate-400">{subtitle}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const nav = useNavigate();

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#f4f7fb] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <section className="mb-10 rounded-3xl bg-gradient-to-r from-[#0056A4] to-[#3B82C4] px-8 py-10 text-white shadow-sm">
          <p className="text-sm uppercase tracking-wide text-white/75">
            Coop Retail Media
          </p>
          <h1 className="mt-2 text-4xl font-bold">Dashboard</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/85">
            Your internal workspace for campaign planning, task handling, calendar
            overview, reporting, and operational follow-up.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => nav('/orders')}
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#0056A4] transition hover:bg-slate-100"
            >
              View orders
            </button>

            <button
              type="button"
              onClick={() => nav('/tasks')}
              className="rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Open tasks
            </button>
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">Quick access</h2>
            <p className="text-sm text-slate-500">
              Jump straight to the section you need
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            <QuickCard
              title="Orders"
              subtitle="Manage campaigns and bookings"
              onClick={() => nav('/orders')}
            />
            <QuickCard
              title="Tasks"
              subtitle="Track follow-up and to-dos"
              onClick={() => nav('/tasks')}
            />
            <QuickCard
              title="Calendar"
              subtitle="See campaign activity by date"
              onClick={() => nav('/calendar')}
            />
            <QuickCard
              title="Info"
              subtitle="Notes, routines, and internal details"
              onClick={() => nav('/info')}
            />
            <QuickCard
              title="Reports"
              subtitle="Overview and reporting section"
              onClick={() => nav('/reports')}
            />
            <QuickCard
              title="Dashboard"
              subtitle="Current overview"
              onClick={() => nav('/dashboard')}
            />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Welcome</h2>
              <p className="text-sm text-slate-500">
                Your Coop scheduling and operations overview
              </p>
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <p>
                Use this dashboard as the main entry point for campaign planning,
                operational follow-up, order handling, reporting, and internal
                coordination.
              </p>
              <p>
                The other modules should keep the same visual direction, so the app
                feels like one connected product instead of separate pages.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <InfoCard title="Today" value={today} subtitle="Current date" />
            <InfoCard title="Workspace" value="Coop" subtitle="Retail Media" />
            <InfoCard title="Focus" value="Planning + Reporting" subtitle="Main workflow" />
          </div>
        </section>
      </div>
    </div>
  );
}