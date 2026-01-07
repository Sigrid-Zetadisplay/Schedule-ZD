// client/src/pages/StartPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Tile({ title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group w-full rounded-2xl border border-slate-200 bg-white p-6 text-left
        shadow-sm hover:shadow-md hover:-translate-y-0.5 transition
        focus:outline-none focus:ring-2 focus:ring-slate-300
      "
    >
      <div className="text-lg font-semibold text-slate-900">{title}</div>
      {subtitle && (
        <div className="mt-1 text-sm text-slate-500 group-hover:text-slate-600">
          {subtitle}
        </div>
      )}
    </button>
  );
}

export default function StartPage() {
  const nav = useNavigate();

  const goCustomer = (key) => {
    nav(`/${key}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Schedule App</h1>
          <p className="mt-2 text-slate-600">
            Choose where you want to go
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Tile
            title="Flytoget"
            subtitle="Open customer dashboard"
            onClick={() => goCustomer('flytoget')}
          />
          <Tile
            title="Vy"
            subtitle="Open customer dashboard"
            onClick={() => goCustomer('vy')}
          />
          <Tile
            title="Coop"
            subtitle="Open customer dashboard"
            onClick={() => goCustomer('coop')}
          />

          <Tile
            title="ZD Support"
            subtitle="Open support portal"
            onClick={() =>
              window.open(
                'https://YOUR_SUPPORT_URL_HERE',
                '_blank',
                'noopener,noreferrer'
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
