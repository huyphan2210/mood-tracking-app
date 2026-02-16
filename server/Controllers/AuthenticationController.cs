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
        public async Task<IActionResult> SignUp([FromBody] AuthenticationSignUpPOST authenticationSignUp)
        {
            await _authenticationServices.SignUpAsync(authenticationSignUp);
            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthenticationLoginPOST authenticationLogin)
        {
            await _authenticationServices.LoginAsync(authenticationLogin);
            return Ok();
        }
    }
}
