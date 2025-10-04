// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { LoginRegisterComponent } from './components/auth/login-register/login-register.component'; 
import { ToDoListComponent } from './components/todo/todo-list/todo-list.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { 
        path: 'auth', 
        component: LoginRegisterComponent,
        title: 'Login / Registrar'
    },
    {
        path: 'tasks',
        component: ToDoListComponent,
        title: 'Minhas Tarefas',
        canActivate: [authGuard]
    },
    // Redireciona a rota base para a tela de autenticação
    { 
        path: '', 
        redirectTo: 'auth', // Começa no login/registro para usuários não logados
        pathMatch: 'full' 
    },
    // Qualquer rota desconhecida redireciona para o login/registro
    { 
        path: '**', 
        redirectTo: 'auth' 
    }
];
