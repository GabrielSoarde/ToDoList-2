# Deploy

## Visão Geral

Este documento descreve o processo de deploy da aplicação ToDoList, incluindo configuração de ambiente, build, e estratégias para diferentes ambientes (desenvolvimento, teste, produção).

## Arquitetura de Deploy

### Componentes

A aplicação é composta por dois componentes principais que podem ser deployados separadamente:

1. **Backend (API)**: ASP.NET Core Web API
2. **Frontend**: Aplicação Angular (cliente SPA)
3. **Banco de Dados**: PostgreSQL

### Infraestrutura

- **Backend**: Hospedado em servidor que suporte .NET 9
- **Frontend**: Pode ser hospedado em qualquer servidor web estático
- **Banco de Dados**: Servidor PostgreSQL (pode ser local ou cloud)

## Configuração de Ambiente

### Variáveis de Ambiente

#### Backend

No `appsettings.json` (ou arquivos específicos por ambiente como `appsettings.Production.json`):

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "JwtSettings": {
    "Key": "{JWT_KEY}", // Em produção, usar variável de ambiente
    "Issuer": "ToDoList.Api",
    "Audience": "ToDoList.Web"
  },
  "ConnectionStrings": {
    "DefaultConnection": "{CONNECTION_STRING}" // Em produção, usar variável de ambiente
  },
  "AllowedHosts": "*"
}
```

**Variáveis de Ambiente Recomendadas:**
- `ASPNETCORE_ENVIRONMENT`: Define o ambiente (Development, Staging, Production)
- `JWT_KEY`: Chave secreta para JWT (em produção, NUNCA armazenar no código)
- `ConnectionStrings__DefaultConnection`: String de conexão com o banco de dados

#### Frontend

Arquivo `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: '{PRODUCTION_API_URL}' // URL da API em produção
};
```

### Banco de Dados

- Certifique-se de que o PostgreSQL está instalado e acessível
- O banco de dados deve ser criado antes do primeiro deploy
- Execute as migrations para criar as tabelas necessárias

## Processo de Build

### Backend

#### Pré-requisitos
- .NET SDK 9.0 instalado

#### Build para Produção

```bash
cd backend/ToDoList.Api/
dotnet restore
dotnet publish -c Release -o ./publish
```

#### Alternativamente: Build com Runtime Específico

```bash
dotnet publish -c Release -r linux-x64 --self-contained false -o ./publish
```

### Frontend

#### Pré-requisitos
- Node.js e npm instalados
- Angular CLI instalado globalmente (`npm install -g @angular/cli`)

#### Build para Produção

```bash
cd frontend/todolist-ui/
npm install
ng build --configuration production
```

#### Build com Configuração Personalizada

```bash
ng build --configuration production --base-href=/app/
```

## Estratégias de Deploy

### 1. Deploy Monolítico (Recomendado para Projetos Pequenos)

Neste modelo, backend e frontend são deployados juntos:

```
Servidor Web
├── ToDoList.Api/            (Backend)
│   ├── wwwroot/            (Frontend buildado)
│   └── ToDoList.Api.exe
└── Banco de Dados (externo ou local)
```

#### Configuração no Backend

No `Program.cs`, adicione o serviço para servir arquivos estáticos:

```csharp
// Servir arquivos estáticos (frontend)
app.UseStaticFiles();

// Servir o index.html para rotas desconhecidas (SPA)
app.UseRouting();
app.MapFallbackToFile("/{*path:regex(^(?!api/).*$.*)}", "index.html");
```

### 2. Deploy Separado (Recomendado para Projetos Maiores)

Backend e frontend são deployados em servidores separados:

```
Servidor Backend (ex: api.example.com)
└── ToDoList.Api/

Servidor Frontend (ex: app.example.com ou CDN)
└── Arquivos estáticos do Angular

Banco de Dados (comum)
└── PostgreSQL
```

## Deploy em Diferentes Plataformas

### 1. Azure

#### Backend no Azure App Service

1. Crie um App Service com runtime .NET
2. Configure as variáveis de ambiente no portal do Azure
3. Faça deploy via:
   - Azure DevOps
   - GitHub Actions
   - Azure CLI
   - Visual Studio

#### Banco de Dados no Azure Database for PostgreSQL

1. Crie uma instância do PostgreSQL
2. Configure as regras de firewall
3. Atualize a string de conexão

#### Frontend no Azure Static Web Apps

1. Configure o repositório no Azure Static Web Apps
2. Aponte para a pasta `dist/todolist-ui` após o build
3. Configure as rotas para SPA

### 2. AWS

#### Backend no Elastic Beanstalk

1. Crie uma aplicação .NET no Elastic Beanstalk
2. Faça upload do pacote publicado
3. Configure as variáveis de ambiente

#### Banco de Dados no RDS

1. Crie uma instância PostgreSQL no RDS
2. Configure o security group para permitir conexões
3. Atualize a string de conexão

#### Frontend no S3 + CloudFront

1. Faça upload dos arquivos buildados para um bucket S3
2. Configure o bucket como site estático
3. Configure o CloudFront para servir os arquivos

### 3. Self-Hosted (Servidor Próprio)

#### Linux

1. Instale o .NET SDK/Runtime
2. Configure um proxy reverso com Nginx
3. Execute a aplicação com systemd ou supervisor

#### Windows

1. Execute como Windows Service
2. Ou utilize o IIS com ASP.NET Core Module

## CI/CD Pipeline

### GitHub Actions (Recomendado)

Exemplo de workflow para deploy:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: 9.0.x
        
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        
    - name: Install dependencies (Backend)
      run: |
        cd backend/ToDoList.Api
        dotnet restore
        
    - name: Install dependencies (Frontend)
      run: |
        cd frontend/todolist-ui
        npm install
        
    - name: Build Frontend
      run: |
        cd frontend/todolist-ui
        npm run build
        
    - name: Build Backend
      run: |
        cd backend/ToDoList.Api
        dotnet publish -c Release -o ./publish
        
    # Adicionar etapas de deploy aqui (Azure, AWS, etc.)
```

### Docker (Opcional)

#### Dockerfile para Backend

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["backend/ToDoList.Api/ToDoList.Api.csproj", "backend/ToDoList.Api/"]
RUN dotnet restore "backend/ToDoList.Api/ToDoList.Api.csproj"
COPY . .
WORKDIR "/src/backend/ToDoList.Api"
RUN dotnet build "ToDoList.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ToDoList.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ToDoList.Api.dll"]
```

#### Docker Compose para Ambiente Completo

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: todolist_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: admin123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build: ./backend/ToDoList.Api
    ports:
      - "5269:80"
    depends_on:
      - db
    environment:
      - ConnectionStrings__DefaultConnection=Host=db;Port=5432;Database=todolist_db;Username=postgres;Password=admin123
      - ASPNETCORE_ENVIRONMENT=Production

volumes:
  postgres_data:
```

## Configurações de Produção

### Backend

#### Performance

```csharp
// Program.cs - Configurações de produção
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(
        new[] { "application/json" });
});

// Logging mais leve em produção
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
```

#### Segurança

```csharp
// HTTPS Redirection
app.UseHttpsRedirection();

// Security Headers
app.UseHsts();

// CORS mais restritivo
builder.Services.AddCors(options =>
{
    options.AddPolicy("ProductionCors", policy =>
    {
        policy.WithOrigins("https://seu-dominio.com")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

### Frontend

#### Performance

- Build com otimizações (`--prod` ou `--configuration=production`)
- Geração de service worker para PWA
- Tree shaking e code splitting
- Lazy loading de módulos

#### Segurança

- CSP (Content Security Policy) no index.html
- HSTS headers (no servidor web)
- HTTPS obrigatório

## Monitoramento e Logging

### Backend

#### Configuração de Logging

```csharp
// appsettings.Production.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Error",
      "System": "Error"
    }
  }
}
```

#### Ferramentas Recomendadas

- **Serilog** para logging estruturado
- **Application Insights** para monitoramento no Azure
- **ELK Stack** para análise de logs em self-hosted

### Frontend

#### Monitoramento de Erros

- Implementar ErrorHandler global
- Integração com serviços como Sentry
- Monitoramento de performance (Core Web Vitals)

## Estratégias de Atualização

### 1. Blue-Green Deploy

1. Mantenha duas versões idênticas do ambiente (blue e green)
2. Roteie tráfego para uma versão
3. Atualize a versão não ativa
4. Alterne o roteamento para a nova versão
5. Mantenha a antiga como fallback

### 2. Canary Deploy

1. Redirecione uma pequena porcentagem do tráfego para a nova versão
2. Monitore métricas e erros
3. Aumente gradualmente o tráfego para a nova versão
4. Desabilite completamente a versão antiga quando tudo estiver estável

## Rollback Strategy

### Backend

1. Mantenha os pacotes de build anteriores
2. Automatize o processo de rollback
3. Teste o processo de rollback em ambiente de staging

### Banco de Dados

1. **Migrations reversíveis**: Sempre que possível, crie down migrations
2. **Backup antes de deploy**: Faça backup do banco antes de aplicar migrations
3. **Transações em migrations**: Use transações quando possível

## Testes de Deploy

### Pré-deploy

- Verifique a integridade dos builds
- Teste as variáveis de ambiente
- Verifique a conectividade com o banco de dados

### Pós-deploy

- Testes de smoke para verificar funcionalidades críticas
- Verificação de logs para erros
- Teste de API endpoints principais

### Exemplo de Script de Deploy

```bash
#!/bin/bash

# Script de deploy de exemplo
echo "Iniciando deploy..."

# Backup do build anterior
if [ -d "backup" ]; then
    rm -rf backup
fi
cp -r current release-$(date +%Y%m%d-%H%M%S) && cp -r current backup

# Build e deploy do backend
cd backend/ToDoList.Api
dotnet publish -c Release -o ../publish

# Build e deploy do frontend
cd ../../frontend/todolist-ui
ng build --configuration production
cp -r dist/todolist-ui ../ToDoList.Api/publish/wwwroot

# Copiar para diretório de produção
cp -r ../ToDoList.Api/publish/* ../current/

echo "Deploy concluído!"
```

## Considerações Finais

1. **Automatize ao máximo**: Processos manuais são propensos a erros
2. **Teste em ambiente semelhante**: O ambiente de staging deve ser o mais próximo possível do de produção
3. **Monitore ativamente**: Configure alertas para falhas críticas
4. **Documente tudo**: Mantenha atualizada a documentação de deploy
5. **Planeje para o rollback**: Sempre tenha um plano B em caso de falha
6. **Segurança em primeiro lugar**: NUNCA armazene credenciais no código-fonte