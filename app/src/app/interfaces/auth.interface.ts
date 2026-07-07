export interface UserSession {
  token: string;
  userId: number;
  nome: string;
  email: string;
}

export interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginPayload {
  email: string;
  senha: string;
}
