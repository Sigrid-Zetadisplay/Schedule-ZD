import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, updateTask, deleteTask } from '../api';

export default function TasksPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey:['tasks'], queryFn: ()=> getTasks({ limit:500 }) });

  const createMut = useMutation({ mutationFn: createTask, onSuccess: ()=> qc.invalidateQueries({ queryKey:['tasks'] }) });
  const updateMut = useMutation({ mutationFn: ({id,payload}) => updateTask(id,payload), onSuccess: ()=> qc.invalidateQueries({ queryKey:['tasks'] }) });
  const delMut = useMutation({ mutationFn: deleteTask, onSuccess: ()=> qc.invalidateQueries({ queryKey:['tasks'] }) });

  function onSubmit(e){
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    createMut.mutate({
      title: f.get('title'),
      type: f.get('type') || 'other',
      status: 'open',
      due: f.get('due') || undefined,
      notes: f.get('notes') || ''
    });
    e.currentTarget.reset();
  }

  return (
    <div>
      <h1>Tasks</h1>
      <form onSubmit={onSubmit} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 2fr auto', gap:'0.5rem', alignItems:'end', margin:'1rem 0' }}>
        <Field name="title" label="Title" required />
        <div>
          <label style={{ fontSize:12, color:'#555' }}>Type</label>
          <select name="type" style={{ width:'100%' }}>
            <option value="report">report</option>
            <option value="followup">followup</option>
            <option value="other">other</option>
          </select>
        </div>
        <Field name="due" label="Due" type="date" />
        <Field name="notes" label="Notes" />
        <div><button>Add Task</button></div>
      </form>

      <table width="100%" cellPadding="6" style={{ borderCollapse:'collapse' }}>
        <thead>
          <tr style={{ borderBottom:'1px solid #eee', textAlign:'left' }}>
            <th>Title</th><th>Type</th><th>Status</th><th>Due</th><th>Notes</th><th></th>
          </tr>
        </thead>
        <tbody>
          {(data||[]).map(t=>(
            <tr key={t._id} style={{ borderBottom:'1px solid #f1f1f1' }}>
              <td>{t.title}</td>
              <td>{t.type}</td>
              <td>
                <select value={t.status} onChange={(e)=>updateMut.mutate({id:t._id, payload:{ status:e.target.value }})}>
                  <option value="open">open</option>
                  <option value="in_progress">in_progress</option>
                  <option value="done">done</option>
                </select>
              </td>
              <td>{t.due ? new Date(t.due).toLocaleDateString() : ''}</td>
              <td>{t.notes}</td>
              <td>
                <button onClick={()=>delMut.mutate(t._id)}>Delete</button>
              </td>
            </tr>
          ))}
          {!data?.length && <tr><td colSpan={6} style={{ padding:'1rem', color:'#666' }}>No tasks</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function Field({ label, ...rest }) {
  return (
    <div>
      <label style={{ fontSize:12, color:'#555' }}>{label}</label>
      <input {...rest} style={{ width:'100%' }} />
    </div>
  );
}
