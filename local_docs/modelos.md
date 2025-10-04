# Modelos de Dados

## Visão Geral

Esta documentação descreve todos os modelos de dados utilizados no projeto ToDoList, tanto no backend quanto no frontend.

## Backend Models

### ApplicationUser (Identity)

Modelo que estende o usuário padrão do ASP.NET Core Identity.

```csharp
public class ApplicationUser : IdentityUser
{
    // Herda propriedades como:
    // - Id (string)
    // - UserName (string)
    // - Email (string)
    // - PasswordHash (string)
    // - SecurityStamp (string)
    // - ConcurrencyStamp (string)
    // - PhoneNumber (string)
    // - TwoFactorEnabled (bool)
    // - LockoutEnd (DateTimeOffset?)
    // - AccessFailedCount (int)
    // - EmailConfirmed (bool)
    // - PhoneNumberConfirmed (bool)
    // - LockoutEnabled (bool)
}
```

### ToDoItem

Modelo principal para representar uma tarefa.

```csharp
public class ToDoItem
{
    public int Id { get; set; }
    public string UserId { get; set; } // Referência ao usuário dono da tarefa
    public string Title { get; set; }
    public string? Description { get; set; }
    public bool IsComplete { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Campos adicionais
    public DateOnly? DueDate { get; set; }
    public string? Priority { get; set; } // "Alta", "Média", "Baixa"
    public string? Category { get; set; } // "Trabalho", "Pessoal", "Estudos"
}
```

## DTOs (Data Transfer Objects)

### CreateToDoItemDto

DTO para criação de tarefas.

```csharp
public class CreateToDoItemDto
{
    public string Title { get; set; }
    public string? Description { get; set; }
    public DateOnly? DueDate { get; set; }
    public string? Priority { get; set; }
    public string? Category { get; set; }
}
```

### UpdateToDoItemDto

DTO para atualização de tarefas.

```csharp
public class UpdateToDoItemDto
{
    public string Title { get; set; } = string.Empty;
    public bool? IsComplete { get; set; }
    public DateOnly? DueDate { get; set; }
    public string? Priority { get; set; }
    public string? Category { get; set; }
}
```

### ToDoItemDto

DTO para retorno de tarefas.

```csharp
public class ToDoItemDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsComplete { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Campos adicionais
    public DateOnly? DueDate { get; set; }
    public string? Priority { get; set; }
    public string? Category { get; set; }
}
```

### Auth Models

#### LoginModel

Modelo para autenticação.

```csharp
public class LoginModel
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
```

#### RegisterModel

Modelo para registro de usuário.

```csharp
public class RegisterModel
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;
    
    [Required]
    [Compare(nameof(Password))]
    public string ConfirmPassword { get; set; } = string.Empty;
}
```

## Frontend Models

### ToDoItem (Interface TypeScript)

Interface para representar uma tarefa no frontend.

```typescript
export interface ToDoItem {
  id: number;
  title: string;
  isComplete: boolean;
  createdAt: string;
  dueDate?: string;
  priority?: 'Alta' | 'Média' | 'Baixa';
  category?: string;  
  description?: string;
}
```

### Auth Models (Interfaces TypeScript)

#### LoginModel

```typescript
export interface LoginModel {
  email: string;
  password: string;
}
```

#### RegisterModel

```typescript
export interface RegisterModel extends LoginModel {
  confirmPassword: string;
}
```

#### TokenResponse

```typescript
export interface TokenResponse {
  token: string;
  email: string;
}
```

## Relacionamentos

### Diagrama de Relacionamento

```
[ApplicationUser] 1 ---- * [ToDoItem]
    |
    | (UserId)
    |
[Identity Tables] (AspNetUsers, AspNetRoles, etc.)
```

### Explanations

1. **ApplicationUser** - Herda de `IdentityUser` e representa os usuários do sistema
2. **ToDoItem** - Cada tarefa pertence a um usuário (relacionamento 1 para muitos)
3. **Identity Tables** - Tabelas geradas automaticamente pelo ASP.NET Core Identity (não diretamente acessadas)

## Validações

### Backend Validations

- `ToDoItem.Title` é obrigatório
- `RegisterModel.Password` deve ter no mínimo 6 caracteres
- `RegisterModel.ConfirmPassword` deve coincidir com `Password`
- `LoginModel.Email` deve ser um endereço de e-mail válido

### Frontend Validations

- Validação de formulários reativos com Angular
- Validação de campos obrigatórios
- Validação de formato de e-mail

## Migrations

O projeto utiliza Entity Framework Core Migrations para gerenciar alterações no schema do banco de dados:

```bash
# Criar uma nova migration
dotnet ef migrations add NomeDaMigration

# Atualizar o banco de dados
dotnet ef database update

# Verificar status das migrations
dotnet ef migrations list
```

## Banco de Dados

### PostgreSQL

- Versão recomendada: 15 ou superior
- Conexão configurada no `appsettings.json`
- Utiliza Entity Framework Core como ORM

### Tabelas Geradas

1. **AspNetUsers** - Tabela de usuários (Identity)
2. **AspNetRoles** - Tabela de papéis (Identity)
3. **AspNetUserRoles** - Relacionamento entre usuários e papéis (Identity)
4. **AspNetUserClaims** - Claims de usuários (Identity)
5. **AspNetUserLogins** - Login externos (Identity)
6. **AspNetUserTokens** - Tokens de autenticação (Identity)
7. **ToDoItems** - Tabela personalizada para tarefas

## Considerações de Design

### Normalização

- Tabelas estão normalizadas para minimizar redundância
- Relacionamentos definidos corretamente com chaves estrangeiras

### Performance

- Índices adequados definidos automaticamente pelo EF Core
- Consultas otimizadas com `.Include()` quando necessário
- Paginação implementada para listas grandes

### Segurança

- Cada usuário só pode acessar suas próprias tarefas
- Validação de propriedade de tarefa em cada operação
- Não há acesso direto ao ID do usuário fora da autenticação