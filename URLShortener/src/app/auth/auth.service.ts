import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginUser, RegisterUser, AuthResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly AUTH_URL = 'http://localhost:8000/api/token/';
  private readonly REGISTER_URL = 'http://localhost:8000/api/register/';
  private authStatus = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = localStorage.getItem('access_token');
    this.authStatus.next(!!token);
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  get userId(): number | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id;
    } catch (e) {
      return null;
    }
  }

  register(userData: RegisterUser): Observable<any> {
    return this.http.post(this.REGISTER_URL, userData).pipe(
      tap(() => {
        this.login({
          username: userData.username,
          password: userData.password,
        }).subscribe();
      })
    );
  }

  login(user: LoginUser): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.AUTH_URL, user).pipe(
      tap((response) => {
        this.setTokens(response);
        this.authStatus.next(true);
        this.router.navigate(['/']);
      })
    );
  }

  private setTokens(tokens: AuthResponse): void {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.authStatus.next(false);
    this.router.navigate(['/login']);
  }
}
