// client/src/pages/CalendarPage.jsx
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getOrders } from '../api';

export default function CalendarPage({
  // filters
  bucket,
  client,
  source,
  from,
  to,
  q,

  // ui
  initialView = 'dayGridMonth',
  height = '70vh',
  showToolbar = true,
}) {
  const [events, setEvents] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setErr('');
        const params = { limit: 1000 };
        if (bucket) params.bucket = bucket;
        if (client) params.client = client;
        if (source) params.source = source;
        if (from) params.from = from;
        if (to) params.to = to;
        if (q) params.q = q;

        const rows = await getOrders(params);
        if (!active) return;

        setEvents(
          rows.map((o) => ({
            id: o._id,
            title:
              (o.title || 'Campaign') +
              (o.sov != null ? ` (${o.sov} SOV)` : ''),
            allDay: !!o.allDay,
            start: o.start,
            end: o.end,
            extendedProps: {
              client: o.client,
              sov: o.sov,
              notes: o.notes,
              source: o.source,
            },
          }))
        );
      } catch (e) {
        if (active) setErr('Failed to load events');
        console.error(e);
      }
    })();

    return () => {
      active = false;
    };
  }, [bucket, client, source, from, to, q]);

  function onEventClick(info) {
    const { title, extendedProps, start, end } = info.event;
    const { client, sov, notes, source } = extendedProps;

    alert(
      [
        title,
        client ? `Client: ${client}` : null,
        source ? `Source: ${source}` : null,
        sov != null ? `SOV: ${sov}` : null,
        start ? `Start: ${start.toLocaleString()}` : null,
        end ? `End: ${end.toLocaleString()}` : null,
        notes ? `Notes: ${notes}` : null,
      ]
        .filter(Boolean)
        .join('\n')
    );
  }

  return (
    <div>
      {err && <p style={{ color: 'red' }}>{err}</p>}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={initialView}
        headerToolbar={
          showToolbar
            ? {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }
            : false
        }
        height={height}
        events={events}
        eventClick={onEventClick}
      />
    </div>
  );
}
