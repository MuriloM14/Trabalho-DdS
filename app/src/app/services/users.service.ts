import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserProfile } from '../interfaces';
import { ApiSupportService } from './api-support.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly apiSupport = inject(ApiSupportService);

  getProfile(userId: number) {
    return this.http.get<UserProfile>(
      `${this.apiSupport.apiUrl}/users/${userId}`,
      this.apiSupport.withAuth()
    );
  }
}
