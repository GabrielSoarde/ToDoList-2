# Arquitetura do Projeto

## Visão Geral

A aplicação ToDoList segue uma arquitetura full-stack moderna com separação clara de responsabilidades entre os componentes.

## Estrutura Geral

```
[Frontend Angular] ↔ [API REST ASP.NET Core] ↔ [Entity Framework] ↔ [PostgreSQL]
```

## Camadas da Aplicação

### Backend (ASP.NET Core Web API)

#### Estrutura de Camadas

```
Controllers (Endpoints HTTP)
    ↓
Services (Lógica de Negócio)
    ↓
Data Access (Entity Framework Core)
    ↓
Models (Entidades de Domínio)
```

#### Componentes Principais

- **Controllers**: Ponto de entrada para requisições HTTP
- **Services**: Implementam lógica de negócios e regras de domínio
- **Data Access**: Camada de persistência com Entity Framework
- **Models/DTOs**: Estruturas de dados e transferência

### Frontend (Angular)

#### Estrutura de Componentes

```
Components (Interface do Usuário)
    ↓
Services (Comunicação com API)
    ↓
Models (Estrutura de Dados)
    ↓
Interceptors (Tratamento Global)
```

#### Componentes Principais

- **Components**: Elementos da interface com lógica de apresentação
- **Services**: Lógica de comunicação com backend
- **Models**: Definição de estruturas de dados
- **Interceptors**: Tratamento global de requisições/respostas

## Padrões de Projeto Utilizados

### Backend
- **Dependency Injection**: Injeção de dependências para gerenciamento de objetos
- **Repository Pattern**: Abstração da lógica de acesso a dados
- **Clean Architecture**: Separação de preocupações com camadas bem definidas
- **DTO Pattern**: Separação das representações de dados entre camadas

### Frontend
- **Component-Based Architecture**: Componentes reutilizáveis e modulares
- **Service Pattern**: Lógica de negócios compartilhada
- **State Management**: Gerenciamento de estado com Signals

## Fluxo de Requisição

1. Usuário interage com o Frontend
2. Frontend faz requisição HTTP para a API
3. API valida autenticação (JWT)
4. API executa lógica de negócios na camada de serviço
5. API acessa dados via Entity Framework
6. Resposta é retornada ao Frontend
7. Frontend atualiza interface

## Tecnologias Utilizadas

### Backend
- .NET 9
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- ASP.NET Core Identity
- JWT Authentication

### Frontend
- Angular 20
- TypeScript
- RxJS
- HttpClient
- Signals (Reactive State)

## Banco de Dados

- PostgreSQL com Entity Framework Core
- Migrations para controle de versão do schema
- ASP.NET Core Identity para gerenciamento de usuários