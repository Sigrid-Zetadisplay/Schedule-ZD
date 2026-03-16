// client/src/pages/StartPage.jsx
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
        focus:outline-none focus:ring-2 focus:ring-emerald-300
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

export default function StartPage() {
  const nav = useNavigate();

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <section className="mb-10 rounded-3xl bg-gradient-to-r from-emerald-800 to-emerald-600 px-8 py-10 text-white shadow-sm">
          <p className="text-sm uppercase tracking-wide text-white/75">
            Coop Retail Media
          </p>
          <h1 className="mt-2 text-4xl font-bold">Schedule App</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/85">
            Your internal workspace for campaign planning, task handling, calendar
            overview, and operational follow-up.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => nav('/dashboard')}
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-slate-100"
            >
              Open dashboard
            </button>

            <button
              type="button"
              onClick={() => nav('/orders')}
              className="rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              View campaigns
            </button>
          </div>
        </section>

        {/* Quick actions */}
        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">Quick access</h2>
            <p className="text-sm text-slate-500">
              Jump straight to the section you need
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <QuickCard
              title="Dashboard"
              subtitle="Overview of campaigns and tasks"
              onClick={() => nav('/dashboard')}
            />
            <QuickCard
              title="Orders"
              subtitle="Manage campaigns and bookings"
              onClick={() => nav('/orders')}
            />
            <QuickCard
              title="Tasks"
              subtitle="Track follow-up and operational to-dos"
              onClick={() => nav('/tasks')}
            />
            <QuickCard
              title="Calendar"
              subtitle="See active campaigns in calendar view"
              onClick={() => nav('/calendar')}
            />
            <QuickCard
              title="Info"
              subtitle="Useful notes, routines, and internal details"
              onClick={() => nav('/info')}
            />
          </div>
        </section>

        {/* Overview section */}
        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Welcome</h2>
              <p className="text-sm text-slate-500">
                A simple start page for your Coop scheduling workflow
              </p>
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <p>
                Use this app to keep track of current campaigns, recently expired
                activity, upcoming work, and operational tasks tied to Coop Retail
                Media.
              </p>
              <p>
                The goal here is not to overload the front page. It should give you
                a calm, clean entry into the system and make it fast to get where you
                need.
              </p>
              <p>
                As the app grows, this page can later include live KPIs, reminders,
                urgent tasks, or campaign alerts.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <InfoCard
              title="Today"
              value={today}
              subtitle="Current date"
            />
            <InfoCard
              title="Workspace"
              value="Coop"
              subtitle="Single-customer setup"
            />
            <InfoCard
              title="Focus"
              value="Campaigns + Tasks"
              subtitle="Core modules in development"
            />
          </div>
        </section>
      </div>
    </div>
  );
}