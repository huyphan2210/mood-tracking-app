using Microsoft.AspNetCore.Mvc;
using server.DTOs.Authentication;
using server.DTOs.Exception;
using server.DTOs.Exception.Authentication;
using server.Services.AuthenticationServices;

namespace server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthenticationController(IAuthenticationServices authenticationServices) : ControllerBase
    {
        private readonly IAuthenticationServices _authenticationServices = authenticationServices;

        [HttpPost("sign-up")]
        [ProducesResponseType(typeof(AuthenticationBaseResponsePOST), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(SignUpErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<AuthenticationBaseResponsePOST>> SignUp([FromBody] AuthenticationSignUpRequestPOST authenticationSignUp)
        {
            AuthenticationBaseResponsePOST result = await _authenticationServices.SignUpAsync(authenticationSignUp);
            return Ok(result);
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(AuthenticationBaseResponsePOST), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<AuthenticationBaseResponsePOST>> Login([FromBody] AuthenticationLoginRequestPOST authenticationLogin)
        {
            AuthenticationBaseResponsePOST result = await _authenticationServices.LoginAsync(authenticationLogin);
            return Ok(result);
        }
    }
}
