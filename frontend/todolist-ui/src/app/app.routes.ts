// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { LoginRegisterComponent } from './components/auth/login-register/login-register.component'; 
import { ToDoListComponent } from './components/todo/todo-list/todo-list.component';

export const routes: Routes = [
    { 
        path: 'auth', 
        component: LoginRegisterComponent,
        title: 'Login / Registrar'
    },
    {
        path: 'tasks',
        component: ToDoListComponent,
        title: 'Minhas Tarefas'
        // Futuramente, adicionaremos um AuthGuard aqui para proteger esta rota
    },
    // Redireciona a rota base para a tela de autenticação
    { 
        path: '', 
        redirectTo: 'tasks', // Podemos iniciar na lista se o usuário já estiver logado
        pathMatch: 'full' 
    },
    { path: '**', redirectTo: 'tasks' } // Qualquer rota desconhecida
];