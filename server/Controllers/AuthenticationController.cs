using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using server.Models.DTOs.Authentication;

namespace server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthenticationController(AuthenticationService authenticationService) : ControllerBase
    {   
        private readonly AuthenticationService _authenticationService = authenticationService;

        [HttpPost("sign-up")]
        public async Task<IActionResult> SignUp([FromBody] AuthenticationSignUpPOST authenticationSignUp)
        {
            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthenticationLoginPOST authenticationLogin)
        {
            return Ok();
        }
    }
}
