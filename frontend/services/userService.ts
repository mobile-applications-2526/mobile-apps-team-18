import { AuthenticationResponse, SignupInput, SignupUser, User } from '../types';
import { API_BASE, handleJson } from './apiClient';

export async function login(username: string, password: string): Promise<AuthenticationResponse> {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await handleJson<AuthenticationResponse>(res);
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

export async function getProfile(token: string): Promise<User> {
  const res = await fetch(`${API_BASE}/users/ping`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return handleJson<User>(res);
}

export async function updateUsername(
  token: string,
  username: string
): Promise<AuthenticationResponse> {
  const res = await fetch(`${API_BASE}/users/username/${username}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return handleJson<AuthenticationResponse>(res);
}

export async function updateEmail(token: string, email: string): Promise<AuthenticationResponse> {
  const res = await fetch(`${API_BASE}/users/email/${email}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return handleJson<AuthenticationResponse>(res);
}

export async function updateLocation(
  token: string,
  location: string
): Promise<AuthenticationResponse> {
  const res = await fetch(`${API_BASE}/users/location/${location}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return handleJson<AuthenticationResponse>(res);
}

export async function updateBirthday(
  token: string,
  birthday: string
): Promise<AuthenticationResponse> {
  const res = await fetch(`${API_BASE}/users/birthday/${birthday}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return handleJson<AuthenticationResponse>(res);
}

export async function deleteProfile(token: string): Promise<string> {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return handleJson<string>(res);
}

export const UserService = {
  login,
  signup,
  getProfile,
  updateUsername,
  deleteProfile,
  updateEmail,
  updateLocation,
  updateBirthday,
};
