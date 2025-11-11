import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

export async function fetchOrders() {
  const res = await axios.get(`${API_BASE_URL}/api/orders`);
  return res.data;
}
