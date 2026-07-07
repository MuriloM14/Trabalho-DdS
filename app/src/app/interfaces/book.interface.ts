export type BookStatus = 'LENDO' | 'QUERO_LER' | 'ABANDONEI' | 'JA_LI' | 'FAVORITO';

export interface BookItem {
  id: number;
  titulo: string;
  autor: string | null;
  sinopse: string | null;
  urlCapa: string | null;
  status: BookStatus;
  userId: number;
  createdAt: string;
}

export interface BookPayload {
  titulo: string;
  autor: string;
  sinopse: string;
  urlCapa: string;
  status: BookStatus;
}
