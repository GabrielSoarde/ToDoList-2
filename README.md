# 📝 ToDoList-2

![.NET](https://img.shields.io/badge/.NET-8.0-green) ![Angular](https://img.shields.io/badge/Angular-17-red) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue) ![License](https://img.shields.io/badge/License-MIT-lightgrey)

**ToDoList-2** é uma aplicação moderna de lista de tarefas com **frontend em Angular 17** e **backend em .NET 8**, utilizando **PostgreSQL**. Permite criar, listar, editar, remover e marcar tarefas como concluídas, com autenticação JWT.

---

## 🚀 Tecnologias

- **Frontend:** Angular 17, TypeScript, HTML5, CSS3  
- **Backend:** .NET 8, C#, ASP.NET Core Web API  
- **Banco de Dados:** PostgreSQL  
- **Autenticação:** JWT (JSON Web Token)

---

## ✅ Funcionalidades

| Funcionalidade                  | Status |
|---------------------------------|--------|
| Criar tarefas                    | ✅     |
| Listar tarefas                   | ✅     |
| Editar tarefas                   | ✅     |
| Remover tarefas                  | ✅     |
| Marcar tarefas como concluídas   | ✅     |
| Autenticação e logout            | ✅     |
| Interface responsiva             | ✅     |
| Integração completa via API REST | ✅     |

---

## 📂 Estrutura do Projeto

```
ToDoList-2/
├── backend/             # API em .NET 8
│   └── ToDoList.Api/
├── frontend/            # Frontend em Angular 17
│   └── todolist-ui/
├── .gitignore
└── README.md
```

---

## ⚙️ Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)  
- [Node.js e npm](https://nodejs.org/)  
- [Angular CLI](https://angular.io/cli)  
- [PostgreSQL](https://www.postgresql.org/)

---

## 💻 Backend

### 1. Configuração do PostgreSQL
- Crie um banco chamado `todolist_db`  
- Atualize `appsettings.json` se necessário:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=todolist_db;Username=postgres;Password=admin123"
}
```

### 2. Rodando o backend
```bash
cd backend/ToDoList.Api/
dotnet restore
dotnet ef database update
dotnet run
```

> O backend rodará geralmente em `https://localhost:5001`.

---

## 💻 Frontend

### 1. Instale dependências
```bash
cd frontend/todolist-ui/
npm install
```

### 2. Execute o frontend
```bash
ng serve
```

- Abra o navegador: `http://localhost:4200`  
- O frontend se conecta automaticamente ao backend via API REST

---

## 🔑 Testando a API com JWT

Use o JWT retornado ao fazer login para acessar endpoints protegidos:

```
GET https://localhost:5001/api/todo
Header:
Authorization: Bearer <seu_token_jwt>
```

---

## 🌟 Melhorias Futuras

- Autenticação com roles e permissões  
- Filtros e busca de tarefas  
- Preferências do usuário (tema, ordenação)  
- Testes unitários e de integração

---

## 📄 Licença

MIT License – uso pessoal ou educacional.

---

## 🔗 Links Úteis

- [Angular](https://angular.io/)  
- [.NET 8](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)  
- [PostgreSQL](https://www.postgresql.org/)

