export interface ApiErrorResponse {
  status: number;
  erro: string;
  mensagem: string;
  detalhes?: string[] | null;
}
