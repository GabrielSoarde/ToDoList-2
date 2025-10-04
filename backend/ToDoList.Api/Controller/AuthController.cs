using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using ToDoList.Api.Identity;
using ToDoList.Api.Models;
using Microsoft.IdentityModel.Tokens; // Para o Token
using System.IdentityModel.Tokens.Jwt; // Para gerar o token
using System.Security.Claims; // Para as Claims
using System.Text; // Para Encoding
using System.Configuration; // Para IConfiguration (vamos usar IConfiguration para ler a chave)

namespace ToDoList.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration; // Para ler as configurações do JWT

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        // POST: api/Auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            // Validação adicional dos dados de entrada
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // 1. Cria o novo ApplicationUser
            var user = new ApplicationUser 
            {
                UserName = model.Email, // Usamos o Email como Nome de Usuário
                Email = model.Email
            };

            // 2. Tenta criar o usuário com a senha fornecida
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                return Ok(new { Message = "Usuário registrado com sucesso!" });
            }

            // Se houver erros, retorna 400 Bad Request com a lista de erros
            return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            // Validação adicional dos dados de entrada
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // 1. Busca o usuário pelo email para verificar se existe
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                // Retornar o mesmo erro para usuários inexistentes para evitar enumeração
                await Task.Delay(2000); // Adiciona um delay para evitar timing attacks
                return Unauthorized("Login ou senha inválidos.");
            }

            // 2. Tenta fazer login com a senha
            var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, lockoutOnFailure: true);

            if (result.Succeeded)
            {
                // 3. Gera o Token JWT
                var token = await GenerateJwtToken(user);

                // 4. Retorna o token para o Frontend
                return Ok(new { Token = token, Email = user.Email });
            }
            else if (result.IsLockedOut)
            {
                return Unauthorized("Conta temporariamente bloqueada devido a tentativas de login falhas.");
            }
            else
            {
                return Unauthorized("Login ou senha inválidos.");
            }
        }

        // Método auxiliar para gerar o token JWT
        private async Task<string> GenerateJwtToken(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                // Claim essencial: o ID do usuário (Identificador principal)
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
                expires: DateTime.Now.AddHours(2), // Reduzindo o tempo de validade para 2 horas
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}