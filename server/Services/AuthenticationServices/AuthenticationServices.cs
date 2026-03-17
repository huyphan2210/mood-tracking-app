
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.Domain.Entities;
using server.Domain.Enums.User;
using server.DTOs.Authentication;
using server.Exceptions;

using EmailAddressAttribute = System.ComponentModel.DataAnnotations.EmailAddressAttribute;

namespace server.Services.AuthenticationServices
{
    public class AuthenticationServices(
        UserManager<User> userManager,
        IConfiguration configuration,
        ILogger<AuthenticationServices> logger
    ) : IAuthenticationServices
    {
        private readonly UserManager<User> _userManager = userManager;
        private readonly IConfiguration _configuration = configuration;
        private readonly ILogger<AuthenticationServices> _logger = logger;

        public async Task<AuthenticationBaseResponsePOST> SignUpAsync(SignUpRequestPOST authenticationSignUp)
        {
            if (!new EmailAddressAttribute().IsValid(authenticationSignUp.Email))
            {
                _logger.LogInformation("Email is invalid");
                throw new ValidationException(IdentityErrorCode.EmailIsInvalid.ToString(), "Email is invalid");
            }

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
                    throw new ValidationException(firstError.Code, firstError.Description);
                }

                if (firstError.Code == IdentityErrorCode.DuplicateUserName.ToString())
                {
                    _logger.LogInformation($"Failed to create user with errors: {string.Join(", ", result.Errors.Select(static error => error.Description))}");
                    throw new ValidationException(firstError.Code, firstError.Description);
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

        public async Task<AuthenticationBaseResponsePOST> LoginAsync(LoginRequestPOST authenticationLogin)
        {
            var unauthorizedException = new UnauthorizedException(IdentityErrorCode.UserNotFound.ToString(), "Either the email or password is invalid");

            var user = await _userManager.FindByEmailAsync(authenticationLogin.Email);
            if (user is null || user.IsDeleted == true)
            {
                throw unauthorizedException;
            }

            var isUserValid = await _userManager.CheckPasswordAsync(user, authenticationLogin.Password);
            if (!isUserValid)
            {
                throw unauthorizedException;
            }

            return new AuthenticationBaseResponsePOST
            {
                JWT = GenerateJwtToken(user),
                Status = user.FullName is null ? UserStatus.NoFullName : UserStatus.Active
            };
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Email, user.Email),
                new("status", user.FullName is null ? UserStatus.NoFullName.ToString() : UserStatus.Active.ToString()),
            };

            byte[] key = Convert.FromBase64String(_configuration["Jwt:Key"]);
            var securityKey = new SymmetricSecurityKey(key);

            var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<User> FindUserByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(user => user.Id == id && user.IsDeleted == false, cancellationToken)
                ?? throw new NotFoundException(IdentityErrorCode.UserNotFound.ToString(), $"Cannot find a user with id ${id}");
            return user;
        }
    }
}