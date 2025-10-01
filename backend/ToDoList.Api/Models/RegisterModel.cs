using System.ComponentModel.DataAnnotations;

namespace ToDoList.Api.Models
{
    public class RegisterModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;
        
        [Required]
        [Compare(nameof(Password))] // Garante que as senhas são iguais
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}