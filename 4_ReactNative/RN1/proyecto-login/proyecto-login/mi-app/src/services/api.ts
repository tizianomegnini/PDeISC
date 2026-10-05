import { API_URL } from '../config';
import { LoginResponse } from '../types';

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    });
    return (await res.json()) as LoginResponse;
  } catch {
    return { ok: false, message: 'No se pudo conectar con el servidor' };
  } finally {
    clearTimeout(timeout);
  }
}
