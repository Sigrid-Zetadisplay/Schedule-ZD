import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../api';

export default function OrdersPage() {
  const qc = useQueryClient();
  const [bucket, setBucket] = useState('current'); // upcoming|current|recent|expired|all
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);

  const { data } = useQuery({
    queryKey: ['orders', bucket],
    queryFn: () =>
      bucket === 'all'
        ? getOrders({ limit: 500 })
        : getOrders({ bucket, limit: 500 }),
  });

  const createMut = useMutation({
    mutationFn: createOrder,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });

  const delMut = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, patch }) => updateOrder(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });

  function handleAdd(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const b2b = form.get('b2b') === 'on';
    const startDate = form.get('start');
    const endDate = form.get('end');

    createMut.mutate({
      title: form.get('title'),        // Customer / Product
      client: form.get('client'),      // Flytoget Client
      sov: form.get('sov'),
      start: startDate,
      end: endDate,
      notes: form.get('notes'),
      b2b,
      direction: form.get('direction'),
      imageUrl: form.get('imageUrl'),
      allDay: true,
      // status will default to 'new' in the backend
    });

    e.currentTarget.reset();
    setShowForm(false);
  }

  function toggleExpand(id) {
    setExpandedId(prev => (prev === id ? null : id));
  }

  function getRowClass(order) {
    // base row
    let base = 'border-b cursor-pointer bg-white hover:bg-gray-50 transition-colors';

    // Already scheduled -> green
    if (order.status === 'scheduled') {
      base = 'border-b cursor-pointer bg-green-50 hover:bg-green-100 transition-colors';
      return base;
    }

    // Starting within 2 days and not scheduled -> red
    const now = new Date();
    const start = new Date(order.start);
    const diffDays = (start - now) / (1000 * 60 * 60 * 24);

    if (diffDays <= 2 && diffDays >= 0) {
      base = 'border-b cursor-pointer bg-red-50 hover:bg-red-100 transition-colors';
    }

    return base;
  }

  function startConfirm(orderId) {
    setExpandedId(orderId);   // open details
    setConfirmingId(orderId); // show confirm panel
  }

  function confirmScheduled(order) {
    updateMut.mutate({ id: order._id, patch: { status: 'scheduled' } });
    setConfirmingId(null);
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>

      {/* Legend */}
      <div className="text-xs text-gray-600 flex flex-wrap gap-2">
        <span className="px-2 py-1 border rounded bg-white">
          New / normal
        </span>
        <span className="px-2 py-1 border rounded bg-red-50">
          Starts within 2 days
        </span>
        <span className="px-2 py-1 border rounded bg-green-50">
          Scheduled &amp; ready
        </span>
      </div>

      {/* Add campaign button */}
      <div>
        <button
          onClick={() => setShowForm(s => !s)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {showForm ? 'Cancel' : 'Add campaign order'}
        </button>
      </div>

      {/* Form (only visible when button is active) */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-white shadow-sm"
        >
          <Input name="title" label="Customer / Product" required />

          {/* Coop Client dropdown */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Coop Client
            </label>
            <select
              name="client"
              className="w-full border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value="">(none)</option>
              <option value="Silje Wathle">Silje Wathle</option>
            </select>
          </div>

          {/* SOV dropdown */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              SOV (%)
            </label>
            <select
              name="sov"
              className="w-full border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value="">(none)</option>
              <option value="4">4</option>
              <option value="6">6</option>
              <option value="8">8</option>
              <option value="10">10</option>
              <option value="12">12</option>
            </select>
          </div>

          {/* A-B Test checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="abTest"
              id="abTest"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400"
            />
            <label htmlFor="abTest" className="text-sm text-gray-700">
              A-B Test
            </label>
          </div>

          {/* Chain dropdown */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Chain
            </label>
            <select
              name="Chain"
              defaultValue="All"
              className="w-full border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value="All">All</option>
              <option value="Obs">Obs</option>
              <option value="Extra">Extra</option>
            </select>
          </div>

          {/* Start / End date with calendar picker */}
          <Input
            name="start"
            label="Start date"
            type="date"
            required
          />
          <Input
            name="end"
            label="End date"
            type="date"
            required
          />

          {/* Image URL (optional) */}
          <Input
            name="imageUrl"
            label="Image URL (optional)"
            placeholder="https://…"
          />

          {/* Notes */}
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Notes (optional)
            </label>
            <textarea
              name="notes"
              rows={3}
              className="w-full border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={createMut.isPending}
              className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
            >
              Save campaign order
            </button>
          </div>
        </form>
      )}

      {/* Bucket selector */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold text-gray-700">Bucket:</span>
        {['current', 'upcoming', 'recent', 'expired', 'all'].map(b => (
          <button
            key={b}
            onClick={() => setBucket(b)}
            className={`px-3 py-1 rounded-full border text-xs ${
              bucket === b
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Client</th>
              <th className="px-4 py-2">SOV</th>
              <th className="px-4 py-2">Chain</th>
              <th className="px-4 py-2">A-B Test</th>
              <th className="px-4 py-2">Start</th>
              <th className="px-4 py-2">End</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map(o => (
              <React.Fragment key={o._id}>
                <tr
                  className={getRowClass(o)}
                  onClick={() => toggleExpand(o._id)}
                >
                  <td className="px-4 py-2 align-top">{o.title}</td>
                  <td className="px-4 py-2 align-top">{o.client}</td>
                  <td className="px-4 py-2 align-top">{o.sov}</td>
                  <td className="px-4 py-2 align-top">
                    {o.chain || ''}
                  </td>
                  <td className="px-4 py-2 align-top">
                    {o.abTest ? 'Yes' : 'No'}
                  </td>
                  <td className="px-4 py-2 align-top">
                    {new Date(o.start).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 align-top">
                    {new Date(o.end).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 align-top text-right space-x-2">
                    {/* Done button (only if not scheduled) */}
                    {o.status !== 'scheduled' && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          startConfirm(o._id);
                        }}
                        className="inline-flex items-center px-3 py-1 text-xs rounded-md bg-amber-500 text-white hover:bg-amber-600"
                      >
                        Done
                      </button>
                    )}

                    {/* Delete button */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        delMut.mutate(o._id);
                      }}
                      disabled={delMut.isPending}
                      className="inline-flex items-center px-3 py-1 text-xs rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                {expandedId === o._id && (
                  <tr>
                    <td colSpan={8} className="bg-gray-50 px-4 py-3">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-800">
                            Notes
                          </h3>
                          <div className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                            {o.notes || (
                              <span className="text-gray-400">No notes</span>
                            )}
                          </div>
                        </div>
                        <div className="w-full md:w-64">
                          <h3 className="text-sm font-semibold text-gray-800">
                            Image
                          </h3>
                          <div className="mt-1">
                            {o.imageUrl ? (
                              <img
                                src={o.imageUrl}
                                alt={o.title}
                                className="max-w-full max-h-52 rounded border object-contain bg-white"
                              />
                            ) : (
                              <span className="text-sm text-gray-400">
                                No image
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Confirm scheduled panel */}
                      {o.status !== 'scheduled' && confirmingId === o._id && (
                        <div className="mt-4 p-3 border rounded-md bg-white">
                          <p className="text-sm font-semibold text-gray-800">
                            Campaign is scheduled and ready
                          </p>
                          <p className="mt-1 text-xs text-gray-700">
                            {o.title} – {o.client} – SOV: {o.sov}% –{' '}
                            {o.chain}
                            <br />
                            {new Date(o.start).toLocaleDateString()} →{' '}
                            {new Date(o.end).toLocaleDateString()}
                          </p>
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => confirmScheduled(o)}
                              disabled={updateMut.isPending}
                              className="px-3 py-1 text-xs rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmingId(null)}
                              className="px-3 py-1 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}

            {!data?.length && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  No orders
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Input({ label, ...rest }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        {...rest}
        className="w-full border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
      />
    </div>
  );
}
