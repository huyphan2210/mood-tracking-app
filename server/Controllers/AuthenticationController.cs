using Microsoft.AspNetCore.Mvc;
using server.DTOs.Authentication;
using server.Services.AuthenticationServices;

namespace server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthenticationController(IAuthenticationServices authenticationServices) : ControllerBase
    {
        private readonly IAuthenticationServices _authenticationServices = authenticationServices;

        [HttpPost("sign-up")]
        public async Task<ActionResult<AuthenticationBaseResponsePOST>> SignUp([FromBody] AuthenticationSignUpRequestPOST authenticationSignUp)
        {
            AuthenticationBaseResponsePOST result = await _authenticationServices.SignUpAsync(authenticationSignUp);
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthenticationBaseResponsePOST>> Login([FromBody] AuthenticationLoginRequestPOST authenticationLogin)
        {
            AuthenticationBaseResponsePOST result = await _authenticationServices.LoginAsync(authenticationLogin);
            return Ok(result);
        }
    }
}
