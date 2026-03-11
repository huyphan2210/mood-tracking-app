using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using server.Background.Queue;
using server.Background.Workers;
using server.Domain.Entities;
using server.DTOs.Mood;
using server.Repositories.MoodRepository;
using server.Services.LLMServices;

namespace server.UnitTests.Background
{
  public class MoodAnalysisWorkerTests
  {
    private readonly Mock<IBackgroundTaskQueue<MoodAnalysisJob>> _queueMock = new();
    private readonly Mock<IServiceScopeFactory> _scopeFactoryMock = new();
    private readonly Mock<IServiceScope> _scopeMock = new();
    private readonly Mock<IServiceProvider> _providerMock = new();
    private readonly Mock<ILLMServices> _llmServicesMock = new();
    private readonly Mock<IMoodRepository> _moodRepositoryMock = new();
    private readonly Mock<ILogger<MoodAnalysisWorker>> _logger = new();
    private readonly MoodAnalysisWorker _worker;

    public MoodAnalysisWorkerTests()
    {
      _scopeFactoryMock.Setup(factory => factory.CreateScope()).Returns(_scopeMock.Object);
      _scopeMock.Setup(scope => scope.ServiceProvider).Returns(_providerMock.Object);
      _providerMock.Setup(provider => provider.GetService(typeof(ILLMServices))).Returns(_llmServicesMock.Object);
      _providerMock.Setup(provider => provider.GetService(typeof(IMoodRepository))).Returns(_moodRepositoryMock.Object);

      _worker = new(_queueMock.Object, _scopeFactoryMock.Object, _logger.Object);
    }

    [Fact]
    public async Task HandleWorkAsync_ShouldCallAllMethods_Succeed()
    {
      var work = new MoodAnalysisJob(Guid.NewGuid(), "prompt", reponse => "retryPrompt");
      var mood = new Mood { MoodDescription = "" };

      _moodRepositoryMock.Setup(
        repos => repos.GetMoodByIdAsync(
          work.MoodId,
          It.IsAny<CancellationToken>()
          )
        ).ReturnsAsync(mood);

      _llmServicesMock.Setup(services =>
        services.PromptForJsonAsync<LlmMoodAnalysisresponse>(
          work.Prompt, work.RetryPrompt, It.IsAny<CancellationToken>()
        )
      ).ReturnsAsync(new LlmMoodAnalysisresponse { Advice = "Advice", Analysis = "Analysis" });

      await _worker.HandleWorkAsync(work, default);

      _moodRepositoryMock.Verify(repos => repos.GetMoodByIdAsync(work.MoodId, It.IsAny<CancellationToken>()), Times.Once);
      _llmServicesMock.Verify(services =>
        services.PromptForJsonAsync<LlmMoodAnalysisresponse>(
         work.Prompt, It.IsAny<Func<string, string>>(), It.IsAny<CancellationToken>()
        ), Times.Once);
      _moodRepositoryMock.Verify(repos => repos.UpdateMoodAsync(mood, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task HandleWorkAsync_ShouldCallGetMoodByIdAsyncOnly_Succeed()
    {
      var work = new MoodAnalysisJob(Guid.NewGuid(), "prompt", reponse => "retryPrompt");

      await _worker.HandleWorkAsync(work, default);

      _moodRepositoryMock.Verify(repos => repos.GetMoodByIdAsync(work.MoodId, It.IsAny<CancellationToken>()), Times.Once);
      _llmServicesMock.Verify(services =>
        services.PromptForJsonAsync<LlmMoodAnalysisresponse>(
         It.IsAny<string>(), It.IsAny<Func<string, string>>(), It.IsAny<CancellationToken>()
        ), Times.Never);
      _moodRepositoryMock.Verify(repos => repos.UpdateMoodAsync(It.IsAny<Mood>(), It.IsAny<CancellationToken>()), Times.Never);
    }
  }
}