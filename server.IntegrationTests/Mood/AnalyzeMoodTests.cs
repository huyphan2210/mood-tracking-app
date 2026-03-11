using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using server.Data;
using server.Domain.Enums.Mood;
using server.DTOs.Mood.Requests;

namespace server.IntegrationTests.Mood
{
  public class AnalyzeMoodTests(CustomWebApplicationFactory factory) : BaseTests(factory)
  {
    private const string requestUrl = "/api/mood";

    [Fact]
    public async Task AnalyzeMood_ShouldReturnOkAndCreateMood_WhenRequestIsValid()
    {
      var request = new AnalyzeMoodRequestPOST
      {
        Feelings = [Feeling.Stressed],
        Mood = MoodName.Sad,
        SleepHours = SleepHours.ThreeToFour,
        MoodDescription = "Test Mood Description"
      };
      var httpRequest = CreateAuthorizedRequest(HttpMethod.Post, requestUrl, request);

      var response = await _httpClient.SendAsync(httpRequest);

      Assert.Equal(HttpStatusCode.OK, response.StatusCode);

      using var scope = _scopeFactory.CreateScope();
      var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

      var mood = await context.Moods.FirstOrDefaultAsync();
      Assert.NotNull(mood);
      Assert.Equal(mood.MoodDescription, request.MoodDescription);
      Assert.Equal(mood.MoodName, request.Mood);
      Assert.Equal(mood.SleepHours, request.SleepHours);
    }

    [Fact]
    public async Task AnalyzeMood_ShouldReturnBadRequest_WhenRequestIsNotValid()
    {
      var request = new
      {
        feelings = new[] { "Stressed" },
        sleepHours = "ThreeToFour",
        moodDescription = "Test Mood Description"
      };

      var httpRequest = CreateAuthorizedRequest(HttpMethod.Post, requestUrl, request);

      var response = await _httpClient.SendAsync(httpRequest);

      Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

      using var scope = _scopeFactory.CreateScope();
      var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

      var mood = await context.Moods.FirstOrDefaultAsync();
      Assert.Null(mood);
    }

    [Fact]
    public async Task AnalyzeMood_ShouldReturnUnauthorized_WhenRequestAuthorizationIsInvalid()
    {
      var request = new AnalyzeMoodRequestPOST
      {
        Feelings = [Feeling.Stressed],
        Mood = MoodName.Sad,
        SleepHours = SleepHours.ThreeToFour,
        MoodDescription = "Test Mood Description"
      };

      var httpRequest = new HttpRequestMessage(HttpMethod.Post, requestUrl)
      {
        Content = JsonContent.Create(request)
      };

      httpRequest.Headers.Authorization = null;

      var response = await _httpClient.SendAsync(httpRequest);
      Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);

      using var scope = _scopeFactory.CreateScope();
      var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

      var mood = await context.Moods.FirstOrDefaultAsync();
      Assert.Null(mood);
    }
  }
}