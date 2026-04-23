using Microsoft.AspNetCore.Mvc;
using server.Domain.Enums.Mood;
using server.DTOs.Mood.Requests;
using server.Services.MoodServices;

namespace server.Controllers
{
  [ApiController]
  [Route("jobs")]
  public class JobsController(
      IMoodServices moodServices,
      IConfiguration config) : ControllerBase
  {
    private readonly IMoodServices _moodServices = moodServices;
    private readonly IConfiguration _config = config;

    [HttpPost("analyze-moods")]
    public async Task<IActionResult> AnalyzeMoods(
        [FromHeader(Name = "X-Cron-Secret")] string secret)
    {
      if (secret != _config["CronSecret"])
        return Unauthorized();

      var request = FakeMoodGenerator.Generate();

      await _moodServices.AnalyzeMoodAsync(request, Guid.Parse("019cd5ad-2246-765d-8d3b-27610e81c6ca"));

      return Ok();
    }

    public static class FakeMoodGenerator
    {
      private static readonly Random Rng = new();

      public static AnalyzeMoodRequestPOST Generate()
      {
        var mood = PickMood();

        return new AnalyzeMoodRequestPOST
        {
          Mood = mood,
          SleepHours = PickSleepForMood(mood),
          Feelings = PickFeelingsForMood(mood),
          MoodDescription = GenerateDescription(mood)
        };
      }

      private static MoodName PickMood()
      {
        MoodName[] moods =
        [
            MoodName.VeryHappy,
            MoodName.Happy,
            MoodName.Neutral,
            MoodName.Sad,
            MoodName.VeryHappy
        ];

        return moods[Rng.Next(moods.Length)];
      }

      private static SleepHours PickSleepForMood(MoodName mood) =>
          mood switch
          {
            MoodName.VeryHappy => SleepHours.NinePlus,
            MoodName.Happy => SleepHours.SevenToEight,
            MoodName.Neutral => SleepHours.FiveToSix,
            MoodName.Sad => SleepHours.ThreeToFour,
            _ => SleepHours.ZeroToTwo
          };

      private static List<Feeling> PickFeelingsForMood(MoodName mood) =>
          mood switch
          {
            MoodName.VeryHappy =>
              [Feeling.Grateful, Feeling.Hopeful],

            MoodName.Happy =>
              [Feeling.Calm, Feeling.Optimistic],

            MoodName.Neutral =>
              [Feeling.Content],

            MoodName.Sad =>
              [Feeling.Anxious, Feeling.Tired],

            _ => [Feeling.Disappointed, Feeling.Stressed]
          };

      private static string GenerateDescription(MoodName mood) =>
          mood switch
          {
            MoodName.VeryHappy =>
              "Had a meaningful and energizing day.",

            MoodName.Happy =>
              "Feeling productive and fairly balanced.",

            MoodName.Neutral =>
              "An ordinary day with mixed emotions.",

            MoodName.Sad =>
              "Feeling drained and mentally heavy today.",

            _ =>
              "A heavy day."
          };
    }
  }
}