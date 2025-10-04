import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginModel, RegisterModel, TokenResponse } from '../models/auth.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`;

  constructor(private http: HttpClient, private storageService: StorageService) { }

  register(model: RegisterModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, model);
  }

  login(model: LoginModel): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, model);
  }

  setToken(response: TokenResponse): void {
    this.storageService.setItem('auth_token', response.token);
    this.storageService.setItem('auth_email', response.email);
  }

  getToken(): string | null {
    return this.storageService.getItem('auth_token');
  }

  logout(): void {
    this.storageService.removeItem('auth_token');
    this.storageService.removeItem('auth_email');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}