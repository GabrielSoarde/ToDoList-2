# 1. Estrutura do Projeto

Este documento descreve a arquitetura de pastas e arquivos do projeto, tanto para o frontend em Angular quanto para o backend em .NET.

## Backend (.NET)

O backend segue a estrutura padrão de uma API .NET, com uma clara separação de responsabilidades.

```
backend/ToDoList.Api/
├── Controllers/    # Controladores da API (endpoints)
├── Data/           # Contexto do Entity Framework
├── Identity/       # Classes relacionadas ao ASP.NET Identity
├── Migrations/     # Migrações do banco de dados
├── Models/         # Modelos de domínio e DTOs
├── Services/       # Lógica de negócio
├── Program.cs      # Ponto de entrada da aplicação
└── ToDoList.Api.csproj
```

-   **`Controllers`**: Responsáveis por receber as requisições HTTP e retornar as respostas. Devem ser "magros", delegando a lógica de negócio para os `Services`.
-   **`Data`**: Contém o `DbContext` do Entity Framework, que representa a sessão com o banco de dados.
-   **`Identity`**: Classes de customização do ASP.NET Identity, como `ApplicationUser`.
-   **`Models`**: Contém as entidades do banco de dados (ex: `ToDoItem`) e os DTOs (Data Transfer Objects) para transferência de dados entre o cliente e o servidor (ex: `CreateToDoItemDto`).
-   **`Services`**: Onde a lógica de negócio é implementada. Os `Controllers` injetam os `Services` para executar as operações.

## Frontend (Angular)

O frontend utiliza uma arquitetura modular e escalável, com foco em componentes reutilizáveis.

```
frontend/todolist-ui/
└── src/
    ├── app/
    │   ├── components/   # Componentes reutilizáveis
    │   │   ├── auth/
    │   │   └── todo/
    │   ├── guards/       # Guards de rota (ex: auth.guard.ts)
    │   ├── interceptors/ # Interceptadores HTTP (ex: jwt-interceptor.ts)
    │   ├── models/       # Modelos/interfaces TypeScript
    │   ├── services/     # Serviços (lógica de negócio e chamadas HTTP)
    │   ├── app.component.ts
    │   ├── app.config.ts
    │   └── app.routes.ts
    ├── assets/         # Imagens, fontes e outros arquivos estáticos
    ├── environments/   # Configurações de ambiente (dev, prod)
    └── styles.scss     # Estilos globais
```

-   **`components`**: O coração da aplicação. Cada componente deve ter uma única responsabilidade. Componentes complexos devem ser divididos em subcomponentes.
-   **`guards`**: Lógica para permitir ou bloquear o acesso a rotas. Ideal para proteger rotas que exigem autenticação.
-   **`interceptors`**: Permitem interceptar requisições e respostas HTTP para adicionar cabeçalhos (como o de autorização), tratar erros de forma global, etc.
-   **`models`**: Interfaces TypeScript que definem a estrutura dos objetos utilizados na aplicação (ex: `ToDoItem`).
-   **`services`**: Centralizam a lógica de negócio e a comunicação com a API. Componentes injetam serviços para obter e enviar dados.
-   **`styles.scss`**: Arquivo de estilo global. Use-o para definir variáveis de cores, fontes e estilos que se aplicam a toda a aplicação. Evite colocar estilos de componentes específicos aqui.
