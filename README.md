# 📝 ToDoList-2

![.NET](https://img.shields.io/badge/.NET-9.0-green) ![Angular](https://img.shields.io/badge/Angular-20-red) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue) ![License](https://img.shields.io/badge/License-MIT-lightgrey)

**ToDoList-2** é uma aplicação moderna de lista de tarefas com **frontend em Angular 20** e **backend em .NET 9**, utilizando **PostgreSQL**. Permite criar, listar, editar, remover e marcar tarefas como concluídas, com autenticação JWT, datas de vencimento, prioridades e categorias.

---

## 🚀 Tecnologias

- **Frontend:** Angular 20, TypeScript, HTML5, CSS3  
- **Backend:** .NET 9, C#, ASP.NET Core Web API  
- **Banco de Dados:** PostgreSQL  
- **Autenticação:** JWT (JSON Web Token) com ASP.NET Core Identity

---

## ✅ Funcionalidades

| Funcionalidade                           | Status |
|------------------------------------------|--------|
| Criar tarefas                            | ✅     |
| Listar tarefas                           | ✅     |
| Editar tarefas                           | ✅     |
| Remover tarefas                          | ✅     |
| Marcar tarefas como concluídas           | ✅     |
| Autenticação e logout                    | ✅     |
| Interface responsiva                     | ✅     |
| Integração completa via API REST         | ✅     |
| Datas de vencimento                      | ✅     |
| Prioridades (Alta/Média/Baixa)           | ✅     |
| Categorias (Trabalho, Pessoal, Estudos)  | ✅     |
| Filtragem e busca de tarefas             | ✅     |
| Segurança: acesso apenas às próprias tarefas | ✅     |

---

## 📂 Estrutura do Projeto

```
ToDoList-2/
├── backend/             # API em .NET 9
│   └── ToDoList.Api/
├── frontend/            # Frontend em Angular 20
│   └── todolist-ui/
├── .gitignore
└── README.md
```

---

## ⚙️ Pré-requisitos

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)  
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

> ⚠️ **Aviso de Segurança:** Em produção, armazene a senha do banco de dados em variáveis de ambiente ou Azure Key Vault, e não no arquivo `appsettings.json`.

### 2. Rodando o backend

```bash
cd backend/ToDoList.Api/
dotnet restore
dotnet ef database update
dotnet run
```

> O backend rodará geralmente em `http://localhost:5269` (ou `https://localhost:7199`).

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

## 🔐 Segurança

- A autenticação é feita com JWT tokens
- Cada usuário só pode acessar suas próprias tarefas
- Proteção contra ataques de força bruta com bloqueio de conta
- O token JWT expira após 2 horas

---

## 🔑 Testando a API com JWT

Use o JWT retornado ao fazer login para acessar endpoints protegidos:

```
GET http://localhost:5269/api/ToDoItems
Header:
Authorization: Bearer <seu_token_jwt>
```

---

## ⚡ Comandos Úteis

### Backend
```bash
# Restaurar dependências
dotnet restore

# Rodar migrations
dotnet ef database update

# Rodar aplicação
dotnet run

# Buildar aplicação
dotnet build

# Rodar testes (se existirem)
dotnet test
```

### Frontend
```bash
# Instalar dependências
npm install

# Rodar aplicação em modo desenvolvimento
ng serve

# Buildar aplicação para produção
ng build

# Rodar testes
ng test

# Rodar lint
ng lint
```

---

## 🌟 Melhorias Futuras

- Autenticação com roles e permissões  
- Testes unitários e de integração  
- Notificações de tarefas próximas do vencimento  
- Exportar tarefas para PDF/Excel  
- Recuperação de senha por email

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 🐛 Troubleshooting

### Problemas com banco de dados
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `appsettings.json`
- Execute `dotnet ef database update` para aplicar as migrations

### Problemas com autenticação
- Verifique se os endpoints estão corretos
- Confirme que o CORS permite a origem do frontend

### Problemas com frontend
- Execute `npm install` após clonar o repositório
- Confirme que o backend está rodando antes de testar a aplicação

---

## 📄 Licença

MIT License – uso pessoal ou educacional.

---

## 🔗 Links Úteis

- [Angular](https://angular.io/)  
- [.NET 9](https://dotnet.microsoft.com/en-us/download/dotnet/9.0)  
- [PostgreSQL](https://www.postgresql.org/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
