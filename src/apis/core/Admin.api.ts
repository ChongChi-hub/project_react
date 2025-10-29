// src/apis/core/Admin.api.ts
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL as string;

// ===== Dashboard =====
export async function getDashboardData(): Promise<{
  userCount: number;
  categoryCount: number;
  totalTransactionCount: number;
  totalSpending: number;
}> {
  const [users, categories, transactions] = await Promise.all([
    axios.get(`${API_URL}/users`),
    axios.get(`${API_URL}/categories`),
    axios.get(`${API_URL}/transactions`),
  ]);

  const totalSpending = transactions.data?.reduce(
    (sum: number, t: any) => sum + (t.amount ?? 0),
    0
  );

  return {
    userCount: users.data.length ?? 0,
    categoryCount: categories.data.length ?? 0,
    totalTransactionCount: transactions.data.length ?? 0,
    totalSpending: totalSpending ?? 0,
  };
}

// ===== Users =====
export async function getUsers() {
  const res = await axios.get(`${API_URL}/users`);
  return res.data;
}

// ===== Categories =====
export async function getCategories() {
  const res = await axios.get(`${API_URL}/categories`);
  return res.data;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createCategory(payload: any) {
  const res = await axios.post(`${API_URL}/categories`, payload);
  return res.data;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateCategory(id: string, payload: any) {
  const res = await axios.patch(`${API_URL}/categories/${id}`, payload);
  return res.data;
}
export async function deleteCategory(id: string) {
  const res = await axios.delete(`${API_URL}/categories/${id}`);
  return res.data;
}
export async function toggleCategory(id: string, status: boolean) {
  const res = await axios.patch(`${API_URL}/categories/${id}`, { status });
  return res.data;
}
