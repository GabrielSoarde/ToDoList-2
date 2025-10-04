# Documentação da API

## Visão Geral

Esta documentação descreve todos os endpoints da API REST do projeto ToDoList, incluindo autenticação, gerenciamento de tarefas e segurança.

## Configuração Base

- **Base URL**: `http://localhost:5269/api` (durante desenvolvimento)
- **Protocolo**: HTTP/HTTPS
- **Formato de Dados**: JSON
- **Autenticação**: JWT Bearer Token

## Autenticação

### Headers Requeridos

Todos os endpoints protegidos requerem o header de autorização:

```
Authorization: Bearer <token_jwt_aqui>
```

## Endpoints Disponíveis

### Autenticação

#### POST /api/Auth/register

Registra um novo usuário no sistema.

**Headers:**
- `Content-Type: application/json`

**Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "confirmPassword": "senha123"
}
```

**Respostas:**
- `200 OK` - Usuário criado com sucesso
- `400 Bad Request` - Dados inválidos ou senhas não coincidem
- `409 Conflict` - E-mail já cadastrado

#### POST /api/Auth/login

Autentica um usuário existente.

**Headers:**
- `Content-Type: application/json`

**Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Respostas:**
- `200 OK` - Login bem-sucedido
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "email": "usuario@exemplo.com"
  }
  ```
- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Credenciais inválidas

### Gerenciamento de Tarefas

**Requisitos:**
- Todos os endpoints abaixo requerem autenticação JWT válida
- Acesso restrito às tarefas do usuário autenticado

#### GET /api/ToDoItems

Retorna todas as tarefas do usuário autenticado.

**Headers:**
- `Authorization: Bearer <token>`

**Respostas:**
- `200 OK` - Lista de tarefas retornada com sucesso
  ```json
  [
    {
      "id": 1,
      "title": "Tarefa Exemplo",
      "description": "Descrição da tarefa",
      "isComplete": false,
      "createdAt": "2025-01-01T10:00:00.000Z",
      "dueDate": "2025-01-10",
      "priority": "Média",
      "category": "Trabalho"
    }
  ]
  ```
- `401 Unauthorized` - Token inválido ou expirado

#### GET /api/ToDoItems/{id}

Retorna uma tarefa específica do usuário autenticado.

**Parâmetros:**
- `id` (path): ID da tarefa (inteiro)

**Headers:**
- `Authorization: Bearer <token>`

**Respostas:**
- `200 OK` - Tarefa retornada com sucesso
- `401 Unauthorized` - Token inválido ou expirado
- `403 Forbidden` - Tarefa não pertence ao usuário
- `404 Not Found` - Tarefa não encontrada

#### POST /api/ToDoItems

Cria uma nova tarefa para o usuário autenticado.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body:**
```json
{
  "title": "Nova Tarefa",
  "description": "Descrição da nova tarefa",
  "dueDate": "2025-01-15",
  "priority": "Alta",
  "category": "Pessoal"
}
```

**Respostas:**
- `201 Created` - Tarefa criada com sucesso
- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Token inválido ou expirado

#### PUT /api/ToDoItems/{id}

Atualiza uma tarefa específica do usuário autenticado.

**Parâmetros:**
- `id` (path): ID da tarefa (inteiro)

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body:**
```json
{
  "title": "Título Atualizado",
  "isComplete": true,
  "dueDate": "2025-01-20",
  "priority": "Baixa",
  "category": "Estudos"
}
```

**Respostas:**
- `204 No Content` - Tarefa atualizada com sucesso
- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Token inválido ou expirado
- `403 Forbidden` - Tarefa não pertence ao usuário
- `404 Not Found` - Tarefa não encontrada

#### DELETE /api/ToDoItems/{id}

Exclui uma tarefa específica do usuário autenticado.

**Parâmetros:**
- `id` (path): ID da tarefa (inteiro)

**Headers:**
- `Authorization: Bearer <token>`

**Respostas:**
- `204 No Content` - Tarefa excluída com sucesso
- `401 Unauthorized` - Token inválido ou expirado
- `403 Forbidden` - Tarefa não pertence ao usuário
- `404 Not Found` - Tarefa não encontrada

## Códigos de Status HTTP

### 2xx - Sucesso
- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Requisição bem-sucedida, sem conteúdo para retornar

### 4xx - Erros do Cliente
- `400 Bad Request` - Requisição inválida ou dados incorretos
- `401 Unauthorized` - Falha na autenticação
- `403 Forbidden` - Acesso proibido (sem permissão)
- `404 Not Found` - Recurso não encontrado
- `409 Conflict` - Conflito (ex: e-mail duplicado)

### 5xx - Erros do Servidor
- `500 Internal Server Error` - Erro interno do servidor

## Exemplos de Requisições

### Exemplo de requisição para criar uma tarefa:

```bash
curl -X POST http://localhost:5269/api/ToDoItems \
  -H "Authorization: Bearer seu_token_aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nova Tarefa de Exemplo",
    "description": "Descrição da tarefa",
    "dueDate": "2025-01-30",
    "priority": "Média",
    "category": "Trabalho"
  }'
```

### Exemplo de requisição para obter tarefas:

```bash
curl -X GET http://localhost:5269/api/ToDoItems \
  -H "Authorization: Bearer seu_token_aqui"
```

## Validações

### Campos Obrigatórios
- `title` - Requerido para criação e atualização
- `email` - Requerido para login e registro
- `password` - Requerido para login e registro

### Formatos e Limites
- `email` - Formato de e-mail válido
- `password` - Mínimo de 6 caracteres
- `title` - Obrigatório, máximo definido pelo banco
- `priority` - Valores permitidos: "Alta", "Média", "Baixa"
- `category` - Valores permitidos: "Trabalho", "Pessoal", "Estudos" ou outras categorias personalizadas

## Segurança

### Validação de Propriedade
- Cada operação verifica se o recurso solicitado pertence ao usuário autenticado
- Usuários só podem acessar suas próprias tarefas
- Tokens JWT são validados em cada requisição protegida

### Proteção contra Ataques
- Bloqueio de conta após 5 tentativas de login falhas
- Tokens JWT com validade reduzida (2 horas)
- Proteção contra enumeração de usuários
- Validação de dados de entrada para prevenir injeção

## Erros Comuns e Soluções

### Token Expirado
- Solução: Faça login novamente para obter um novo token

### Acesso Negado
- Solução: Verifique se o token é válido e se está tentando acessar tarefas de outro usuário

### Erro 404 em ID Válido
- Observação: Pode ocorrer quando tenta acessar uma tarefa que não pertence ao usuário, mesmo que o ID exista