using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using server.Domain.Entities;
using server.Domain.Enums;
using server.DTOs.Authentication;
using server.Exceptions;

namespace server.Services.AuthenticationServices
{
    public class AuthenticationServices(UserManager<User> userManager, IConfiguration configuration, ILogger<AuthenticationServices> logger) : IAuthenticationServices
    {
        private readonly UserManager<User> _userManager = userManager;
        private readonly IConfiguration _configuration = configuration;
        private readonly ILogger<AuthenticationServices> _logger = logger;

        public async Task<AuthenticationBaseResponsePOST> SignUpAsync(AuthenticationSignUpRequestPOST authenticationSignUp)
        {
            User newUser = new()
            {
                Email = authenticationSignUp.Email,
                UserName = authenticationSignUp.Email
            };

            _logger.LogInformation("Creating a new user");
            IdentityResult? result = await _userManager.CreateAsync(newUser, authenticationSignUp.Password);

            if (!result.Succeeded)
            {
                IdentityError firstError = result.Errors.ElementAt(0);
                if (firstError.Code.Contains("Password"))
                {
                    _logger.LogInformation($"Failed to create user with errors: {string.Join(", ", result.Errors.Select(static error => error.Description))}");
                    throw new ValidationException(firstError.Code);
                }

                if (firstError.Code == IdentityErrorCode.DuplicateUserName.ToString())
                {
                    _logger.LogInformation($"Failed to create user with errors: {string.Join(", ", result.Errors.Select(static error => error.Description))}");
                    throw new ValidationException(firstError.Code);
                }

                _logger.LogError($"Failed to create user with errors: {string.Join(", ", result.Errors.Select(static error => error.Description))}");
                throw new Exception("Failed to create a new user");
            }

            _logger.LogInformation("The User with id {Id} is created.", newUser.Id);
            return new AuthenticationBaseResponsePOST
            {
                JWT = GenerateJwtToken(newUser),
                Status = UserStatus.NoFullName
            };
        }

        public async Task<AuthenticationBaseResponsePOST> LoginAsync(AuthenticationLoginRequestPOST authenticationLogin)
        {
            User user = new();
            return new AuthenticationBaseResponsePOST
            {
                JWT = GenerateJwtToken(user),
                Status = user.UserName is not null ? UserStatus.NoFullName : UserStatus.Active
            }; ;
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Name, user.UserName)
            };

            byte[] key = Convert.FromBase64String(_configuration["Jwt:Key"]);
            var securityKey = new SymmetricSecurityKey(key);

            var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}