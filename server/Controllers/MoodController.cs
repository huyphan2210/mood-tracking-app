using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.DTOs.Mood.Requests;
using server.Services.MoodServices;

namespace server.Controllers
{
  [Authorize]
  [ApiController]
  [Route("api/mood")]
  public class MoodController(IMoodServices moodServices) : ControllerBase
  {
    private readonly IMoodServices _moodServices = moodServices;

    [HttpPost]
    public async Task<IActionResult> AnalyzeMood(
      [FromBody] AnalyzeMoodRequestPOST analyzeMoodRequestPOST
    )
    {
      var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";
      await _moodServices.AnalyzeMoodAsync(analyzeMoodRequestPOST, Guid.Parse(userId));
      return Ok();
    }
  }
}