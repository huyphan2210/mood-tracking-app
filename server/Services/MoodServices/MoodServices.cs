using System.Text.Json;
using server.Background.Queue;
using server.Background.Workers;
using server.Domain.Entities;
using server.Domain.Enums.Mood;
using server.Domain.Enums.User;
using server.DTOs.Mood;
using server.DTOs.Mood.Requests;
using server.Exceptions;
using server.Repositories.MoodRepository;
using server.Repositories.UserRepository;

namespace server.Services.MoodServices
{
  public partial class MoodServices(
    IUserRepository userRepository,
    IMoodRepository moodRepository,
    IBackgroundTaskQueue<MoodAnalysisJob> queue,
    ILogger<MoodServices> logger
  ) : IMoodServices
  {
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IMoodRepository _moodRepository = moodRepository;
    private readonly IBackgroundTaskQueue<MoodAnalysisJob> _queue = queue;
    private readonly ILogger _logger = logger;

    public async Task<MoodResponse?> GetSingleMoodAsync(DateTime startDate, DateTime endDate, Guid userId)
    {
      var moods = await _moodRepository.GetMoodsByUserIdAsync(userId);
      var mood = moods
        .FirstOrDefault(mood => mood.CreatedAt >= startDate && mood.CreatedAt <= endDate);

      if (mood == null)
      {
        return null;
      }

      return new MoodResponse
      {
        MoodName = mood.MoodName,
        SleepHours = mood.SleepHours,
        Analysis = mood.LlmAnalysis,
        Advice = mood.LlmAdvice,
        Motto = mood.LlmMotto
      };
    }

    public async Task<MoodTrends> GetMoodTrendsAsync(DateTime startDate, DateTime endDate, Guid userId)
    {
      var moodList = await GetMoodListSortByDateDescAsync(startDate, endDate, userId);

      var averageSleepValue = moodList.Average(mood => (int)mood.SleepHours);
      var avgSleep = (SleepHours)Math.Round(averageSleepValue);

      var averageMoodValue = moodList.Average(mood => (int)mood.MoodName);
      var avgMood = (MoodName)Math.Round(averageMoodValue);

      return new MoodTrends
      {
        MoodList = moodList,
        AverageMood = avgMood,
        AverageSleepHours = avgSleep
      };
    }

    private async Task<IEnumerable<MoodResponse>> GetMoodListSortByDateDescAsync(DateTime startDate, DateTime endDate, Guid userId)
    {
      var userMoods = await _moodRepository.GetMoodsByUserIdAsync(userId);
      var selectedMoods = userMoods
        .Where(mood => mood.CreatedAt >= startDate && mood.CreatedAt <= endDate)
        .OrderByDescending(mood => mood.CreatedAt);

      return selectedMoods.Select(mood => new MoodResponse
      {
        MoodName = mood.MoodName,
        SleepHours = mood.SleepHours,
        Analysis = mood.LlmAnalysis,
        Advice = mood.LlmAdvice,
        Motto = mood.LlmMotto,
        Date = mood.CreatedAt
      });
    }

    public async Task AnalyzeMoodAsync(
      AnalyzeMoodRequestPOST analyzeMoodRequestPost,
      Guid userId
    )
    {
      var user = await _userRepository.GetUserByIdAsync(userId, default)
        ?? throw new NotFoundException(IdentityErrorCode.UserNotFound.ToString(), $"Cannot find a user with id ${userId}"); ;

      var newMood = new Mood
      {
        Feelings = analyzeMoodRequestPost.Feelings,
        MoodName = analyzeMoodRequestPost.Mood,
        MoodDescription = analyzeMoodRequestPost.MoodDescription,
        SleepHours = analyzeMoodRequestPost.SleepHours,
        UserId = user.Id
      };

      var createdMood = await _moodRepository.CreateMoodAsync(newMood);

      var prompt = CreateMoodPrompt(user, analyzeMoodRequestPost);

      _queue.Queue(new MoodAnalysisJob(createdMood.Id, prompt, previousResponse => RetryPrompt(user, previousResponse)));
    }

    private static string CreateMoodPrompt(User user, AnalyzeMoodRequestPOST analyzeMoodRequestPost)
    {
      string prompt = $"""
        You are a healthcare professional providing supportive mental wellness insights.

        Today, {user.FullName} (email: {user.Email}) has submitted the following mood data:

        {JsonSerializer.Serialize(analyzeMoodRequestPost)}

        If historical data for the past 10 days is included in the provided input, consider it when forming your analysis.

        Provide:

        1. A brief analysis of the mood patterns.
        2. Practical, supportive advice to improve emotional wellbeing.
        3. A short motto/quote to help for the day.

        Requirements:
        - The analysis must be under 50 words.
        - The advice must be under 50 words.
        - The motto/quote must be under 15 words.
        - Write in a calm, supportive, and non-judgmental tone.
        - Keep the explanation clear and understandable.
        - Don't repeat yourself.
        - Return ONLY valid JSON.
        - Do not include markdown.
        - Do not include code blocks.

        Use this schema strictly: 
        'analysis: "string", advice: "string", motto: "string"'

      """;
      return prompt;
    }

    private static string RetryPrompt(User user, string previousReponse)
    {
      string prompt = $"""
        Your previous response {previousReponse} for {user.FullName} (email: {user.Email}) was not valid JSON.

        Return ONLY valid JSON.
        
        Use this schema strictly: 
        'analysis: "string", advice: "string", motto: "string"'
      """;

      return prompt;
    }
  }
}
