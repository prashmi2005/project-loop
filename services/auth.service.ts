import type { User } from '@/types';
import { users } from '@/lib/mock-data';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function login(email: string, password: string): Promise<User> {
  await delay(500);
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error('No account found with that email.');
  }
  if (password !== 'demo1234') {
    throw new Error('Incorrect password. Try "demo1234".');
  }
  return user;
}

export async function logout(): Promise<void> {
  await delay(200);
}

export async function getCurrentUser(): Promise<User | null> {
  await delay(200);
  return users[0];
}
