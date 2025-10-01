import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Importe seu AuthService

// Usa HttpInterceptorFn (função) ao invés de classes com @Injectable()
export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
  
  // Usa inject() para obter serviços em funções de interceptor
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    // Clona a requisição e adiciona o cabeçalho
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};