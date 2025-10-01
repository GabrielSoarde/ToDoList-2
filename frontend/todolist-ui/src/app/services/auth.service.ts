import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// O caminho agora funciona porque criamos a pasta models!
import { LoginModel, RegisterModel, TokenResponse } from '../models/auth.model'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5269/api/Auth';

  constructor(private http: HttpClient) { }

  register(model: RegisterModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, model);
  }

  login(model: LoginModel): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, model);
  }

  setToken(response: TokenResponse): void {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('auth_email', response.email);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_email');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}