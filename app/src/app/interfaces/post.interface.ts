export interface PostItem {
  id: number;
  conteudo: string;
  userId: number;
  autorNome: string;
  totalComentarios: number;
  createdAt: string;
}

export interface PostPayload {
  conteudo: string;
}
