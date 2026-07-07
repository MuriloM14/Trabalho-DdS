import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BookItem, BookPayload, BookStatus, PageResponse } from '../interfaces';
import { ApiSupportService } from './api-support.service';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private readonly http = inject(HttpClient);
  private readonly apiSupport = inject(ApiSupportService);

  listBooks(status: BookStatus | '', page = 0, size = 6) {
    let params = this.apiSupport.createPageParams(page, size);

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PageResponse<BookItem>>(
      `${this.apiSupport.apiUrl}/books`,
      this.apiSupport.withAuth(params)
    );
  }

  createBook(payload: BookPayload) {
    return this.http.post<BookItem>(
      `${this.apiSupport.apiUrl}/books`,
      payload,
      this.apiSupport.withAuth()
    );
  }

  updateBook(bookId: number, payload: BookPayload) {
    return this.http.put<BookItem>(
      `${this.apiSupport.apiUrl}/books/${bookId}`,
      payload,
      this.apiSupport.withAuth()
    );
  }

  deleteBook(bookId: number) {
    return this.http.delete<void>(
      `${this.apiSupport.apiUrl}/books/${bookId}`,
      this.apiSupport.withAuth()
    );
  }
}
