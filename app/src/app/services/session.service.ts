import { Injectable } from '@angular/core';
import { UserSession } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly storageKey = 'dds-reader-session';

  getSession(): UserSession | null {
    const storage = this.getStorage();

    if (!storage) {
      return null;
    }

    const rawValue = storage.getItem(this.storageKey);

    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue) as UserSession;
    } catch {
      storage.removeItem(this.storageKey);
      return null;
    }
  }

  saveSession(session: UserSession): void {
    const storage = this.getStorage();

    if (!storage) {
      return;
    }

    storage.setItem(this.storageKey, JSON.stringify(session));
  }

  clearSession(): void {
    const storage = this.getStorage();

    if (!storage) {
      return;
    }

    storage.removeItem(this.storageKey);
  }

  getToken(): string | null {
    return this.getSession()?.token ?? null;
  }

  private getStorage(): Storage | null {
    if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
      return null;
    }

    return globalThis.localStorage;
  }
}
