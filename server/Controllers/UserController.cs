using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using server.DTOs.Exception;
using server.DTOs.User;
using server.Services.UserServices;

namespace server.Controllers
{
  [Authorize]
  [ApiController]
  [Route("api/user")]
  public class UserController(IUserSevices userSevices) : ControllerBase
  {
    private readonly IUserSevices _userServices = userSevices;

    [HttpPatch("update")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateUser([FromBody] UpdateUserRequestPATCH request)
    {
      var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";
      await _userServices.UpdateUserAsync(Guid.Parse(userId), request);
      return Ok();
    }
  }
}
