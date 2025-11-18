import { Expense, ExpenseShare } from '../types';
import { API_BASE, handleJson } from './apiClient';

export async function getExpenses(token: string, dormId: number): Promise<Expense[]> {
  const res = await fetch(`${API_BASE}/expenses?dormId=${dormId}`, {
    headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  return handleJson<Expense[]>(res);
}

export async function createExpense(
  token: string,
  dormCode: string,
  title: string,
  totalAmount: number,
  participantIds: number[]
): Promise<Expense> {
  const res = await fetch(`${API_BASE}/expenses/${dormCode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ title, totalAmount, participantIds }),
  });
  return handleJson<Expense>(res);
}

export async function markPaid(token: string, expenseId: number, userId: number): Promise<ExpenseShare> {
  const res = await fetch(`${API_BASE}/expenses/${expenseId}/shares/${userId}/paid`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  return handleJson<ExpenseShare>(res);
}

const ExpenseService = { getExpenses, createExpense, markPaid };

export default ExpenseService;