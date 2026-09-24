import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../config/api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface StoredUser extends AuthUser {
  passwordHash: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly usersStorageKey = 'todo-users';
  private readonly sessionStorageKey = 'todo-session';
  private readonly tokenStorageKey = 'todo-access-token';
  private readonly currentUserState = signal<AuthUser | null>(this.loadSession());

  readonly currentUser = this.currentUserState.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserState() !== null);

  async register(data: RegisterData): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(`${API_URL}/auth/cadastro`, data),
    );
    this.startSession(response.user, response.accessToken);
  }

  async login(email: string, password: string): Promise<boolean> {
    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await this.hashPassword(password);
    const user = this.loadUsers().find(
      (item) => item.email === normalizedEmail && item.passwordHash === passwordHash,
    );

    if (!user) {
      return false;
    }

    this.startSession(user);
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.sessionStorageKey);
    localStorage.removeItem(this.tokenStorageKey);
    this.currentUserState.set(null);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  private startSession(user: AuthUser, accessToken?: string): void {
    const session: AuthUser = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem(this.sessionStorageKey, JSON.stringify(session));

    if (accessToken) {
      localStorage.setItem(this.tokenStorageKey, accessToken);
    }

    this.currentUserState.set(session);
  }

  private loadUsers(): StoredUser[] {
    try {
      return JSON.parse(localStorage.getItem(this.usersStorageKey) ?? '[]') as StoredUser[];
    } catch {
      return [];
    }
  }

  private loadSession(): AuthUser | null {
    try {
      const session = localStorage.getItem(this.sessionStorageKey);
      return session ? (JSON.parse(session) as AuthUser) : null;
    } catch {
      return null;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const bytes = new TextEncoder().encode(password);
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
}
