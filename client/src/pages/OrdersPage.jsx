import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, createOrder, deleteOrder } from '../api';

export default function OrdersPage() {
  const qc = useQueryClient();
  const [bucket, setBucket] = useState('current'); // upcoming|current|recent|expired|all
  const { data } = useQuery({
    queryKey:['orders', bucket],
    queryFn: () => bucket==='all' ? getOrders({limit:500}) : getOrders({ bucket, limit:500 })
  });

  const createMut = useMutation({ mutationFn: createOrder, onSuccess: ()=> qc.invalidateQueries({ queryKey:['orders'] }) });
  const delMut = useMutation({ mutationFn: deleteOrder, onSuccess: ()=> qc.invalidateQueries({ queryKey:['orders'] }) });

  function handleAdd(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    createMut.mutate({
      title: form.get('title'),
      client: form.get('client'),
      sov: form.get('sov'),
      start: form.get('start'),
      end: form.get('end'),
      source: form.get('source') || 'manual',
      notes: form.get('notes')
    });
    e.currentTarget.reset();
  }

  return (
    <div>
      <h1>Orders</h1>

      <form onSubmit={handleAdd} style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'0.5rem', alignItems:'end', margin:'1rem 0' }}>
        <Input name="title" label="Title" required />
        <Input name="client" label="Client" />
        <Input name="sov" label="SOV" type="number" step="0.1" />
        <Input name="start" label="Start" type="datetime-local" required />
        <Input name="end" label="End" type="datetime-local" required />
        <div>
          <label style={{ fontSize:12, color:'#555' }}>Source</label>
          <select name="source" style={{ width:'100%' }}>
            <option value="manual">manual</option>
            <option value="flytoget">flytoget</option>
            <option value="jotform">jotform</option>
          </select>
        </div>
        <div style={{ gridColumn:'1/7' }}>
          <label style={{ fontSize:12, color:'#555' }}>Notes</label>
          <textarea name="notes" rows={2} style={{ width:'100%' }} />
        </div>
        <div style={{ gridColumn:'1/7', textAlign:'right' }}>
          <button disabled={createMut.isPending}>Add Order</button>
        </div>
      </form>

      <div style={{ margin:'0.5rem 0' }}>
        <strong>Bucket:</strong>{' '}
        {['current','upcoming','recent','expired','all'].map(b => (
          <button key={b} onClick={()=>setBucket(b)} style={{ marginRight:8, fontWeight: bucket===b?600:400 }}>
            {b}
          </button>
        ))}
      </div>

      <table width="100%" cellPadding="6" style={{ borderCollapse:'collapse' }}>
        <thead>
          <tr style={{ textAlign:'left', borderBottom:'1px solid #eee' }}>
            <th>Title</th><th>Client</th><th>SOV</th><th>Start</th><th>End</th><th>Source</th><th></th>
          </tr>
        </thead>
        <tbody>
          {(data||[]).map(o => (
            <tr key={o._id} style={{ borderBottom:'1px solid #f1f1f1' }}>
              <td>{o.title}</td>
              <td>{o.client}</td>
              <td>{o.sov}</td>
              <td>{new Date(o.start).toLocaleString()}</td>
              <td>{new Date(o.end).toLocaleString()}</td>
              <td>{o.source}</td>
              <td>
                <button onClick={()=>delMut.mutate(o._id)} disabled={delMut.isPending}>Delete</button>
              </td>
            </tr>
          ))}
          {!data?.length && (
            <tr><td colSpan={7} style={{ padding:'1rem', color:'#666' }}>No orders</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Input({ label, ...rest }) {
  return (
    <div>
      <label style={{ fontSize:12, color:'#555' }}>{label}</label>
      <input {...rest} style={{ width:'100%' }} />
    </div>
  );
}
