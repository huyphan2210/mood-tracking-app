using server.DTOs.Authentication;

namespace server.Services.AuthenticationServices
{
    public class AuthenticationServices: IAuthenticationServices
    {
        public AuthenticationServices() {}

        public async Task SignUpAsync(AuthenticationSignUpPOST authenticationSignUp)
        {
            return;
        }

        public async Task LoginAsync(AuthenticationLoginPOST authenticationLogin)
        {
            return;
        }
    }
}