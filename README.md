# To-Do List App

Um aplicativo de lista de tarefas (**To-Do List**) desenvolvido com **Angular 17** no frontend e **.NET 8** no backend, permitindo que os usuários gerenciem suas tarefas de forma prática e responsiva.

---

## 🖥️ Tecnologias Utilizadas

**Frontend**
- Angular 17  
- TypeScript  
- HTML5 & CSS3  

**Backend**
- .NET 8  
- C#  
- ASP.NET Core Web API  

---

## 🚀 Funcionalidades

- Listar, adicionar, editar e remover tarefas  
- Marcar tarefas como concluídas  
- Autenticação básica com botão de **logout**  
- Interface responsiva e estilizada  
- Integração frontend-backend via API REST  

---

## 📂 Estrutura do Projeto

```
ToDoListApp/
├── backend/
│   └── ToDoList.Api/           # API em .NET 8
├── frontend/
│   └── todolist-ui/            # Frontend em Angular 17
└── README.md
```

---

## ⚙️ Como Rodar o Projeto

### Backend (.NET 8)
1. Abra o terminal na pasta `backend/ToDoList.Api`
2. Execute:
   ```bash
   dotnet restore
   dotnet run
   ```
3. A API estará disponível em `https://localhost:5001` (ou porta configurada)

### Frontend (Angular 17)
1. Abra o terminal na pasta `frontend/todolist-ui`
2. Instale dependências:
   ```bash
   npm install
   ```
3. Execute o projeto:
   ```bash
   ng serve
   ```
4. Acesse `http://localhost:4200`

---

## 🔐 Logout

No canto superior direito da aplicação, há um botão **Sair** que encerra a sessão do usuário.

---

## 📌 Observações

- A aplicação ainda pode ser expandida com autenticação completa, persistência de dados em banco SQL, e filtros por status de tarefa.
- Todo o layout é **responsivo** e funciona bem em desktops e dispositivos móveis.

---

## 📝 Autor

**Gabriel**  
Desenvolvedor Fullstack iniciante, estudando Angular e .NET 8.

