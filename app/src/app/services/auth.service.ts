import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginPayload, RegisterPayload, UserSession } from '../interfaces';
import { ApiSupportService } from './api-support.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiSupport = inject(ApiSupportService);

  register(payload: RegisterPayload) {
    return this.http.post<UserSession>(`${this.apiSupport.apiUrl}/auth/register`, payload);
  }

  login(payload: LoginPayload) {
    return this.http.post<UserSession>(`${this.apiSupport.apiUrl}/auth/login`, payload);
  }
}
