// Define a estrutura para a requisição de Login
export interface LoginModel {
  email: string;
  password: string;
}

// Define a estrutura para a requisição de Registro
export interface RegisterModel extends LoginModel {
  confirmPassword: string;
}

// Define a estrutura da resposta que a API envia no Login
export interface TokenResponse {
  token: string;
  email: string;
}