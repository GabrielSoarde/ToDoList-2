import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginModel, RegisterModel } from '../../../models/auth.model';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent implements OnInit {
  isLoginMode: boolean = true;

  loginData: LoginModel = { email: '', password: '' };
  registerData: RegisterModel = { email: '', password: '', confirmPassword: '' };

  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Limpa tokens antigos (importante ao recriar o banco)
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_email');
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.isLoginMode) {
      this.handleLogin();
    } else {
      this.handleRegister();
    }
  }

  private handleLogin(): void {
    if (!this.isValidEmail(this.loginData.email)) {
      this.errorMessage = 'E-mail inválido!';
      return;
    }

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        this.authService.setToken(res);
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        this.errorMessage = 'Falha no login. Verifique suas credenciais.';
        console.error(err);
      }
    });
  }

  private handleRegister(): void {
    if (!this.isValidEmail(this.registerData.email)) {
      this.errorMessage = 'E-mail inválido!';
      return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem!';
      return;
    }

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.errorMessage = 'Registro realizado com sucesso! Faça login agora.';
        this.isLoginMode = true;
        this.loginData.email = this.registerData.email;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Falha no registro. E-mail já em uso ou senha fraca.';
        console.error(err);
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}
