import { BookStatus } from '../interfaces';

export const BOOK_STATUS_OPTIONS: ReadonlyArray<{ value: BookStatus; label: string }> = [
  { value: 'LENDO', label: 'Lendo' },
  { value: 'QUERO_LER', label: 'Quero ler' },
  { value: 'ABANDONEI', label: 'Abandonei' },
  { value: 'JA_LI', label: 'Ja li' },
  { value: 'FAVORITO', label: 'Favorito' }
];

export const BOOK_STATUS_FILTERS: ReadonlyArray<{ value: BookStatus | ''; label: string }> = [
  { value: '', label: 'Todos os status' },
  ...BOOK_STATUS_OPTIONS
];
