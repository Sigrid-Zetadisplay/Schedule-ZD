// client/src/pages/CalendarPage.jsx
import React, { useState } from 'react';
import OrdersCalendar from '../OrdersCalendar';

export default function CalendarPage() {
  const [bucket, setBucket] = useState('current'); // current | upcoming | recent | expired | (empty for all)
  const [source, setSource] = useState('');        // manual | jotform | flytoget | ''
  const [client, setClient] = useState('');
  const [q, setQ] = useState('');

  return (
    <div>
      <h1>Calendar</h1>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:'0.5rem', margin:'0.75rem 0 1rem' }}>
        <Field label="Bucket">
          <select value={bucket} onChange={(e)=>setBucket(e.target.value)}>
            <option value="current">current</option>
            <option value="upcoming">upcoming</option>
            <option value="recent">recent (expired last 30d)</option>
            <option value="expired">expired (all)</option>
            <option value="">all</option>
          </select>
        </Field>
        <Field label="Source">
          <select value={source} onChange={(e)=>setSource(e.target.value)}>
            <option value="">any</option>
            <option value="manual">manual</option>
            <option value="flytoget">flytoget</option>
            <option value="jotform">jotform</option>
          </select>
        </Field>
        <Field label="Client">
          <input value={client} onChange={(e)=>setClient(e.target.value)} placeholder="e.g. Flytoget" />
        </Field>
        <Field label="Search">
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="title/notes/tags…" />
        </Field>
        <div style={{ alignSelf:'end' }}>
          <button onClick={()=>{ setBucket('current'); setSource(''); setClient(''); setQ(''); }}>Reset</button>
        </div>
      </div>

      <OrdersCalendar
        bucket={bucket || undefined}
        source={source || undefined}
        client={client || undefined}
        q={q || undefined}
        initialView="timeGridWeek"
        height="78vh"
        showToolbar
      />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ fontSize:12, color:'#555' }}>
      {label}
      <div>{children}</div>
    </label>
  );
}
