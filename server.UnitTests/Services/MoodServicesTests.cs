using Microsoft.Extensions.Logging;
using Moq;
using server.Background.Queue;
using server.Background.Workers;
using server.Domain.Entities;
using server.Domain.Enums.Mood;
using server.DTOs.Mood.Requests;
using server.Repositories.MoodRepository;
using server.Services.AuthenticationServices;
using server.Services.MoodServices;

namespace server.UnitTests.Services
{
  public class MoodServicesTests
  {
    private readonly Mock<IAuthenticationServices> _authenticationServicesMock = new();
    private readonly Mock<IMoodRepository> _moodRepositoryMock = new();
    private readonly Mock<IBackgroundTaskQueue<MoodAnalysisJob>> _queueMock = new();
    private readonly Mock<ILogger<MoodServices>> _loggerMock = new();
    private readonly MoodServices _moodServices;

    public MoodServicesTests()
    {
      _moodServices = new(
        _authenticationServicesMock.Object,
        _moodRepositoryMock.Object,
        _queueMock.Object,
        _loggerMock.Object
      );
    }

    [Fact]
    public async Task AnalyzeMoodAsync_ShouldCallMethodsFromOtherClasses_Succeed()
    {
      var user = new User();
      var request = new AnalyzeMoodRequestPOST
      {
        Feelings = [Feeling.Stressed],
        Mood = MoodName.Sad,
        SleepHours = SleepHours.ThreeToFour,
        MoodDescription = "Test Mood Description"
      };

      _authenticationServicesMock.Setup(services => services.FindUserByIdAsync(It.IsAny<Guid>())).ReturnsAsync(user);
      _moodRepositoryMock.Setup(repos => repos.CreateMoodAsync(It.IsAny<Mood>())).ReturnsAsync(
        new Mood
        {
          Feelings = [Feeling.Stressed],
          MoodName = MoodName.Sad,
          SleepHours = SleepHours.ThreeToFour,
          MoodDescription = "Test Mood Description",
          UserId = user.Id
        });

      await _moodServices.AnalyzeMoodAsync(request, user.Id);

      _authenticationServicesMock.Verify(service => service.FindUserByIdAsync(user.Id), Times.Once);
      _moodRepositoryMock.Verify(repos => repos.CreateMoodAsync(It.IsAny<Mood>()), Times.Once);
      _queueMock.Verify(queue => queue.Queue(It.IsAny<MoodAnalysisJob>()), Times.Once);
    }
  }
}