import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // Importação essencial do arquivo de rotas

// -------------------------------------------------------------
// Se o seu AppComponent não estiver em './app/app.component',
// ajuste o caminho acima para onde ele realmente está.
// -------------------------------------------------------------

import { JwtInterceptor } from './app/interceptors/jwt-interceptor'; // Caminho para seu Interceptor


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Habilita o sistema de rotas
    
    // Configura o HTTP Client e registra o Interceptor
    provideHttpClient(
      withInterceptors([
        JwtInterceptor // Adiciona o seu interceptor
      ])
    ),
  ]
}).catch(err => console.error(err));