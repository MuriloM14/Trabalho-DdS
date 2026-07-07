import { BookStatus } from './book.interface';

export type AuthMode = 'login' | 'register';
export type FeedbackKind = 'success' | 'error';

export interface AuthFormModel {
  nome: string;
  email: string;
  senha: string;
}

export interface BookFormModel {
  titulo: string;
  autor: string;
  sinopse: string;
  urlCapa: string;
  status: BookStatus;
}
