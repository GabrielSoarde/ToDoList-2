# Define a imagem base do SDK do .NET para compilar a aplicação
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

# Copia os arquivos de projeto e solução para restaurar as dependências
COPY *.sln .
COPY ToDoList.Api/*.csproj ./ToDoList.Api/
RUN dotnet restore "./ToDoList.Api/ToDoList.Api.csproj"

# Copia o restante do código fonte
COPY . .

# Publica a aplicação em modo Release
WORKDIR "/source/ToDoList.Api"
RUN dotnet publish -c Release -o /app/publish

# Define a imagem final, mais leve, que contém apenas o runtime do ASP.NET
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expõe a porta que a aplicação vai usar (opcional, mas boa prática)
EXPOSE 8080

# Define o comando para iniciar a aplicação
ENTRYPOINT ["dotnet", "ToDoList.Api.dll"]
