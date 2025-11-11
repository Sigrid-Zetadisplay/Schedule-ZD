import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { fetchOrders } from './api';

export default function OrdersCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        const orders = await fetchOrders();

        if (!isMounted) return;

        const mapped = orders.map((o) => ({
          id: o._id,
          title: buildTitle(o),
          start: o.start,
          end: o.end,
          allDay: !!o.allDay,
          extendedProps: {
            client: o.client,
            sov: o.sov,
            notes: o.notes,
          },
        }));

        setEvents(mapped);
      } catch (err) {
        console.error(err);
        if (isMounted) setError('Could not load orders from API');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  function buildTitle(o) {
    const base = o.title || 'Campaign';
    if (o.sov != null && o.sov !== '') {
      return `${base} (${o.sov} SOV)`;
    }
    return base;
  }

  function handleEventClick(info) {
    const { title, extendedProps, start, end } = info.event;
    const { client, sov, notes } = extendedProps;

    const startStr = start
      ? start.toLocaleString()
      : '';
    const endStr = end
      ? end.toLocaleString()
      : '';

    alert(
      [
        title,
        client ? `Client: ${client}` : null,
        sov != null ? `SOV: ${sov}` : null,
        startStr ? `Start: ${startStr}` : null,
        endStr ? `End: ${endStr}` : null,
        notes ? `Notes: ${notes}` : null,
      ]
        .filter(Boolean)
        .join('\n')
    );
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>Schedule Overview</h1>

      {loading && <p>Loading orders…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        eventClick={handleEventClick}
        height="80vh"
      />
    </div>
  );
}
