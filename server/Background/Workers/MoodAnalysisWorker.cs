using server.Background.Queue;
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

        var response = await llmServices.PromptForJsonAsync<LlmMoodAnalysisresponse>(
          work.Prompt,
          previousReponse => work.RetryPrompt(previousReponse),
          stoppingToken
        );

        mood.LlmAdvice = response?.Advice;
        mood.LlmAnalysis = response?.Analysis;

        await moodRepository.UpdateMoodAsync(mood, stoppingToken);
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error processing mood analysis job");
      }
    }
  }

  public record MoodAnalysisJob(Guid MoodId, string Prompt, Func<string, string> RetryPrompt);
}