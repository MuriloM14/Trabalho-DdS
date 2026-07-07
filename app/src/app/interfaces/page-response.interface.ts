export interface PageResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export function createEmptyPage<T>(): PageResponse<T> {
  return {
    content: [],
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
    empty: true
  };
}
