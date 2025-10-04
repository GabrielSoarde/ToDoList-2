# Segurança

## Visão Geral

Este documento descreve todas as práticas e implementações de segurança no projeto ToDoList, incluindo autenticação, autorização, proteção de dados e melhores práticas.

## Autenticação

### JWT (JSON Web Tokens)

O projeto utiliza JWT para autenticação de usuários, com as seguintes configurações:

#### Configuração
- **Algoritmo de Assinatura**: HMAC SHA-256
- **Validade do Token**: 2 horas (7200 segundos)
- **Claim Types Utilizados**:
  - `ClaimTypes.NameIdentifier`: ID do usuário
  - `ClaimTypes.Email`: Email do usuário
  - `ClaimTypes.Name`: Nome do usuário

#### Geração de Token
```csharp
private async Task<string> GenerateJwtToken(ApplicationUser user)
{
    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id),
        new Claim(ClaimTypes.Email, user.Email!),
        new Claim(ClaimTypes.Name, user.UserName!)
    };

    var jwtSettings = _configuration.GetSection("JwtSettings");
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
    var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: jwtSettings["Issuer"],
        audience: jwtSettings["Audience"],
        claims: claims,
        expires: DateTime.Now.AddHours(2),
        signingCredentials: credentials);

    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

#### Validação de Token
- Middleware de autenticação no `Program.cs`
- Validação automática de issuer, audience, expiration e signature
- Extração de claims para autorização

### ASP.NET Core Identity

#### Configurações de Segurança
```csharp
options.Password.RequireDigit = true;
options.Password.RequireLowercase = true;
options.Password.RequireUppercase = true;
options.Password.RequireNonAlphanumeric = false;
options.Password.RequiredLength = 6;
options.Password.RequiredUniqueChars = 1;

// Bloqueio de conta
options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
options.Lockout.MaxFailedAccessAttempts = 5;
options.Lockout.AllowedForNewUsers = true;

// Configurações de usuário
options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
options.User.RequireUniqueEmail = true;
```

## Autorização

### Proteção de Endpoints

Todos os endpoints de tarefas estão protegidos com o atributo `[Authorize]`:

```csharp
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ToDoItemsController : ControllerBase
{
    // Todos os métodos exigem autenticação
}
```

### Filtragem por Usuário

Cada operação verifica se o recurso pertence ao usuário autenticado:

```csharp
[HttpGet("{id}")]
public async Task<ActionResult<ToDoItem>> GetToDoItem(int id)
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(userId))
        return Unauthorized();

    var item = await _toDoService.GetByIdForUser(id, userId);
    if (item == null)
        return NotFound();

    return Ok(item);
}
```

## Proteção Contra Ataques

### Ataques de Força Bruta
- Bloqueio de conta após 5 tentativas de login falhas
- Bloqueio por 5 minutos
- Mesma mensagem de erro para usuários existentes e não existentes
- Delay adicional para prevenir ataques de timing

### Enumeração de Usuários
- Retorno da mesma mensagem de erro para usuários existentes e inexistentes
- Mesmo tempo de resposta para ambos os casos (com delay aleatório opcional)

### Injeção de SQL
- Uso de ORM (Entity Framework Core) para consultas parametrizadas
- Nenhum SQL raw utilizado
- Validação de inputs do usuário

### Cross-Site Scripting (XSS)
- Validação de inputs no backend
- Framework Angular fornece proteção XSS por padrão
- Não utilização de innerHTML sem sanitização

## Práticas de Codificação Segura

### Validação de Inputs

#### Backend
```csharp
public async Task<IActionResult> Register([FromBody] RegisterModel model)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }
    // Processa o registro
}
```

#### Frontend
- Utilização de Reactive Forms com validação
- Validação tanto no frontend quanto no backend

### Armazenamento de Senhas
- Senhas são armazenadas com hashing via ASP.NET Core Identity
- Não são armazenadas em texto plano
- Políticas de senha configuradas (mínimo de 6 caracteres, requisitos de complexidade)

### Chaves e Segredos
- Chaves JWT devem ser mantidas em variáveis de ambiente ou Azure Key Vault
- Não armazenadas hardcoded em arquivos de configuração em produção
- Strings de conexão protegidas da mesma forma

## CORS (Cross-Origin Resource Sharing)

### Configuração Segura
```csharp
policy.WithOrigins("http://localhost:4200")
      .AllowAnyHeader()
      .AllowAnyMethod()
      .AllowCredentials();
```

- Restrito apenas à origem do frontend (localhost:4200 em desenvolvimento)
- Permite apenas credenciais necessárias

## Segurança no Frontend

### Armazenamento de Tokens
- Tokens JWT armazenados no localStorage (pode ser vulnerável a XSS)
- Alternativa mais segura: cookies HttpOnly (requer implementação adicional)

### Interceptor JWT
- Adiciona automaticamente o token a todas as requisições
- Centraliza a lógica de autenticação

## Testes de Segurança

### Autenticação
- Testar endpoints protegidos sem autenticação
- Testar tokens expirados
- Testar manipulação de tokens

### Autorização
- Testar acesso a tarefas de outros usuários
- Testar acesso não autorizado a endpoints
- Testar escalação de privilégios

### Validação de Inputs
- Testar injeção de SQL
- Testar injeção de scripts
- Testar payloads grandes

## Melhores Práticas Implementadas

1. **Princípio do Menor Privilégio**: Cada usuário só acessa suas próprias tarefas
2. **Defense in Depth**: Múltiplas camadas de segurança
3. **Validação em Ambas as Camadas**: Frontend e backend validam inputs
4. **Logging Adequado**: Registros de atividades importantes
5. **Tratamento de Erros Seguro**: Não expõe informações sensíveis em mensagens de erro

## Considerações para Produção

### Token Refresh
- Implementar mecanismo de refresh token para melhor experiência do usuário
- Tokens de acesso com validade curta
- Tokens de refresh com validade mais longa e armazenamento seguro

### HTTPS
- Forçar uso de HTTPS em produção
- Configuração do middleware de segurança correspondente

### Auditoria
- Registrar tentativas de login
- Monitorar acessos suspeitos
- Registrar alterações em dados sensíveis

### HSTS
- Implementar HTTP Strict Transport Security
- Prevenir downgrade de HTTPS para HTTP

## Verificação de Segurança

### Checklist
- [x] Autenticação JWT implementada
- [x] Autorização por usuário implementada
- [x] Proteção contra força bruta
- [x] Filtragem de dados por usuário
- [x] Validação de inputs
- [x] Proteção contra enumeração de usuários
- [x] Configuração segura de CORS

### Ferramentas Recomendadas para Testes
- OWASP ZAP para testes de segurança
- Postman para testes de API
- Ferramentas de XSS e injeção de SQL

## Vulnerabilidades Conhecidas e Mitigação

### XSS no Armazenamento de Tokens
- **Risco**: Armazenamento de tokens no localStorage
- **Mitigação**: Considerar alternativas como cookies HttpOnly ou mecanismos mais avançados

### Timing Attacks
- **Risco**: Diferença sutil de tempo em operações de autenticação
- **Mitigação**: Implementar delays consistentes

### Informações de Erro Expostas
- **Risco**: Mensagens de erro detalhadas podem revelar informações
- **Mitigação**: Mensagens de erro genéricas para o usuário, logs detalhados no servidor