import { HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class ApiSupportService {
  private readonly sessionService = inject(SessionService);

  readonly apiUrl = 'http://localhost:8080/api';

  withAuth(params?: HttpParams) {
    const token = this.sessionService.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    return params ? { headers, params } : { headers };
  }

  createPageParams(page: number, size: number) {
    return new HttpParams().set('page', page).set('size', size);
  }
}
