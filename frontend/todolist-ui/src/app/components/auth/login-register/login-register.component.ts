// src/app/components/auth/login-register/login-register.component.ts

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Módulo essencial para formulários no Angular
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; // Importar o AuthService
import { LoginModel, RegisterModel } from '../../../models/auth.model';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [FormsModule], // Adicionar FormsModule
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.css'
})
export class LoginRegisterComponent implements OnInit {
  // Estado para alternar entre as visualizações
  isLoginMode: boolean = true; 
  
  // Modelos de dados do formulário
  loginData: LoginModel = { email: '', password: '' };
  registerData: RegisterModel = { email: '', password: '', confirmPassword: '' };
  
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Se o usuário já estiver logado (tiver um token), redireciona imediatamente
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tasks']);
    }
  }

  // Alterna o estado do formulário
  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = ''; // Limpa a mensagem ao trocar
  }

  // Método principal chamado pelo formulário
  onSubmit(): void {
    this.errorMessage = '';
    if (this.isLoginMode) {
      this.handleLogin();
    } else {
      this.handleRegister();
    }
  }

  private handleLogin(): void {
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        // Armazena o token e navega para a lista de tarefas
        this.authService.setToken(response);
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        this.errorMessage = 'Falha no login. Verifique suas credenciais.';
        console.error('Erro de Login:', err);
      }
    });
  }

  private handleRegister(): void {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem!';
      return;
    }

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.errorMessage = 'Registro realizado com sucesso! Faça login agora.';
        this.isLoginMode = true; // Volta para o modo Login
        this.loginData.email = this.registerData.email;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Falha no registro. O e-mail já está em uso ou a senha é fraca.';
        console.error('Erro de Registro:', err);
      }
    });
  }
}