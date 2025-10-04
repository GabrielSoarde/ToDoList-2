# Frontend

## Visão Geral

Este documento descreve a estrutura, componentes e práticas de desenvolvimento do frontend da aplicação ToDoList, construído com Angular 20.

## Tecnologias Utilizadas

- **Framework**: Angular 20
- **Linguagem**: TypeScript
- **Gerenciamento de Pacotes**: npm
- **Bundler**: Angular CLI (baseado no Vite ou Webpack)
- **Estilização**: CSS
- **Formulários**: Reactive Forms
- **State Management**: Signals (nativos do Angular)

## Estrutura de Pastas

```
frontend/todolist-ui/
├── src/
│   ├── app/
│   │   ├── app.component.ts       # Componente raiz
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   ├── app.config.ts          # Configurações da aplicação
│   │   ├── app.routes.ts          # Rotas da aplicação
│   │   ├── components/            # Componentes reutilizáveis
│   │   │   ├── auth/
│   │   │   │   └── login-register/
│   │   │   │       ├── login-register.component.ts
│   │   │   │       ├── login-register.component.html
│   │   │   │       └── login-register.component.css
│   │   │   └── todo/
│   │   │       └── todo-list/
│   │   │           ├── todo-list.component.ts
│   │   │           ├── todo-list.component.html
│   │   │           └── todo-list.component.css
│   │   ├── guards/                # Guards de rota
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/          # Interceptors HTTP
│   │   │   └── jwt-interceptor.ts
│   │   ├── models/                # Modelos de dados
│   │   │   ├── todo-item.model.ts
│   │   │   └── auth.model.ts
│   │   ├── services/              # Serviços de comunicação
│   │   │   ├── auth.service.ts
│   │   │   ├── todo.service.ts
│   │   │   └── storage.service.ts
│   │   └── environments/          # Variáveis de ambiente
│   │       ├── environment.ts
│   │       └── environment.prod.ts
│   ├── assets/                    # Recursos estáticos
│   ├── styles.css                # Estilos globais
│   └── index.html                # Ponto de entrada HTML
├── package.json                  # Dependências e scripts
├── angular.json                  # Configuração do Angular CLI
└── tsconfig.json                 # Configuração do TypeScript
```

## Componentes Principais

### 1. LoginRegisterComponent

**Responsabilidade**: Gerenciar autenticação de usuários (login e registro).

**Recursos**:
- Formulários reativos para login e registro
- Validação de campos (email, senhas coincidentes)
- Manipulação de erros de autenticação
- Alternância entre modos de login e registro

**Técnicas Utilizadas**:
- `FormGroup` e `FormControl` para formulários reativos
- `FormBuilder` para criação de formulários
- `Validators` para validação de campos
- `AuthService` para comunicação com backend

### 2. ToDoListComponent

**Responsabilidade**: Exibir e gerenciar tarefas do usuário autenticado.

**Recursos**:
- Listagem de tarefas com filtros
- Criação, edição e exclusão de tarefas
- Atualização de status (completo/incompleto)
- Filtros por status, categoria e busca textual
- Estado reativo com Angular Signals

**Técnicas Utilizadas**:
- `signal()` para gerenciamento de estado
- `computed()` para dados derivados
- `ReactiveFormsModule` e `FormsModule`
- `DatePipe` para formatação de datas
- `ToDoService` para comunicação com backend

## Serviços

### 1. AuthService

**Responsabilidade**: Gerenciar autenticação e estado de login do usuário.

**Métodos Principais**:
- `register()` - Registrar novo usuário
- `login()` - Autenticar usuário
- `logout()` - Deslogar usuário
- `isLoggedIn()` - Verificar se usuário está logado
- `getToken()` - Obter token JWT

### 2. ToDoService

**Responsabilidade**: Comunicar-se com a API backend para operações de tarefas.

**Métodos Principais**:
- `getAll()` - Obter todas as tarefas do usuário
- `add()` - Adicionar nova tarefa
- `update()` - Atualizar tarefa existente
- `delete()` - Excluir tarefa

### 3. StorageService

**Responsabilidade**: Abstrair o armazenamento local (localStorage).

**Métodos Principais**:
- `setItem()` - Armazenar item
- `getItem()` - Obter item
- `removeItem()` - Remover item

## Interceptors

### JwtInterceptor

**Responsabilidade**: Adicionar automaticamente o token JWT a todas as requisições HTTP que vão para a API.

**Funcionamento**:
- Intercepta todas as requisições HTTP
- Verifica se o endpoint é da API (baseado na URL)
- Adiciona o header `Authorization: Bearer <token>` se disponível

## Guards

### AuthGuard

**Responsabilidade**: Proteger rotas que exigem autenticação.

**Funcionamento**:
- Verifica se o usuário está autenticado
- Redireciona para tela de login se não estiver autenticado
- Permite acesso à rota se o usuário estiver autenticado

## Modelos de Dados

### ToDoItem (Interface)

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

### Auth Models

Interfaces para autenticação:
- `LoginModel`
- `RegisterModel`
- `TokenResponse`

## Rotas

### Estratégia de Roteamento

```typescript
export const routes: Routes = [
  { 
    path: 'auth', 
    component: LoginRegisterComponent,
    title: 'Login / Registrar'
  },
  {
    path: 'tasks',
    component: ToDoListComponent,
    title: 'Minhas Tarefas',
    canActivate: [authGuard]
  },
  { 
    path: '', 
    redirectTo: 'auth', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: 'auth' 
  }
];
```

## Práticas de Código

### Signals vs Observables

**Signals**:
- Utilizados para estado local/componente
- Atualizações reativas e eficientes
- Mais simples para casos de uso diretos

**Observables**:
- Utilizados para eventos assíncronos
- Comunicação com backend via HttpClient
- Operadores RxJS para transformação de dados

### Gerenciamento de Estado

```typescript
// Exemplo de uso de signals
tasks = signal<ToDoItem[]>([]);
editingTask = signal<ToDoItem | null>(null);
filter = signal<'all' | 'pending' | 'completed'>('all');
searchTerm = signal<string>('');
selectedCategory = signal<string>('Todas');

// Exemplo de uso de computed
completedCount = computed(() => this.tasks().filter(t => t.isComplete).length);
filteredTasks = computed(() => {
  const allTasks = this.tasks();
  const currentFilter = this.filter();
  const currentSearch = this.searchTerm().toLowerCase();
  const currentCategory = this.selectedCategory();

  return allTasks.filter(task => {
    if (currentFilter === 'completed' && !task.isComplete) return false;
    if (currentFilter === 'pending' && task.isComplete) return false;
    if (currentSearch && !task.title.toLowerCase().includes(currentSearch)) return false;
    if (currentCategory !== 'Todas' && task.category !== currentCategory) return false;
    return true;
  });
});
```

### Tratamento de Erros

- Tratamento de erros HTTP com RxJS
- Exibição de mensagens de erro ao usuário
- Feedback visual para operações assíncronas
- Estados de loading onde apropriado

### Formulários Reativos

- Validação baseada em regras
- Feedback de erro em tempo real
- Manipulação de estados de formulário
- Desabilitação de botões em operações assíncronas

## Estilização

### Abordagem CSS

- CSS modularizado por componente
- Variáveis CSS para cores e estilos consistentes
- Design responsivo para diferentes dispositivos
- Estilos consistentes com guidelines de UX

### Estratégia de Estilo

```css
/* Variáveis CSS definidas */
:root {
    --primary-color: #007bff; /* Azul */
    --secondary-color: #6c757d; /* Cinza */
    --success-color: #28a745; /* Verde */
    --danger-color: #dc3545; /* Vermelho */
    --bg-light: #f8f9fa;
    --border-color: #ccc;
    --font-family: 'Arial', sans-serif;
}
```

## Performance

### Técnicas Implementadas

- `OnPush` change detection (implícito em componentes standalone)
- Lazy loading de módulos (implícito com rotas standalone)
- Signals para atualizações eficientes
- Manipulação otimizada de listas com `trackBy` (onde aplicável)

### Boas Práticas

- Componentes pequenos e focados
- Evitar operações pesadas no template
- Utilizar `async` pipe para Observables
- Implementar paginação para listas grandes

## Segurança no Frontend

### Armazenamento de Tokens

- Tokens JWT armazenados no localStorage
- Acesso controlado através de AuthService

### Proteção Contra XSS

- Angular fornece proteção XSS por padrão
- Não uso de innerHTML sem sanitização
- Validação de dados provenientes da API

## Testes

### Estratégia de Testes

- Testes unitários para services
- Testes de componente para UI
- Testes de integração para fluxos críticos

### Recursos Utilizados

- Jasmine para estrutura de testes
- Karma para execução de testes
- TestBed para configuração de componentes

## Ambientes

### Variáveis de Ambiente

- `environment.ts` para desenvolvimento
- `environment.prod.ts` para produção
- URL da API configurável por ambiente

```typescript
// Exemplo
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5269/api'
};
```

## Build e Deploy

### Scripts Disponíveis

**package.json**:
```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  }
}
```

### Build para Produção

```bash
ng build --configuration production
```

## Melhorias Recomendadas

### Para Futuras Iterações

1. **State Management Avançado**: Considerar NgRx ou implementação customizada para estados complexos
2. **Service Workers**: Implementar PWA com cache offline
3. **Lazy Loading de Componentes**: Carregar componentes sob demanda
4. **Internationalization (i18n)**: Suporte a múltiplos idiomas
5. **Accessibility (a11y)**: Melhorar acessibilidade com ARIA labels
6. **Performance Monitoramento**: Implementar ferramentas de monitoramento de performance
7. **Type Safety**: Aproveitar ao máximo os recursos de tipagem do TypeScript