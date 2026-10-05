export interface User {
  id: number;
  nombre: string;
  email: string;
}

export interface LoginResponse {
  ok: boolean;
  message?: string;
  user?: User;
}
