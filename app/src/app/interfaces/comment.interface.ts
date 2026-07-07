export interface CommentItem {
  id: number;
  conteudo: string;
  autorId: number;
  autorNome: string;
  postId: number;
  createdAt: string;
}

export interface CommentPayload {
  conteudo: string;
}
