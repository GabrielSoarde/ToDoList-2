import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { FormsModule } from '@angular/forms';
import { importProvidersFrom } from '@angular/core';

import { JwtInterceptor } from './app/interceptors/jwt-interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // <-- aqui você conecta suas rotas
    provideHttpClient(withInterceptors([JwtInterceptor])),
    importProvidersFrom(FormsModule) // habilita [(ngModel)]
  ]
}).catch(err => console.error(err));
