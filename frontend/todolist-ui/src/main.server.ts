import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideServerRendering } from '@angular/platform-server';

bootstrapApplication(AppComponent, {
  providers: [
    provideServerRendering()
  ]
});
