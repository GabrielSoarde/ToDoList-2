using Microsoft.AspNetCore.Identity;

namespace ToDoList.Api.Identity
{
    // Adicione propriedades extras do usuário aqui, se precisar (ex: NomeCompleto)
    public class ApplicationUser : IdentityUser
    {
        // Por enquanto, o padrão já nos dá Username, Email, PasswordHash, etc.
    }
}