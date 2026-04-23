using server.Background.Queue;
using server.Domain.Entities;
using server.Domain.Enums.Mood;
using server.DTOs.Mood;
using server.Repositories.MoodRepository;
using server.Services.LLMServices;

namespace server.Background.Workers
{
  public class MoodAnalysisWorker(
    IBackgroundTaskQueue<MoodAnalysisJob> queue,
    IServiceScopeFactory scopeFactory,
    ILogger<MoodAnalysisWorker> logger
  ) : BackgroundService
  {
    private readonly IBackgroundTaskQueue<MoodAnalysisJob> _queue = queue;
    private readonly IServiceScopeFactory _scopeFactory = scopeFactory;
    private readonly ILogger<MoodAnalysisWorker> _logger = logger;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
      while (!stoppingToken.IsCancellationRequested)
      {
        var work = await _queue.DequeueAsync(stoppingToken);
        await HandleWorkAsync(work, stoppingToken);
      }
    }

    internal async Task HandleWorkAsync(MoodAnalysisJob work, CancellationToken stoppingToken)
    {
      try
      {
        using var scope = _scopeFactory.CreateScope();
        var llmServices = scope.ServiceProvider.GetRequiredService<ILLMServices>();
        var moodRepository = scope.ServiceProvider.GetRequiredService<IMoodRepository>();

        var mood = await moodRepository.GetMoodByIdAsync(work.MoodId, stoppingToken);
        if (mood == null)
        {
          return;
        }

        try
        {
          var response = await llmServices.PromptForJsonAsync<LlmMoodAnalysisresponse>(
            work.Prompt,
            previousReponse => work.RetryPrompt(previousReponse),
            stoppingToken
          );

          mood.LlmAdvice = response?.Advice;
          mood.LlmAnalysis = response?.Analysis;
          mood.LlmMotto = response?.Motto;
        }
        catch (LLMServicesExpcetion)
        {
          SetMoodFallback(mood);
        }

        await moodRepository.UpdateMoodAsync(mood, stoppingToken);
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error processing mood analysis job");
      }
    }

    private static void SetMoodFallback(Mood mood)
    {
      switch (mood.MoodName)
      {
        case MoodName.VerySad:
          mood.LlmAnalysis = "You seem to be going through a very difficult moment. These feelings can be heavy.";
          mood.LlmAdvice = "Consider reaching out to someone you trust or giving yourself space to rest.";
          mood.LlmMotto = "This moment will pass.";
          break;

        case MoodName.Sad:
          mood.LlmAnalysis = "There's a sense of emotional weight in your recent mood.";
          mood.LlmAdvice = "Try something gentle—like a short walk or listening to music.";
          mood.LlmMotto = "Small steps still matter.";
          break;

        case MoodName.Neutral:
          mood.LlmAnalysis = "Your mood seems steady, without strong highs or lows.";
          mood.LlmAdvice = "This could be a good time to focus on something meaningful or build a small positive habit.";
          mood.LlmMotto = "Stay steady.";
          break;

        case MoodName.Happy:
          mood.LlmAnalysis = "You're experiencing a positive and uplifted state.";
          mood.LlmAdvice = "Take a moment to appreciate what's going well and consider sharing that energy with others.";
          mood.LlmMotto = "Enjoy the moment.";
          break;

        case MoodName.VeryHappy:
          mood.LlmAnalysis = "You're in a very positive emotional state—this is a great moment.";
          mood.LlmAdvice = "Capture this feeling or reflect on what contributed to it so you can return to it later.";
          mood.LlmMotto = "Hold onto this feeling.";
          break;

        default:
          mood.LlmAnalysis = "Your mood shows a mix of signals.";
          mood.LlmAdvice = "Take a moment to check in with yourself.";
          mood.LlmMotto = "One step at a time.";
          break;
      }
    }
  }

  public record MoodAnalysisJob(Guid MoodId, string Prompt, Func<string, string> RetryPrompt);
}