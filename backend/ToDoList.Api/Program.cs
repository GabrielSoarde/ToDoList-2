using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using ToDoList.Api.Services;
using ToDoList.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ToDoList.Api.Identity;
using Microsoft.AspNetCore.Http; // Para IHttpContextAccessor
using Microsoft.Extensions.Configuration; // Para IConfiguration

// ------------------------------------------------------------------
// ETAPA 1: Configuração do Builder (SERVIÇOS)
// ------------------------------------------------------------------
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins"; 
var builder = WebApplication.CreateBuilder(args);

// Adicionar services ao container.
builder.Services.AddControllers();

// Adicionar e Configurar CORS (Movido para aqui, antes do Build)
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("http://localhost:4200") 
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

// Configuração do DB Context e Identity
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ToDoListContext>(options => 
    options.UseNpgsql(connectionString));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ToDoListContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6;
    options.User.RequireUniqueEmail = true;
});

// Configuração e Serviço JWT
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

// Serviços de Aplicação
builder.Services.AddScoped<IToDoService, ToDoService>(); 
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>(); 

// Configuração CLÁSSICA do Swagger (REMOVENDO AddOpenApi)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // Usamos AddSwaggerGen para habilitar a UI
// ------------------------------------------------------------------
// ETAPA 2: Construção do Aplicativo
// ------------------------------------------------------------------
var app = builder.Build();

// ------------------------------------------------------------------
// ETAPA 3: Configuração do Pipeline (MIDDLEWARES)
// ------------------------------------------------------------------

// Configure o pipeline de requisições HTTP.
if (app.Environment.IsDevelopment())
{
    // Ativa o Swagger UI no ambiente de desenvolvimento
    app.UseSwagger();
    app.UseSwaggerUI(); 
}

app.UseHttpsRedirection();
app.UseRouting(); // Geralmente bom ter o UseRouting antes do CORS

// Usar o Middleware CORS
app.UseCors(MyAllowSpecificOrigins);

// Middleware de Autenticação e Autorização
app.UseAuthentication();
app.UseAuthorization(); 

app.MapControllers(); 

app.Run();