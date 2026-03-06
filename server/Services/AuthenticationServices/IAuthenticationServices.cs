using server.DTOs.Authentication;

namespace server.Services.AuthenticationServices
{
    public interface IAuthenticationServices
    {
        public Task<AuthenticationBaseResponsePOST> LoginAsync(AuthenticationLoginRequestPOST authenticationLogin);
        public Task<AuthenticationBaseResponsePOST> SignUpAsync(AuthenticationSignUpRequestPOST authenticationSignUp);
    }
}
