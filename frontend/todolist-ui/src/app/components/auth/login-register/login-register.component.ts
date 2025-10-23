import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

// Validador customizado para senhas
export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordsMismatch: true };
  }

  return null;
}

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit {
  isLoginMode = true;
  errorMessage = '';

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, 
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordsMatchValidator });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tasks']);
    }
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.loginForm.reset();
    this.registerForm.reset();
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
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, preencha os campos corretamente.';
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
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
    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor, preencha os campos corretamente.';
       if (this.registerForm.errors?.['passwordsMismatch']) {
        this.errorMessage = 'As senhas não coincidem!';
      }
      return;
    }

    const { email, password, confirmPassword } = this.registerForm.value;

    // O backend espera um Username. Vamos derivá-lo do email.
    const username = email.split('@')[0];

    const registerData = { email, password, confirmPassword, username };

    this.authService.register(registerData).subscribe({
      next: () => {
        this.errorMessage = 'Registro realizado com sucesso! Faça login agora.';
        this.isLoginMode = true;
        this.loginForm.patchValue({ email: this.registerForm.value.email });
      },
      error: (err) => {
        this.errorMessage = err.error?.errors?.[0]?.description || 'Falha no registro. E-mail já em uso ou senha fraca.';
        console.error(err);
      }
    });
  }
}
