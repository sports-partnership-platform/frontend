import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, AuthResponse, LoginPayload } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/auth';
  private tokenKey = 'sp_auth_token';
  private userKey = 'sp_auth_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private getStoredUser(): User | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public isLoggedIn(): boolean {
    return !!this.getToken() && !!this.currentUserSubject.value;
  }

  public getUser(): User | null {
    return this.currentUserSubject.value;
  }

  public isOwner(): boolean {
    const user = this.getUser();
    return user ? user.level === 0 : false;
  }

  public canCreateDownlines(): boolean {
    const user = this.getUser();
    return user ? user.level < 5 : false;
  }

  public getLevel(): number {
    const user = this.getUser();
    return user ? user.level : 0;
  }

  public login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap((res) => {
        if (res.success && res.token && res.user) {
          localStorage.setItem(this.tokenKey, res.token);
          localStorage.setItem(this.userKey, JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

  public fetchCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/me`).pipe(
      tap((res) => {
        if (res.success && res.data?.user) {
          const updatedUser: User = {
            ...res.data.user,
            name: res.data.partner?.name || res.data.user.username,
            email: res.data.partner?.email || '',
            phone: res.data.partner?.phone || ''
          };
          localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
          this.currentUserSubject.next(updatedUser);
        }
      })
    );
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
