using server.DTOs.Authentication;

namespace server.Services.AuthenticationServices
{
    public interface IAuthenticationServices
    {
        public Task LoginAsync(AuthenticationLoginPOST authenticationLogin);
        public Task SignUpAsync(AuthenticationSignUpPOST authenticationSignUp);
    }
}
