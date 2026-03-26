using server.Domain.Entities;
using server.DTOs.Authentication;

namespace server.Services.AuthenticationServices
{
    public interface IAuthenticationServices
    {
        public Task<AuthenticationBaseResponsePOST> LoginAsync(LoginRequestPOST authenticationLogin);
        public Task<AuthenticationBaseResponsePOST> SignUpAsync(SignUpRequestPOST authenticationSignUp);
        public string GenerateJwtToken(User user);
    }
}
