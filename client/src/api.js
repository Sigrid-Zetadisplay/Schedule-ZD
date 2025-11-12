import axios from 'axios';
const API = 'http://localhost:4000';

export const getSummary = () => axios.get(`${API}/api/orders/summary`).then(r=>r.data);
export const getOrders = (params={}) => axios.get(`${API}/api/orders`, { params }).then(r=>r.data);
export const createOrder = (payload) => axios.post(`${API}/api/orders`, payload).then(r=>r.data);
export const updateOrder = (id, payload) => axios.put(`${API}/api/orders/${id}`, payload).then(r=>r.data);
export const deleteOrder = (id) => axios.delete(`${API}/api/orders/${id}`).then(r=>r.data);

export const getTasks = (params={}) => axios.get(`${API}/api/tasks`, { params }).then(r=>r.data);
export const createTask = (payload) => axios.post(`${API}/api/tasks`, payload).then(r=>r.data);
export const updateTask = (id, payload) => axios.put(`${API}/api/tasks/${id}`, payload).then(r=>r.data);
export const deleteTask = (id) => axios.delete(`${API}/api/tasks/${id}`).then(r=>r.data);
