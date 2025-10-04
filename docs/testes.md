# Testes

## Visão Geral

Este documento descreve a estratégia, implementação e melhores práticas de testes para a aplicação ToDoList, abrangendo tanto o backend quanto o frontend.

## Estratégia de Testes

### Níveis de Teste

1. **Testes Unitários**: Testam unidades individuais de código (métodos, funções, componentes)
2. **Testes de Integração**: Testam a interação entre diferentes componentes/serviços
3. **Testes de API**: Testam os endpoints da API REST
4. **Testes End-to-End (E2E)**: Testam fluxos completos do usuário (não implementados ainda)

### Cobertura de Testes

- **Objetivo mínimo**: 80% de cobertura para componentes críticos
- **Componentes críticos**: Autenticação, autorização, operações de tarefas
- **Foco em lógica de negócios**: Validações, regras de negócio, segurança

## Backend - Testes

### Frameworks Utilizados

- **xUnit** - Framework de teste para .NET
- **Moq** - Framework de mocking para testes unitários
- **Microsoft.NET.Test.Sdk** - SDK para testes no .NET
- **Entity Framework In-Memory** - Para testes de integração com o banco de dados

### Estrutura de Testes

```
backend/ToDoList.Api.Tests/
├── Unit/
│   ├── Services/
│   │   └── ToDoServiceTests.cs
│   ├── Controllers/
│   │   └── AuthControllerTests.cs
│   └── Models/
│       └── ToDoItemTests.cs
├── Integration/
│   ├── Controllers/
│   │   └── ToDoItemsControllerTests.cs
│   └── Database/
│       └── ToDoListContextTests.cs
└── Fixtures/
    └── TestDatabaseFixture.cs
```

### Testes Unitários

#### Exemplo de Teste Unitário para ToDoService

```csharp
public class ToDoServiceTests
{
    private readonly Mock<ToDoListContext> _mockContext;
    private readonly ToDoService _service;
    private readonly List<ToDoItem> _toDoItems;

    public ToDoServiceTests()
    {
        _toDoItems = new List<ToDoItem>();
        var mockSet = GetMockDbSet();
        
        _mockContext = new Mock<ToDoListContext>();
        _mockContext.Setup(x => x.ToDoItems).Returns(mockSet);
        
        _service = new ToDoService(_mockContext.Object);
    }

    [Fact]
    public async Task GetAllForUser_ReturnsOnlyUsersItems()
    {
        // Arrange
        var userId = "test-user-1";
        var userItems = new List<ToDoItem>
        {
            new ToDoItem { Id = 1, UserId = userId, Title = "Task 1" },
            new ToDoItem { Id = 2, UserId = userId, Title = "Task 2" },
            new ToDoItem { Id = 3, UserId = "other-user", Title = "Other Task" }
        };
        _toDoItems.AddRange(userItems);

        // Act
        var result = await _service.GetAllForUser(userId);

        // Assert
        Assert.Equal(2, result.Count());
        Assert.All(result, item => Assert.Equal(userId, item.UserId));
    }

    private DbSet<ToDoItem> GetMockDbSet()
    {
        var mockSet = new Mock<DbSet<ToDoItem>>();
        mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.Provider).Returns(() => _toDoItems.AsQueryable().Provider);
        mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.Expression).Returns(() => _toDoItems.AsQueryable().Expression);
        mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.ElementType).Returns(() => _toDoItems.AsQueryable().ElementType);
        mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.GetEnumerator()).Returns(() => _toDoItems.GetEnumerator());
        return mockSet.Object;
    }
}
```

### Testes de Integração

#### Exemplo de Teste de Integração para Controller

```csharp
public class ToDoItemsControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private HttpClient _client;

    public ToDoItemsControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GetToDoItems_WithValidToken_ReturnsUserItems()
    {
        // Arrange
        var token = await GetValidJwtToken(); // Método auxiliar para obter token
        _client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/ToDoItems");

        // Assert
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();
        var items = JsonSerializer.Deserialize<IEnumerable<ToDoItemDto>>(responseString);
        
        Assert.NotNull(items);
    }
}
```

### Testes de Modelos e DTOs

```csharp
public class ToDoItemTests
{
    [Fact]
    public void ToDoItem_WhenCreated_HasDefaultValues()
    {
        // Act
        var item = new ToDoItem();

        // Assert
        Assert.Equal(DateTime.UtcNow.Date, item.CreatedAt.Date);
        Assert.False(item.IsComplete);
    }

    [Theory]
    [InlineData("Título de Exemplo")]
    [InlineData("A")]
    [InlineData("Título com mais de 50 caracteres 123456789012345678901234567890")]
    public void ToDoItem_Title_SetCorrectly(string title)
    {
        // Arrange
        var item = new ToDoItem();

        // Act
        item.Title = title;

        // Assert
        Assert.Equal(title, item.Title);
    }
}
```

## Frontend - Testes

### Frameworks Utilizados

- **Jasmine** - Framework de teste para JavaScript/TypeScript
- **Karma** - Test runner para execução de testes
- **Angular TestBed** - Ambiente de teste para componentes Angular
- **HttpClientTestingModule** - Mock do HttpClient para testes de serviço

### Estrutura de Testes

```
frontend/todolist-ui/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── login-register/
│   │   │   │       └── login-register.component.spec.ts
│   │   │   └── todo/
│   │   │       └── todo-list/
│   │   │           └── todo-list.component.spec.ts
│   │   ├── services/
│   │   │   ├── auth.service.spec.ts
│   │   │   └── todo.service.spec.ts
│   │   └── guards/
│   │       └── auth.guard.spec.ts
├── karma.conf.js
└── karma-test-shim.js
```

### Testes Unitários de Componentes

#### Exemplo de Teste para ToDoListComponent

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToDoListComponent } from './todo-list.component';
import { ToDoService } from '../../services/todo.service';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ToDoListComponent', () => {
  let component: ToDoListComponent;
  let fixture: ComponentFixture<ToDoListComponent>;
  let mockToDoService: jasmine.SpyObj<ToDoService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const toDoServiceSpy = jasmine.createSpyObj('ToDoService', ['getAll', 'add', 'update', 'delete']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

    await TestBed.configureTestingModule({
      imports: [ToDoListComponent],
      providers: [
        { provide: ToDoService, useValue: toDoServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
    .compileComponents();

    mockToDoService = TestBed.inject(ToDoService) as jasmine.SpyObj<ToDoService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToDoListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on initialization', () => {
    const mockTasks = [
      { id: 1, title: 'Test Task', isComplete: false, createdAt: '2025-01-01' }
    ];
    mockToDoService.getAll.and.returnValue(of(mockTasks));

    component.ngOnInit();

    expect(mockToDoService.getAll).toHaveBeenCalled();
    expect(component.tasks()).toEqual(mockTasks);
  });

  it('should add a new task', () => {
    const mockTask = { id: 1, title: 'New Task', isComplete: false, createdAt: '2025-01-01' };
    mockToDoService.add.and.returnValue(of(mockTask));
    component.addTaskForm.setValue({
      title: 'New Task',
      description: '',
      dueDate: '',
      priority: 'Baixa',
      category: 'Pessoal'
    });

    component.addTask();

    expect(mockToDoService.add).toHaveBeenCalledWith({
      title: 'New Task',
      description: '',
      dueDate: '',
      priority: 'Baixa',
      category: 'Pessoal'
    });
  });
});
```

### Testes de Serviços

#### Exemplo de Teste para ToDoService

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToDoService } from './todo.service';
import { environment } from '../../environments/environment';

describe('ToDoService', () => {
  let service: ToDoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ToDoService]
    });
    service = TestBed.inject(ToDoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all todo items', () => {
    const mockData: ToDoItem[] = [
      { id: 1, title: 'Task 1', isComplete: false, createdAt: '2025-01-01' },
      { id: 2, title: 'Task 2', isComplete: true, createdAt: '2025-01-02' }
    ];

    service.getAll().subscribe((data) => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/ToDoItems`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should add a new todo item', () => {
    const mockTask: ToDoItem = { id: 1, title: 'Task 1', isComplete: false, createdAt: '2025-01-01' };

    service.add({ title: 'Task 1' }).subscribe((data) => {
      expect(data).toEqual(mockTask);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/ToDoItems`);
    expect(req.request.method).toBe('POST');
    req.flush(mockTask);
  });
});
```

### Testes de Modelos e Interfaces

#### Testes para modelos TypeScript (validação de estrutura)

```typescript
describe('ToDoItem Interface', () => {
  it('should have required properties', () => {
    const item: ToDoItem = {
      id: 1,
      title: 'Test Title',
      isComplete: false,
      createdAt: '2025-01-01T00:00:00Z'
    };

    expect(item.id).toBe(1);
    expect(item.title).toBe('Test Title');
    expect(item.isComplete).toBeFalse();
    expect(item.createdAt).toBe('2025-01-01T00:00:00Z');
  });

  it('should allow optional properties', () => {
    const item: ToDoItem = {
      id: 1,
      title: 'Test Title',
      isComplete: false,
      createdAt: '2025-01-01T00:00:00Z',
      priority: 'Alta',
      category: 'Trabalho',
      description: 'Descrição de teste'
    };

    expect(item.priority).toBe('Alta');
    expect(item.category).toBe('Trabalho');
    expect(item.description).toBe('Descrição de teste');
  });
});
```

## Testes de Segurança

### Testes de Autorização

#### Backend - Testes de Autorização

```csharp
public class AuthorizationTests
{
    [Fact]
    public async Task GetToDoItems_WithoutToken_ReturnsUnauthorized()
    {
        // Arrange
        using var factory = new WebApplicationFactory<Program>();
        var client = factory.CreateClient();

        // Act
        var response = await client.GetAsync("/api/ToDoItems");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetToDoItem_WithDifferentUserToken_ReturnsForbidden()
    {
        // Arrange
        var differentUserToken = await GetTokenForUser("different-user");
        using var factory = new WebApplicationFactory<Program>();
        var client = factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Bearer", differentUserToken);

        // Act
        var response = await client.GetAsync("/api/ToDoItems/1");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode); // Retorna 404 em vez de 403 para segurança
    }
}
```

#### Frontend - Testes de Guard

```typescript
describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['createUrlTree']) }
      ]
    });
    guard = TestBed.inject(AuthGuard);
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should return true if user is logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);

    const result = guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    expect(result).toBeTrue();
  });

  it('should redirect if user is not logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(false);
    const router = TestBed.inject(Router);
    
    const result = guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    expect(result).toEqual(router.createUrlTree(['/auth']));
  });
});
```

## Execução de Testes

### Backend

```bash
# Executar todos os testes
dotnet test

# Executar testes com cobertura de código
dotnet test --collect:"XPlat Code Coverage"

# Executar testes específicos
dotnet test --filter "FullyQualifiedName~ToDoServiceTests"

# Executar testes e gerar relatório
dotnet test --logger "trx;LogFileName=test-results.trx"
```

### Frontend

```bash
# Executar testes uma vez
ng test

# Executar testes em modo watch
ng test --watch=true

# Executar testes e gerar cobertura
ng test --code-coverage

# Executar testes com saída detalhada
ng test --reporters=progress,spec
```

## Melhores Práticas de Testes

### Backend

1. **AAA Pattern (Arrange, Act, Assert)**: Estrutura clara para todos os testes
2. **Naming Convention**: `[MethodUnderTest]_[Scenario]_[ExpectedResult]`
3. **Mock Adequado**: Utilizar Moq para isolar unidades de teste
4. **Testes de Integração com Banco de Dados In-Memory**: Para testar a persistência sem depender de banco externo
5. **Testes de Validação**: Verificar se as regras de validação estão corretas

### Frontend

1. **Component Testing**: Testar inputs, outputs, e comportamentos do componente
2. **Service Testing**: Testar a comunicação com APIs e tratamento de erros
3. **State Management Testing**: Verificar como os signals e estados reativos se comportam
4. **Testes de Integração**: Testar a interação entre componentes
5. **Testes de Performance**: Verificar tempo de execução e eficiência

## Cenários de Teste Críticos

### Autenticação e Autorização

- Login com credenciais válidas
- Login com credenciais inválidas
- Acesso a recursos sem autenticação
- Acesso a recursos de outro usuário
- Token expirado
- Bloqueio de conta após tentativas falhas

### Operações CRUD de Tarefas

- Criação de tarefa com dados válidos
- Criação de tarefa com dados inválidos
- Atualização de tarefa própria
- Atualização de tarefa de outro usuário (deve falhar)
- Exclusão de tarefa própria
- Exclusão de tarefa de outro usuário (deve falhar)
- Listagem de tarefas (apenas as próprias)

### Validação de Dados

- Campos obrigatórios
- Formatos de dados corretos
- Limites de tamanho
- Valores permitidos para campos específicos (prioridade, categoria)

## Ferramentas de Análise

### Backend
- **coverlet** - Para cobertura de código
- **ReportGenerator** - Para geração de relatórios de cobertura
- **SonarQube** - Para análise estática de código (opcional)

### Frontend
- **Karma Coverage Reporter** - Para cobertura de código
- **Istanbul** - Para geração de relatórios de cobertura
- **Codelyzer** - Para análise estática do código Angular (opcional)

## Práticas Recomendadas

1. **Testar o Comportamento, Não a Implementação**: Focar no que o código faz, não em como faz
2. **Testes Independentes**: Cada teste deve ser independente dos outros
3. **Execução Rápida**: Testes devem ser rápidos para não atrasar o desenvolvimento
4. **Mensagens de Erro Claras**: Asserções devem ter mensagens descritivas
5. **Manutenção Contínua**: Atualizar testes quando o código muda
6. **Priorização**: Testar primeiro os caminhos críticos e de maior risco
7. **Documentação**: Comentar testes complexos para explicar o propósito