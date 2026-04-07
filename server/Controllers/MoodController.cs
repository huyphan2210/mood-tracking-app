using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.DTOs.Exception;
using server.DTOs.Mood;
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

    [HttpGet()]
    [ProducesResponseType(typeof(MoodResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetMood([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
      var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";
      var result = await _moodServices.GetSingleMoodAsync(startDate, endDate, Guid.Parse(userId));

      return Ok(result);
    }

    [HttpGet("trends")]
    [ProducesResponseType(typeof(MoodTrends), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetMoodTrends([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
      var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";
      var result = await _moodServices.GetMoodTrendsAsync(startDate, endDate, Guid.Parse(userId));

      return Ok(result);
    }

    [HttpPost()]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status500InternalServerError)]
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