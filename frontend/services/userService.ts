import { Profile, SignupInput, SignupUser, User } from '../types';
import { API_BASE, handleJson } from './apiClient';

export async function login(username: string, password: string): Promise<User> {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await handleJson<User>(res);
  if (!data?.token) {
    throw new Error('No token returned from server');
  }
  return data;
}

export async function signup(input: SignupInput): Promise<SignupUser> {
  const res = await fetch(`${API_BASE}/users/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(input),
  });
  return handleJson<SignupUser>(res);
}

export async function getProfile(token: string): Promise<Profile> {
  const res = await fetch(`${API_BASE}/users/ping`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return handleJson<Profile>(res);
}

export async function updateProfile(token: string, input: Partial<Profile>): Promise<Profile> {
  const res = await fetch(`${API_BASE}/users/me`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(input),
  });
  return handleJson<Profile>(res);
}

export async function deleteProfile(token: string): Promise<string> {
  const res = await fetch(`${API_BASE}/users/me`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return handleJson<string>(res);
}

export const userService = { login, signup, getProfile, updateProfile, deleteProfile };
