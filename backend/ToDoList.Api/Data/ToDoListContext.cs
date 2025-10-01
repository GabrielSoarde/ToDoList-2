using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore; // Novo using
using ToDoList.Api.Models; 
using ToDoList.Api.Identity; // Novo using

namespace ToDoList.Api.Data
{
    // **IMPORTANTE:** Mude a herança para IdentityDbContext
    // Os tipos são: <Classe de Usuário, Classe de Role, Tipo da Chave Primária>
    public class ToDoListContext : IdentityDbContext<ApplicationUser, IdentityRole, string> 
    {
        public ToDoListContext(DbContextOptions<ToDoListContext> options)
            : base(options)
        {
        }

        // A tabela de ToDoList permanece
        public DbSet<ToDoItem> ToDoItems { get; set; } = default!; 
        
        // O IdentityDbContext já cuidará das tabelas AspNetUsers, AspNetRoles, etc.

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Chamar o base.OnModelCreating é fundamental para o Identity criar suas tabelas!
            base.OnModelCreating(modelBuilder);
            
            // Aqui você pode fazer configurações adicionais para o ToDoItem, se necessário.
        }
    }
}