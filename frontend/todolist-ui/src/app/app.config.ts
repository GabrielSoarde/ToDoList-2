import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Importações ESSENCIAIS:
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt-interceptor'; // Importe o seu Interceptor!


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // -------------------------------------------------------------
    // NOVO CÓDIGO: Configurando HTTP e Interceptor
    // -------------------------------------------------------------

    // 1. Habilita o serviço HttpClient (que substitui o HttpClientModule)
    provideHttpClient(
      // 2. Registra os interceptors
      withInterceptors([
        JwtInterceptor // Adiciona o seu interceptor aqui!
        // Se houver outros interceptors, eles entrariam aqui também
      ])
    )
    // -------------------------------------------------------------
  ]
};