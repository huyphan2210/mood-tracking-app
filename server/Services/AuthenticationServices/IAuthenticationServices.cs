using server.Domain.Entities;
using server.DTOs.Authentication;

namespace server.Services.AuthenticationServices
{
    public interface IAuthenticationServices
    {
        public Task<AuthenticationBaseResponsePOST> LoginAsync(LoginRequestPOST authenticationLogin);
        public Task<AuthenticationBaseResponsePOST> SignUpAsync(SignUpRequestPOST authenticationSignUp);
        public Task<User> FindUserByIdAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
